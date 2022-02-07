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
import { Knowledge } from "@prisma/client";
import { DER } from "asn1-ts/dist/node/functional";
import {
    secondaryShadows,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/secondaryShadows.oa";
import rdnToJson from "../../x500/rdnToJson";
import saveAccessPoint from "../saveAccessPoint";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.cp?.secondaryShadows?.length) {
        return [];
    }
    return vertex.dse.cp.secondaryShadows.map((s) => ({
        type: secondaryShadows["&id"],
        value: secondaryShadows.encoderFor["&Type"]!(s, DER),
    }));
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = secondaryShadows.decoderFor["&Type"]!(value.value);
    if (vertex.dse.cp) {
        if (vertex.dse.cp.secondaryShadows) {
            vertex.dse.cp.secondaryShadows.push(decoded);
        } else {
            vertex.dse.cp.secondaryShadows = [ decoded ];
        }
    }
    const ssid = await saveAccessPoint(ctx, decoded, Knowledge.SECONDARY_SUPPLIER);
    const cids = await Promise.all(decoded.consumers.map((c) => saveAccessPoint(ctx, c, Knowledge.SECONDARY_CONSUMER)));
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.updateMany({
        where: {
            id: {
                in: [ ssid, ...cids ],
            },
        },
        data: {
            entry_id: vertex.dse.id,
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
    const decoded = secondaryShadows.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SECONDARY_SUPPLIER,
            OR: [
                {
                    ber: Buffer.from(value.value.toBytes()),
                },
                {
                    ae_title: {
                        equals: decoded.ae_title.rdnSequence.map(rdnToJson),
                    },
                },
            ],
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    if (vertex.dse.cp?.secondaryShadows) {
        delete vertex.dse.cp.secondaryShadows;
    }
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            OR: [
                {
                    knowledge_type: Knowledge.SECONDARY_SUPPLIER,
                },
                {
                    knowledge_type: Knowledge.SECONDARY_CONSUMER,
                },
            ],
        },
    }));
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    return vertex.dse.cp?.secondaryShadows?.length ?? 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return Boolean(vertex.dse.cp?.secondaryShadows?.length);
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    if (!vertex.dse.cp) {
        return false;
    }
    const decoded = secondaryShadows.decoderFor["&Type"]!(value.value);
    return !!(await ctx.db.accessPoint.findFirst({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SECONDARY_SUPPLIER,
            active: true,
            OR: [
                {
                    ber: Buffer.from(value.value.toBytes()),
                },
                {
                    ae_title: {
                        equals: decoded.ae_title.rdnSequence.map(rdnToJson),
                    },
                },
            ],
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
