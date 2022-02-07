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
    ObjectIdentifier,
} from "asn1-ts";
import { DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";
import {
    collectiveExclusions,
} from "@wildboar/x500/src/lib/modules/InformationFramework/collectiveExclusions.oa";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const cexs = await ctx.db.entryCollectiveExclusion.findMany({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            collectiveExclusion: true,
        },
    });
    return cexs.map((cex) => ({
        type: collectiveExclusions["&id"],
        value: _encodeObjectIdentifier(ObjectIdentifier.fromString(cex.collectiveExclusion), DER),
    }));
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.entryCollectiveExclusion.upsert({
        where: {
            entry_id_collectiveExclusion: {
                entry_id: vertex.dse.id,
                collectiveExclusion: value.value.objectIdentifier.toString(),
            },
        },
        create: {
            entry_id: vertex.dse.id,
            collectiveExclusion: value.value.objectIdentifier.toString(),
        },
        update: {},
    }));
};

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.entryCollectiveExclusion.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            collectiveExclusion: value.value.objectIdentifier.toString(),
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.entryCollectiveExclusion.deleteMany({
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
    return ctx.db.entryCollectiveExclusion.count({
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
    return !!(await ctx.db.entryCollectiveExclusion.count({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    return !!(await ctx.db.entryCollectiveExclusion.count({
        where: {
            entry_id: vertex.dse.id,
            collectiveExclusion: value.value.objectIdentifier.toString(),
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
