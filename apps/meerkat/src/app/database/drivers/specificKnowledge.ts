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
    specificKnowledge,
} from "@wildboar/x500/DSAOperationalAttributeTypes";
import saveAccessPoint from "../saveAccessPoint.js";
import { compareRDNSequence } from "@wildboar/x500";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter.js";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.dse.subr) {
        return [
            {
                type: specificKnowledge["&id"],
                value: specificKnowledge.encoderFor["&Type"]!(vertex.dse.subr.specificKnowledge, DER),
            }
        ];
    }
    if (vertex.dse.immSupr) {
        return [
            {
                type: specificKnowledge["&id"],
                value: specificKnowledge.encoderFor["&Type"]!(vertex.dse.immSupr.specificKnowledge, DER),
            }
        ];
    }
    if (vertex.dse.xr) {
        return [
            {
                type: specificKnowledge["&id"],
                value: specificKnowledge.encoderFor["&Type"]!(vertex.dse.xr.specificKnowledge, DER),
            }
        ];
    }
    return [];
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = specificKnowledge.decoderFor["&Type"]!(value.value);
    if (vertex.dse.subr) {
        vertex.dse.subr.specificKnowledge = decoded;
    }
    if (vertex.dse.immSupr) {
        vertex.dse.immSupr.specificKnowledge = decoded;
    }
    if (vertex.dse.xr) {
        vertex.dse.xr.specificKnowledge = decoded;
    }
    // REVIEW: Why was this here?
    // pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
    //     where: {
    //         entry_id: vertex.dse.id,
    //         knowledge_type: Knowledge.SPECIFIC,
    //     },
    // }));
    // We create the access points now...
    const createdAccessPointIds = await Promise.all(
        decoded.map((mosap) => saveAccessPoint(ctx, mosap, Knowledge.SPECIFIC)));
    // But within the transaction, we associate them with this DSE.
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.updateMany({
        where: {
            id: {
                in: createdAccessPointIds,
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
    const sk = vertex.dse.subr?.specificKnowledge
        ?? vertex.dse.immSupr?.specificKnowledge
        ?? vertex.dse.xr?.specificKnowledge;
    if (!sk || (sk.length !== value.value.set.length)) {
        return;
    }
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SPECIFIC,
            ber: value.value.toBytes(),
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    if (vertex.dse.subr) {
        vertex.dse.subr.specificKnowledge = [];
    }
    if (vertex.dse.immSupr) {
        vertex.dse.immSupr.specificKnowledge = [];
    }
    if (vertex.dse.xr) {
        vertex.dse.xr.specificKnowledge = [];
    }
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SPECIFIC,
        },
    }));
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    return (
        vertex.dse.subr?.specificKnowledge?.length
        || vertex.dse.immSupr?.specificKnowledge?.length
        || vertex.dse.xr?.specificKnowledge?.length
    )
        ? 1
        : 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return (
        Boolean(vertex.dse.subr?.specificKnowledge?.length)
        || Boolean(vertex.dse.immSupr?.specificKnowledge?.length)
        || Boolean(vertex.dse.xr?.specificKnowledge?.length)
    );
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    const decoded = specificKnowledge.decoderFor["&Type"]!(value.value);
    const aps = vertex.dse.subr?.specificKnowledge
        ?? vertex.dse.immSupr?.specificKnowledge
        ?? vertex.dse.xr?.specificKnowledge;
    if (!aps) {
        return false;
    }
    if (aps.length !== decoded.length) {
        return false;
    }
    // REVIEW: This runs in O(n^2) time.
    return aps
        .every((a) => decoded
            .some((b) => compareRDNSequence(
                a.ae_title.rdnSequence,
                b.ae_title.rdnSequence,
                getNamingMatcherGetter(ctx),
            )));
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
