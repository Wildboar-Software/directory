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
    BERElement,
} from "asn1-ts";
import {
    ditBridgeKnowledge,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/ditBridgeKnowledge.oa";
import {
    _decode_DitBridgeKnowledge,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DitBridgeKnowledge.ta";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";


export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.immediateSuperior || !vertex.dse.root || !vertex.dse.ditBridge) {
        return [];
    }
    return (await ctx.db.ditBridgeKnowledge.findMany())
        .map((dbk) => {
            const value = new BERElement();
            value.fromBytes(dbk.ber);
            return {
                type: ditBridgeKnowledge["&id"],
                value,
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
    if (vertex.immediateSuperior || !vertex.dse.root || !vertex.dse.ditBridge) {
        return;
    }
    const dbk = _decode_DitBridgeKnowledge(value.value);
    pendingUpdates.otherWrites.push(ctx.db.ditBridgeKnowledge.create({
        data: {
            domain_local_id: dbk.domainLocalID
                ? directoryStringToString(dbk.domainLocalID)
                : undefined,
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
    if (vertex.immediateSuperior || !vertex.dse.root || !vertex.dse.ditBridge) {
        return;
    }
    pendingUpdates.otherWrites.push(ctx.db.ditBridgeKnowledge.deleteMany({
        where: {
            ber: Buffer.from(value.value.toBytes()),
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.ditBridgeKnowledge.deleteMany());
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    if (vertex.immediateSuperior || !vertex.dse.root || !vertex.dse.ditBridge) {
        return 0;
    }
    return ctx.db.ditBridgeKnowledge.count();
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return Boolean(!vertex.immediateSuperior && vertex.dse.root && vertex.dse.ditBridge);
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    return !!(await ctx.db.ditBridgeKnowledge.findFirst({
        where: {
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
