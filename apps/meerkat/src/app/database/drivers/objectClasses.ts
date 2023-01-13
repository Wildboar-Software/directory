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
    ObjectClassInfo,
} from "@wildboar/meerkat-types";
import {
    ObjectIdentifier,
} from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import { objectClasses } from "@wildboar/x500/src/lib/modules/SchemaAdministration/objectClasses.oa";
import { subschema } from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";
import {
    ObjectClassDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ObjectClassDescription.ta";
import {
    ObjectClassInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ObjectClassInformation.ta";
import {
    ObjectClassKind_abstract,
    ObjectClassKind_auxiliary,
    ObjectClassKind_structural,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { Prisma, ObjectClassKind as PrismaObjectClassKind } from "@prisma/client";

const SUBSCHEMA: string = subschema["&id"].toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    const fromThisSubentry = (await ctx.db.objectClassDescription.findMany({
        where: {
            entry_id: null,
        },
    }))
        .map((oc) => new ObjectClassDescription(
            ObjectIdentifier.fromString(oc.identifier),
            oc.name?.split("|").map((name) => ({ uTF8String: name })),
            oc.description
                ? {
                    uTF8String: oc.description,
                }
                : undefined,
            oc.obsolete,
            new ObjectClassInformation(
                oc.subclassOf?.split(" ").map(ObjectIdentifier.fromString),
                ({
                    [PrismaObjectClassKind.ABSTRACT]: ObjectClassKind_abstract,
                    [PrismaObjectClassKind.AUXILIARY]: ObjectClassKind_auxiliary,
                    [PrismaObjectClassKind.STRUCTURAL]: ObjectClassKind_structural,
                }[oc.kind]),
                oc.mandatories?.split(" ").map(ObjectIdentifier.fromString),
                oc.optionals?.split(" ").map(ObjectIdentifier.fromString),
            ),
        ));
    const dseOwnedByThisDSA: boolean = (!vertex.dse.rhob && !vertex.dse.shadow);
    if (!dseOwnedByThisDSA) {
        return fromThisSubentry
            .map((value) => ({
                type: objectClasses["&id"],
                value: objectClasses.encoderFor["&Type"]!(value, DER),
            }));
    }
    const indexedByOID: Map<string, ObjectClassDescription> = new Map(
        Array.from(ctx.objectClasses.entries())
            .filter(([ k ]) => (k.indexOf(".") > -1)) // Dedupes entries by only using OIDs, not descriptors.
            .map(([ oid, oc ]) => [
                oid,
                new ObjectClassDescription(
                    oc.id,
                    oc.name?.map((name) => ({
                        uTF8String: name,
                    })),
                    oc.description
                        ? {
                            uTF8String: oc.description,
                        }
                        : undefined,
                    oc.obsolete,
                    new ObjectClassInformation(
                        Array.from(oc.superclasses)
                            .map(ObjectIdentifier.fromString),
                        oc.kind,
                        Array.from(oc.mandatoryAttributes)
                            .map(ObjectIdentifier.fromString),
                        Array.from(oc.optionalAttributes)
                            .map(ObjectIdentifier.fromString),
                    ),
                ),
            ]),
    );
    for (const oc of fromThisSubentry) {
        indexedByOID.set(oc.identifier.toString(), oc);
    }
    return Array.from(indexedByOID.values())
        .map((value) => ({
            type: objectClasses["&id"],
            value: objectClasses.encoderFor["&Type"]!(value, DER),
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
    const decoded = objectClasses.decoderFor["&Type"]!(value.value);
    const OID: string = decoded.identifier.toString();
    const names: string[] | undefined = decoded.name?.map(directoryStringToString);
    const name: string | undefined = names
        ?.map((str) => str.replace(/\|/g, ""))
        .join("|");
    const description = decoded.description
        ? directoryStringToString(decoded.description)
        : undefined;
    const create: Prisma.ObjectClassDescriptionCreateInput = {
        identifier: OID,
        name,
        description,
        obsolete: decoded.obsolete,
        subclassOf: decoded.information.subclassOf
            ?.map((oid) => oid.toString())
            .join(" "),
        mandatories: decoded.information.mandatories?.map((attr) => attr.toString()).join(" "),
        optionals: decoded.information.optionals?.map((attr) => attr.toString()).join(" "),
        kind: (() => {
            switch (decoded.information.kind) {
            case (ObjectClassKind_abstract):
                return PrismaObjectClassKind.ABSTRACT;
            case (ObjectClassKind_auxiliary):
                return PrismaObjectClassKind.AUXILIARY
            case (ObjectClassKind_structural):
                return PrismaObjectClassKind.STRUCTURAL;
            default: return undefined;
            }
        })(),
        ldapDescription: description,
        ldapNames: names
            ?.map((str) => str.replace(/\|/g, ""))
            .join("|") ?? null,
    };
    pendingUpdates.otherWrites.push(ctx.db.objectClassDescription.upsert({
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
        select: null,
    }));

    /**
     * If the object class is being added to a DSE that is owned by this DSA, it
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
        const universallyDefinedAlready: boolean = ctx.objectClasses.has(OID)
            || !!(await ctx.db.objectClassDescription.findFirst({
                where: {
                    entry_id: null,
                    identifier: OID,
                },
                select: {
                    id: true,
                },
            }));
        if (!universallyDefinedAlready) {
            ctx.db.objectClassDescription.create({ // INTENTIONAL_NO_AWAIT
                data: {
                    ...create,
                },
                select: null,
            })
                .then()
                .catch(); // TODO: Log something.

            const info: ObjectClassInfo = {
                id: decoded.identifier,
                name: decoded.name?.map(directoryStringToString),
                description,
                obsolete: decoded.obsolete,
                superclasses: decoded.information.subclassOf
                    ? new Set(decoded.information.subclassOf.map((oid) => oid.toString()))
                    : new Set(),
                kind: decoded.information.kind ?? ObjectClassKind_structural,
                mandatoryAttributes: new Set(decoded.information.mandatories?.map((oid) => oid.toString())),
                optionalAttributes: new Set(decoded.information.optionals?.map((oid) => oid.toString())),
                ldapNames: decoded.name?.map(directoryStringToString),
                ldapDescription: description,
            };
            ctx.objectClasses.set(OID, info);
            let longestName: number = 0;
            for (const name of (names ?? [])) {
                ctx.objectClasses.set(name, info);
                ctx.objectClasses.set(name.trim().toLowerCase(), info);
                ctx.nameToObjectIdentifier.set(name, info.id);
                ctx.nameToObjectIdentifier.set(name.trim().toLowerCase(), info.id);
                if (name.trim().length > longestName) {
                    ctx.objectIdentifierToName.set(info.id.toString(), name);
                    longestName = name.length;
                }
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
    const decoded = objectClasses.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.objectClassDescription.deleteMany({
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
    pendingUpdates.otherWrites.push(ctx.db.objectClassDescription.deleteMany({
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
        return ctx.db.objectClassDescription.count({
            where: {
                entry_id: vertex.dse.id,
            },
        });
    }
    const oids: Set<string> = new Set([
        ...Array.from(ctx.objectClasses.keys())
            .filter((key) => (key.indexOf(".") > -1)),
        ...(await ctx.db.objectClassDescription.findMany({
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
    const decoded = objectClasses.decoderFor["&Type"]!(value.value);
    const OID: string = decoded.identifier.toString();
    const dseOwnedByThisDSA: boolean = (!vertex.dse.rhob && !vertex.dse.shadow);
    if (dseOwnedByThisDSA && ctx.objectClasses.has(OID)) {
        return true;
    }
    return !!(await ctx.db.objectClassDescription.findFirst({
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
