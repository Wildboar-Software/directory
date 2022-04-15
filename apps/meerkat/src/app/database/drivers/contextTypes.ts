import type {
    Context,
    Vertex,
    Value,
    PendingUpdates,
    AttributeTypeDatabaseDriver,
    SpecialAttributeDatabaseReader,
    SpecialAttributeDatabaseEditor,
    SpecialAttributeDatabaseRemover,
    SpecialAttributeCounter,
    SpecialAttributeDetector,
    SpecialAttributeValueDetector,
    ContextTypeInfo,
} from "@wildboar/meerkat-types";
import { TRUE, ObjectIdentifier } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import { contextTypes } from "@wildboar/x500/src/lib/modules/SchemaAdministration/contextTypes.oa";
import { subschema } from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";
import {
    ContextDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ContextDescription.ta";
import {
    ContextInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ContextInformation.ta";
import type { Prisma } from "@prisma/client";
import compareElements from "@wildboar/x500/src/lib/comparators/compareElements";

const SUBSCHEMA: string = subschema["&id"].toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    const fromThisSubentry = (await ctx.db.contextDescription.findMany({
        where: {
            entry_id: null,
        },
    }))
        .map((cd) => new ContextDescription(
            ObjectIdentifier.fromString(cd.identifier),
            cd.name?.split("|").map((name) => ({ uTF8String: name })),
            cd.description
                ? {
                    uTF8String: cd.description,
                }
                : undefined,
            cd.obsolete,
            new ContextInformation(
                {
                    uTF8String: cd.syntax
                },
                cd.assertionSyntax
                    ? {
                        uTF8String: cd.assertionSyntax
                    }
                    : undefined,
            ),
        ));

    const dseOwnedByThisDSA: boolean = (!vertex.dse.rhob && !vertex.dse.shadow);
    if (!dseOwnedByThisDSA) {
        return fromThisSubentry
            .map((value) => ({
                type: contextTypes["&id"],
                value: contextTypes.encoderFor["&Type"]!(value, DER),
            }));
    }
    const indexedByOID: Map<string, ContextDescription> = new Map(
        Array.from(ctx.contextTypes.entries())
            .filter(([ k ]) => (k.indexOf(".") > -1)) // Dedupes entries by only using OIDs, not descriptors.
            .map(([ oid, ct ]) => [
                oid,
                new ContextDescription(
                    ct.id,
                    ct.name?.map((name) => ({
                        uTF8String: name,
                    })),
                    ct.description
                        ? {
                            uTF8String: ct.description,
                        }
                        : undefined,
                    ct.obsolete,
                    new ContextInformation(
                        {
                            uTF8String: ct.syntax
                        },
                        ct.assertionSyntax
                            ? {
                                uTF8String: ct.assertionSyntax
                            }
                            : undefined,
                    ),
                ),
            ]),
    );
    for (const ct of fromThisSubentry) {
        indexedByOID.set(ct.identifier.toString(), ct);
    }
    return Array.from(indexedByOID.values())
        .map((value) => ({
            type: contextTypes["&id"],
            value: contextTypes.encoderFor["&Type"]!(value, DER),
        }));
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const dseOwnedByThisDSA: boolean = (!vertex.dse.rhob && !vertex.dse.shadow);
    const decoded = contextTypes.decoderFor["&Type"]!(value.value);
    const OID: string = decoded.identifier.toString();
    const names: string[] | undefined = decoded.name?.map(directoryStringToString);
    const name: string | undefined = names
        ?.map((str) => str.replace(/\|/g, ""))
        .join("|");
    const description = decoded.description
        ? directoryStringToString(decoded.description)
        : undefined;
    const create: Prisma.ContextDescriptionCreateInput = {
        identifier: OID,
        name,
        description,
        obsolete: decoded.obsolete,
        syntax: directoryStringToString(decoded.information.syntax),
        assertionSyntax: decoded.information.assertionSyntax
            ? directoryStringToString(decoded.information.assertionSyntax)
            : undefined,
    };
    pendingUpdates.otherWrites.push(ctx.db.contextDescription.upsert({
        where: {
            entry_id_identifier: {
                entry_id: vertex.dse.id,
                identifier: OID,
            },
        },
        create: {
            ...create,
            entry: {
                connect: {
                    id: vertex.dse.id,
                },
            },
        },
        update: {
            ...create,
        },
    }));

    /**
     * If the context type is being added to a DSE that is owned by this DSA, it
     * becomes a universally-defined schema object within this DSA, as long as
     * it has not already been defined (e.g. on a first-come-first-served basis.)
     */
     if (dseOwnedByThisDSA) {
        /**
         * NOTE: For some reason, we can't use an upsert() because Prisma does
         * not allow you to upsert via a composite key where one member of the
         * key is NULL. So we have to check if there is already exists such
         * a schema object in a separate query.
         */
        const universallyDefinedAlready: boolean = !!(await ctx.db.contextDescription.findFirst({
            where: {
                entry_id: null,
                identifier: OID,
            },
            select: {
                id: true,
            },
        }));
        if (!universallyDefinedAlready && !ctx.contextTypes.has(OID)) {
            ctx.db.contextDescription.create({ // INTENTIONAL_NO_AWAIT
                data: {
                    ...create,
                },
            })
                .then()
                .catch(); // TODO: Log something.
        }
        const info: ContextTypeInfo = {
            id: decoded.identifier,
            name: names,
            description,
            obsolete: decoded.obsolete,
            /**
             * For some reason, you cannot specify ABSENT-MATCH in
             * `ContextDescription`. This defaults to TRUE.
             */
            absentMatch: TRUE,
            /**
             * ...you also cannot specify a DEFAULT-VALUE.
             */
            defaultValue: undefined,
            validator: undefined,
            syntax: directoryStringToString(decoded.information.syntax),
            assertionSyntax: decoded.information.assertionSyntax
                ? directoryStringToString(decoded.information.assertionSyntax)
                : undefined,
            matcher: compareElements, // FIXME:
        };
        ctx.contextTypes.set(OID, info);
        let longestName: number = 0;
        for (const name of (names ?? [])) {
            ctx.contextTypes.set(name, info);
            ctx.contextTypes.set(name.trim().toLowerCase(), info);
            ctx.nameToObjectIdentifier.set(name, info.id);
            ctx.nameToObjectIdentifier.set(name.trim().toLowerCase(), info.id);
            if (name.trim().length > longestName) {
                ctx.objectIdentifierToName.set(info.id.toString(), name);
                longestName = name.length;
            }
        }
    }
};

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = contextTypes.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.contextDescription.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            identifier: decoded.identifier.toString(),
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.contextDescription.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return 0;
    }
    const dseOwnedByThisDSA: boolean = (!vertex.dse.rhob && !vertex.dse.shadow);
    if (!dseOwnedByThisDSA) {
        return ctx.db.contextDescription.count({
            where: {
                entry_id: vertex.dse.id,
            },
        });
    }
    const oids: Set<string> = new Set([
        ...Array.from(ctx.attributeTypes.keys())
            .filter((key) => (key.indexOf(".") > -1)),
        ...(await ctx.db.contextDescription.findMany({
            where: {
                entry_id: vertex.dse.id,
            },
            select: {
                identifier: true,
            },
        })).map(({ identifier }) => identifier),
    ]);
    return oids.size;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return Boolean(vertex.dse.subentry && vertex.dse.objectClass.has(SUBSCHEMA));
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return false;
    }
    const decoded = contextTypes.decoderFor["&Type"]!(value.value);
    const OID: string = decoded.identifier.toString();
    const dseOwnedByThisDSA: boolean = (!vertex.dse.rhob && !vertex.dse.shadow);
    if (dseOwnedByThisDSA && ctx.contextTypes.has(OID)) {
        return true;
    }
    return !!(await ctx.db.contextDescription.findFirst({
        where: {
            entry_id: vertex.dse.id,
            identifier: OID,
        },
    }));
};

export
const driver: AttributeTypeDatabaseDriver = {
    readValues,
    addValue,
    removeValue,
    removeAttribute,
    countValues,
    isPresent,
    hasValue,
};

export default driver;
