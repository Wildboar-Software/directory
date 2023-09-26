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
} from "@wildboar/meerkat-types";
import { DER } from "asn1-ts/dist/node/functional";
import { dITContextUse } from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITContextUse.oa";
import { subschema } from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";

const SUBSCHEMA: string = subschema["&id"].toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return vertex.dse.subentry.ditContextUse?.map((cur) => ({
        type: dITContextUse["&id"],
        value: dITContextUse.encoderFor["&Type"]!(cur, DER),
    })) ?? [];
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = dITContextUse.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.contextUseRule.upsert({
        where: {
            entry_id_attributeType: {
                entry_id: vertex.dse.id,
                attributeType: decoded.identifier.toString(),
            },
        },
        create: {
            entry_id: vertex.dse.id,
            attributeType: decoded.identifier.toString(),
            name: decoded.name
                ? decoded.name
                    .map(directoryStringToString)
                    .map((str) => str.replace(/\|/g, ""))
                    .join("|")
                : null,
            description: decoded.description
                ? directoryStringToString(decoded.description)
                : undefined,
            obsolete: decoded.obsolete,
            mandatory: decoded.information.mandatoryContexts
                ?.map((oid) => oid.toString())
                .join(" "),
            optional: decoded.information.optionalContexts
                ?.map((oid) => oid.toString())
                .join(" "),
        },
        update: {
            name: decoded.name
                ? decoded.name
                    .map(directoryStringToString)
                    .map((str) => str.replace(/\|/g, ""))
                    .join("|")
                : null,
            description: decoded.description
                ? directoryStringToString(decoded.description)
                : undefined,
            obsolete: decoded.obsolete,
            mandatory: decoded.information.mandatoryContexts
                ?.map((oid) => oid.toString())
                .join(" "),
            optional: decoded.information.optionalContexts
                ?.map((oid) => oid.toString())
                .join(" "),
        },
        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
    }));
    if (vertex.dse.subentry) {
        if (vertex.dse.subentry.ditContextUse) {
            vertex.dse.subentry.ditContextUse.push(decoded);
        } else {
            vertex.dse.subentry.ditContextUse = [ decoded ];
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
    const decoded = dITContextUse.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.contextUseRule.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            attributeType: decoded.identifier.toString(),
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.contextUseRule.deleteMany({
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
    return ctx.db.contextUseRule.count({
        where: {
            entry_id: vertex.dse.id,
        },
    });
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return !!(await ctx.db.contextUseRule.findFirst({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            id: true,
        },
    }));
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    const decoded = dITContextUse.decoderFor["&Type"]!(value.value);
    return !!(await ctx.db.contextUseRule.findFirst({
        where: {
            entry_id: vertex.dse.id,
            attributeType: decoded.identifier.toString(),
        },
        select: {
            id: true,
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
