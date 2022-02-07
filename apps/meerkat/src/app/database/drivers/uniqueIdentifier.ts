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
import {
    DERElement,
    ASN1TagClass,
    ASN1UniversalType,
} from "asn1-ts";
import {
    uniqueIdentifier,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uniqueIdentifier.oa";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return (await ctx.db.uniqueIdentifier.findMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }))
        .map((dbuid) => {
            const el = new DERElement();
            el.value = dbuid.uniqueIdentifier;
            el.tagClass = ASN1TagClass.universal;
            el.tagNumber = ASN1UniversalType.bitString;
            return {
                type: uniqueIdentifier["&id"],
                value: el,
            };
        });
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    // We do this to normalize the bit string.
    const bits = value.value.bitString;
    const el = new DERElement();
    el.bitString = bits;
    pendingUpdates.otherWrites.push(ctx.db.uniqueIdentifier.create({
        data: {
            entry_id: vertex.dse.id,
            uniqueIdentifier: Buffer.from(el.value),
        },
    }));
};

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.uniqueIdentifier.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            uniqueIdentifier: Buffer.from(value.value.value),
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.uniqueIdentifier.deleteMany({
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
    return ctx.db.uniqueIdentifier.count({
        where: {
            entry_id: vertex.dse.id,
        },
    });
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
) => {
    return !!(await ctx.db.uniqueIdentifier.findFirst({
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
) => {
    return !!(await ctx.db.uniqueIdentifier.findFirst({
        where: {
            entry_id: vertex.dse.id,
            uniqueIdentifier: Buffer.from(value.value.value),
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
