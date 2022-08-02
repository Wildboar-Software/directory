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
    superiorKnowledge,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/superiorKnowledge.oa";
import rdnToJson from "../../x500/rdnToJson";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import isFirstLevelDSA from "../../dit/isFirstLevelDSA";
import saveAccessPoint from "../saveAccessPoint";
import compareRDNSequence from "@wildboar/x500/src/lib/comparators/compareRDNSequence";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.root) {
        return [];
    }
    const firstLevel: boolean = await isFirstLevelDSA(ctx);
    if (firstLevel) {
        return [];
    }
    return vertex.dse.supr?.superiorKnowledge.map((k) => ({
        type: superiorKnowledge["&id"],
        value: superiorKnowledge.encoderFor["&Type"]!(k, DER),
    })) ?? [];
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    if (!vertex.dse.root) {
        return;
    }
    const decoded = superiorKnowledge.decoderFor["&Type"]!(value.value);
    if (vertex.dse.supr) {
        if (vertex.dse.supr.superiorKnowledge) {
            vertex.dse.supr.superiorKnowledge.push(decoded);
        } else {
            vertex.dse.supr.superiorKnowledge = [ decoded ];
        }
    } else {
        vertex.dse.supr = {
            superiorKnowledge: [ decoded ],
        };
    }
    // We create the access point now...
    const apid = await saveAccessPoint(ctx, decoded, Knowledge.SUPERIOR);
    // But within the transaction, we associate them with this DSE.
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.updateMany({
        where: {
            id: apid,
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
    if (!vertex.dse.supr) {
        return;
    }
    const decoded = superiorKnowledge.decoderFor["&Type"]!(value.value);
    vertex.dse.supr.superiorKnowledge = vertex.dse.supr.superiorKnowledge
        .filter((k) => !compareDistinguishedName(
            k.ae_title.rdnSequence,
            decoded.ae_title.rdnSequence,
            getNamingMatcherGetter(ctx),
        ));
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SUPERIOR,
            OR: [
                {
                    ber: Buffer.from(value.value.toBytes().buffer),
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
    delete vertex.dse.supr;
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SUPERIOR,
        },
    }));
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    return vertex.dse.supr?.superiorKnowledge?.length ?? 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return Boolean(vertex.dse.supr?.superiorKnowledge?.length);
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    if (vertex.immediateSuperior || !vertex.dse.root || !vertex.dse.supr?.superiorKnowledge?.length) {
        return false;
    }
    const decoded = superiorKnowledge.decoderFor["&Type"]!(value.value);
    return vertex.dse.supr.superiorKnowledge.some((sk) => compareRDNSequence(
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
