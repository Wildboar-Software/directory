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
    nonSpecificKnowledge,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/nonSpecificKnowledge.oa";
import { DER } from "asn1-ts/dist/node/functional";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.nssr?.nonSpecificKnowledge?.length) {
        return [];
    }
    return vertex.dse.nssr.nonSpecificKnowledge.map((k) => ({
        type: nonSpecificKnowledge["&id"],
        value: nonSpecificKnowledge.encoderFor["&Type"]!(k, DER),
    }));
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.nonSpecificKnowledge.create({
        data: {
            entry_id: vertex.dse.id,
            ber: Buffer.from(value.value.toBytes()),
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
    pendingUpdates.otherWrites.push(ctx.db.nonSpecificKnowledge.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            ber: Buffer.from(value.value.toBytes()),
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover  = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    if (!vertex.dse.nssr?.nonSpecificKnowledge?.length) {
        return;
    }
    vertex.dse.nssr.nonSpecificKnowledge = [];
    pendingUpdates.otherWrites.push(ctx.db.nonSpecificKnowledge.deleteMany({
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
    return vertex.dse.nssr?.nonSpecificKnowledge?.length ?? 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return Boolean(vertex.dse.nssr?.nonSpecificKnowledge?.length);
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    return !!(await ctx.db.nonSpecificKnowledge.count({
        where: {
            entry_id: vertex.dse.id,
            ber: Buffer.from(value.value.toBytes()),
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
