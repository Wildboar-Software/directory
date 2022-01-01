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
    specificKnowledge,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/specificKnowledge.oa";
import saveAccessPoint from "../saveAccessPoint";
import compareRDNSequence from "@wildboar/x500/src/lib/comparators/compareRDNSequence";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return vertex.dse.subr?.specificKnowledge
        ? [
            {
                type: specificKnowledge["&id"],
                value: specificKnowledge.encoderFor["&Type"]!(vertex.dse.subr.specificKnowledge, DER),
            }
        ]
        : [];
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
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SPECIFIC,
        },
    }));
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
    if (
        !vertex.dse.subr?.specificKnowledge?.length
        || (vertex.dse.subr.specificKnowledge.length !== value.value.set.length)
    ) {
        return;
    }
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SPECIFIC,
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
    if (!vertex.dse.subr?.specificKnowledge?.length) {
        return;
    }
    vertex.dse.subr.specificKnowledge = [];
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
