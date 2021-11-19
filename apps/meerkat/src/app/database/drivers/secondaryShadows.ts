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
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.create({
        data: {
            ae_title: decoded.ae_title.rdnSequence.map(rdnToJson),
            entry_id: vertex.dse.id,
            ber: Buffer.from(value.value.toBytes()),
            knowledge_type: Knowledge.SECONDARY_SHADOW,
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
    const decoded = secondaryShadows.decoderFor["&Type"]!(value.value);
    if (vertex.dse.cp?.secondaryShadows) {
        vertex.dse.cp.secondaryShadows = vertex.dse.cp.secondaryShadows
            .filter((k) => !compareDistinguishedName(
                k.ae_title.rdnSequence,
                decoded.ae_title.rdnSequence,
                getEqualityMatcherGetter(ctx),
            ));
    }
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SECONDARY_SHADOW,
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
    if (vertex.dse.cp?.secondaryShadows) {
        vertex.dse.cp.secondaryShadows = undefined;
    }
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SECONDARY_SHADOW,
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
    return !!(await ctx.db.accessPoint.findFirst({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SECONDARY_SHADOW,
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
