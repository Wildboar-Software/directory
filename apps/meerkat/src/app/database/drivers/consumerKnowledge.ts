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
import { DER } from "asn1-ts/dist/node/functional";
import {
    consumerKnowledge,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/consumerKnowledge.oa";
import { Knowledge } from "@prisma/client";
import rdnToJson from "../../x500/rdnToJson";
import { ipv4FromNSAP } from "@wildboar/x500/src/lib/distributed/ipv4";
import { uriFromNSAP } from "@wildboar/x500/src/lib/distributed/uri";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import getEqualityMatcherGetter from "../../x500/getEqualityMatcherGetter";
import IPV4_AFI_IDI from "@wildboar/x500/src/lib/distributed/IPV4_AFI_IDI";

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
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.create({
        data: {
            ae_title: decoded.ae_title.rdnSequence.map(rdnToJson),
            entry_id: vertex.dse.id,
            ber: Buffer.from(value.value.toBytes()),
            knowledge_type: Knowledge.CONSUMER,
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
                            for (let i = 0; i < IPV4_AFI_IDI.length; i++) {
                                if (nsap[i] !== IPV4_AFI_IDI[i]) {
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
    const decoded = consumerKnowledge.decoderFor["&Type"]!(value.value);
    if (vertex.dse.cp?.consumerKnowledge) {
        vertex.dse.cp.consumerKnowledge = vertex.dse.cp.consumerKnowledge
            .filter((k) => !(
                (k.agreementID === decoded.agreementID)
                && compareDistinguishedName(
                    k.ae_title.rdnSequence,
                    decoded.ae_title.rdnSequence,
                    getEqualityMatcherGetter(ctx),
                )
            ));
    }
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.CONSUMER,
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
    if (vertex.dse.cp?.consumerKnowledge) {
        vertex.dse.cp.consumerKnowledge = undefined;
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
                getEqualityMatcherGetter(ctx),
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
