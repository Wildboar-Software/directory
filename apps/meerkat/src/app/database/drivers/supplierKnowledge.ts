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
import { DER } from "@wildboar/asn1/functional";
import {
    supplierKnowledge,
} from "@wildboar/x500/DSAOperationalAttributeTypes";
import rdnToJson from "../../x500/rdnToJson.js";
import saveAccessPoint from "../saveAccessPoint.js";
import { compareRDNSequence } from "@wildboar/x500";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter.js";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return vertex.dse.cp?.supplierKnowledge?.map((k) => ({
        type: supplierKnowledge["&id"],
        value: supplierKnowledge.encoderFor["&Type"]!(k, DER),
    })) ?? [];
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = supplierKnowledge.decoderFor["&Type"]!(value.value);
    if (vertex.dse.supr) {
        if (vertex.dse.supr.superiorKnowledge) {
            vertex.dse.supr.superiorKnowledge.push(decoded);
        } else {
            vertex.dse.supr.superiorKnowledge = [ decoded ];
        }
    }
    let nsmId: number | null = null;
    if (decoded.non_supplying_master) {
        nsmId = await saveAccessPoint(ctx, decoded.non_supplying_master, Knowledge.NON_SUPPLYING_MASTER);
        pendingUpdates.otherWrites.push(ctx.db.accessPoint.update({
            where: {
                id: nsmId,
            },
            data: {
                entry_id: vertex.dse.id,
            },
            select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
        }));
    }
    const supplierId = await saveAccessPoint(ctx, decoded, Knowledge.SUPPLIER);
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.update({
        where: {
            id: supplierId,
        },
        data: {
            entry_id: vertex.dse.id,
            non_supplying_master_id: nsmId,
        },
        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
    }));
};

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = supplierKnowledge.decoderFor["&Type"]!(value.value);
    if (vertex.dse.cp?.supplierKnowledge?.length) {
        vertex.dse.cp.supplierKnowledge = [];
    }
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SUPPLIER,
            OR: [
                {
                    ber: value.value.toBytes(),
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
    if (vertex.dse.cp?.supplierKnowledge?.length) {
        vertex.dse.cp.supplierKnowledge = [];
    }
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SUPPLIER,
        },
    }));
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    return vertex.dse.cp?.supplierKnowledge?.length ?? 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return Boolean(vertex.dse.cp?.supplierKnowledge?.length);
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    const decoded = supplierKnowledge.decoderFor["&Type"]!(value.value);
    if (!vertex.dse.cp?.supplierKnowledge?.length) {
        return false;
    }
    return vertex.dse.cp.supplierKnowledge.some((sk) => compareRDNSequence(
        decoded.ae_title.rdnSequence,
        sk.ae_title.rdnSequence,
        getNamingMatcherGetter(ctx),
    ));
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
