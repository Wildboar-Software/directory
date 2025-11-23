import type {
    Value,
    AttributeTypeDatabaseDriver,
    SpecialAttributeDatabaseReader,
    SpecialAttributeDatabaseEditor,
    SpecialAttributeDatabaseRemover,
    SpecialAttributeCounter,
    SpecialAttributeDetector,
    SpecialAttributeValueDetector,
    Context,
    Vertex,
    PendingUpdates,
} from "@wildboar/meerkat-types";
import { DER } from "@wildboar/asn1/functional";
import {
    consumerKnowledge,
} from "@wildboar/x500/DSAOperationalAttributeTypes";
import { Knowledge } from "@prisma/client";
import rdnToJson from "../../x500/rdnToJson.js";
import { compareDistinguishedName } from "@wildboar/x500";
import saveAccessPoint from "../saveAccessPoint.js";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter.js";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.cp?.consumerKnowledge?.length) {
        return [];
    }
    return vertex.dse.cp.consumerKnowledge.map((ck) => ({
        type: consumerKnowledge["&id"],
        value: consumerKnowledge.encoderFor["&Type"]!(ck, DER),
    }));
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = consumerKnowledge.decoderFor["&Type"]!(value.value);
    if (vertex.dse.cp) {
        if (vertex.dse.cp.consumerKnowledge) {
            vertex.dse.cp.consumerKnowledge.push(decoded);
        } else {
            vertex.dse.cp.consumerKnowledge = [ decoded ];
        }
    }
    const cid = await saveAccessPoint(ctx, decoded, Knowledge.CONSUMER);
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.update({
        where: {
            id: cid,
        },
        data: {
            entry_id: vertex.dse.id,
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
    const decoded = consumerKnowledge.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.CONSUMER,
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
    if (vertex.dse.cp?.consumerKnowledge) {
        delete vertex.dse.cp.consumerKnowledge;
    }
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.CONSUMER,
        },
    }));
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    return vertex.dse.cp?.consumerKnowledge?.length ?? 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return Boolean(vertex.dse.cp?.consumerKnowledge?.length);
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    if (!vertex.dse.cp?.consumerKnowledge?.length) {
        return false;
    }
    const decoded = consumerKnowledge.decoderFor["&Type"]!(value.value);
    return vertex.dse.cp.consumerKnowledge
        .some((k) => (
            (k.agreementID === decoded.agreementID)
            && compareDistinguishedName(
                k.ae_title.rdnSequence,
                decoded.ae_title.rdnSequence,
                getNamingMatcherGetter(ctx),
            )
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
