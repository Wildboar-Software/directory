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
    NameFormInfo,
} from "@wildboar/meerkat-types";
import { DER } from "asn1-ts/dist/node/functional";
import { nameForms } from "@wildboar/x500/src/lib/modules/SchemaAdministration/nameForms.oa";
import { subschema } from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";
import {
    NameFormDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/NameFormDescription.ta";
import {
    NameFormInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/NameFormInformation.ta";
import { ObjectIdentifier } from "asn1-ts";
import type { Prisma } from "@prisma/client";

const SUBSCHEMA: string = subschema["&id"].toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    const dseOwnedByThisDSA: boolean = (!vertex.dse.rhob && !vertex.dse.shadow);
    const fromThisSubentry = (await ctx.db.nameForm.findMany({
        where: {
            entry_id: null,
        },
    }))
        .map((nf) => new NameFormDescription(
            ObjectIdentifier.fromString(nf.identifier),
            nf.name?.split("|").map((name) => ({ uTF8String: name })),
            nf.description
                ? {
                    uTF8String: nf.description,
                }
                : undefined,
            nf.obsolete,
            new NameFormInformation(
                ObjectIdentifier.fromString(nf.namedObjectClass),
                nf.mandatoryAttributes.split(" ").map(ObjectIdentifier.fromString),
                nf.optionalAttributes?.split(" ").map(ObjectIdentifier.fromString),
            ),
        ));
    if (!dseOwnedByThisDSA) {
        return fromThisSubentry
            .map((value) => ({
                type: nameForms["&id"],
                value: nameForms.encoderFor["&Type"]!(value, DER),
            }));
    }
    const indexedByOID: Map<string, NameFormDescription> = new Map(
        Array.from(ctx.nameForms.entries())
            .filter(([ k ]) => (k.indexOf(".") > -1))
            .map(([ oid, nf ]) => [
                oid,
                new NameFormDescription(
                    nf.id,
                    nf.name?.map((name) => ({
                        uTF8String: name,
                    })),
                    nf.description
                        ? {
                            uTF8String: nf.description,
                        }
                        : undefined,
                    nf.obsolete,
                    new NameFormInformation(
                        nf.namedObjectClass,
                        nf.mandatoryAttributes,
                        nf.optionalAttributes,
                    ),
                ),
            ]),
    );
    for (const nf of fromThisSubentry) {
        indexedByOID.set(nf.identifier.toString(), nf);
    }
    return Array.from(indexedByOID.values())
        .map((value) => ({
            type: nameForms["&id"],
            value: nameForms.encoderFor["&Type"]!(value, DER),
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
    const decoded = nameForms.decoderFor["&Type"]!(value.value);
    const OID: string = decoded.identifier.toString();
    const names: string[] | undefined = decoded.name?.map(directoryStringToString);
    const name: string | undefined = names
            ?.map((str) => str.replace(/\|/g, ""))
            .join("|");
    const description = decoded.description
        ? directoryStringToString(decoded.description)
        : undefined;
    const create: Prisma.NameFormCreateInput = {
        identifier: OID,
        name,
        description,
        obsolete: decoded.obsolete,
        namedObjectClass: decoded.information.subordinate.toString(),
        mandatoryAttributes: decoded.information.namingMandatories
            .map((oid) => oid.toString())
            .join(" "),
        optionalAttributes: decoded.information.namingOptionals
            ?.map((oid) => oid.toString())
            .join(" "),
    };
    pendingUpdates.otherWrites.push(ctx.db.nameForm.upsert({
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
        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
    }));
    /**
     * If the name form is being added to a DSE that is owned by this DSA, it
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
        const universallyDefinedAlready: boolean = ctx.nameForms.has(OID)
            || !!(await ctx.db.nameForm.findFirst({
                where: {
                    entry_id: null,
                    identifier: OID,
                },
                select: {
                    id: true,
                },
            }));
        if (!universallyDefinedAlready) {
            ctx.db.nameForm.create({ // INTENTIONAL_NO_AWAIT
                data: {
                    ...create,
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            })
                .then()
                .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_save@name_form", { oid: OID, e }), {
                    oid: OID,
                    e,
                }));
            const info: NameFormInfo = {
                id: decoded.identifier,
                name: names,
                description,
                obsolete: decoded.obsolete,
                namedObjectClass: decoded.information.subordinate,
                mandatoryAttributes: decoded.information.namingMandatories,
                optionalAttributes: decoded.information.namingOptionals ?? [],
            };
            ctx.nameForms.set(OID, info);
            let longestName: number = 0;
            for (const name of (names ?? [])) {
                ctx.nameForms.set(name, info);
                ctx.nameForms.set(name.trim().toLowerCase(), info);
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
    const decoded = nameForms.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.nameForm.deleteMany({
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
    pendingUpdates.otherWrites.push(ctx.db.nameForm.deleteMany({
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
        return ctx.db.nameForm.count({
            where: {
                entry_id: vertex.dse.id,
            },
        });
    }
    const oids: Set<string> = new Set([
        ...Array.from(ctx.nameForms.keys())
            .filter((key) => (key.indexOf(".") > -1)),
        ...(await ctx.db.nameForm.findMany({
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
    const decoded = nameForms.decoderFor["&Type"]!(value.value);
    const OID: string = decoded.identifier.toString();
    const dseOwnedByThisDSA: boolean = (!vertex.dse.rhob && !vertex.dse.shadow);
    if (dseOwnedByThisDSA && ctx.nameForms.has(OID)) {
        return true;
    }
    return !!(await ctx.db.nameForm.findFirst({
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
