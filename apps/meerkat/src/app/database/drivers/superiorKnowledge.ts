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
import { ipv4FromNSAP } from "@wildboar/x500/src/lib/distributed/ipv4";
import { uriFromNSAP } from "@wildboar/x500/src/lib/distributed/uri";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import getEqualityMatcherGetter from "../../x500/getEqualityMatcherGetter";

// TODO: Put this in the X.500 library.
const commonPrefix: number[] = [
    0x54, // The AFI
    0x00, 0x72, 0x87, 0x22, // The IDI
];

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
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
    const decoded = superiorKnowledge.decoderFor["&Type"]!(value.value);
    if (vertex.dse.supr) {
        if (vertex.dse.supr.superiorKnowledge) {
            vertex.dse.supr.superiorKnowledge.push(decoded);
        } else {
            vertex.dse.supr.superiorKnowledge = [ decoded ];
        }
    }
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.create({
        data: {
            ae_title: decoded.ae_title.rdnSequence.map(rdnToJson),
            entry_id: vertex.dse.id,
            ber: Buffer.from(value.value.toBytes()),
            knowledge_type: Knowledge.SUPERIOR,
            NSAP: {
                createMany: {
                    data: decoded.address.nAddresses.map((nsap) => {
                        const url: string | undefined = ((): string | undefined => {
                            if (nsap[0] !== 0xFF) { // It is not a URL.
                                return undefined;
                            }
                            try {
                                const [ , uri ] = uriFromNSAP(nsap);
                                return uri;
                            } catch {
                                return undefined;
                            }
                        })();
                        const ip_and_port = ((): [ string, number | undefined ] | undefined => {
                            if (nsap[0] !== 0xFF) { // It is not a URL.
                                return undefined;
                            }
                            for (let i = 0; i < commonPrefix.length; i++) {
                                if (nsap[i] !== commonPrefix[i]) {
                                    return undefined;
                                }
                            }
                            const [ , ip, port ] = ipv4FromNSAP(nsap);
                            return [ Array.from(ip).join("."), port ];
                        })();
                        return {
                            ipv4: ip_and_port
                                ? ip_and_port[0]
                                : undefined,
                            tcp_port: ip_and_port
                                ? ip_and_port[1]
                                : undefined,
                            url,
                            bytes: Buffer.from(nsap),
                        };
                    }),
                },
            },
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
            getEqualityMatcherGetter(ctx),
        ));
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SUPERIOR,
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
    if (vertex.dse.supr?.superiorKnowledge) {
        vertex.dse.supr.superiorKnowledge = [];
    }
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
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return false;
    }
    return !!(await ctx.db.accessPoint.findFirst({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SUPERIOR,
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
