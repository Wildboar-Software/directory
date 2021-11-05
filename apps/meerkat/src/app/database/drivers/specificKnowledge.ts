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
} from "@wildboar/meerkat-types";
import { Knowledge } from "@prisma/client";
import { DER } from "asn1-ts/dist/node/functional";
import {
    specificKnowledge,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/specificKnowledge.oa";
import rdnToJson from "../../x500/rdnToJson";
import { ipv4FromNSAP } from "@wildboar/x500/src/lib/distributed/ipv4";
import { uriFromNSAP } from "@wildboar/x500/src/lib/distributed/uri";
import {
    _encode_MasterOrShadowAccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";

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
    pendingUpdates.otherWrites.push(ctx.db.accessPoint.createMany({
        data: decoded.map((mosap) => ({
            ae_title: mosap.ae_title.rdnSequence.map(rdnToJson),
            entry_id: vertex.dse.id,
            ber: Buffer.from(_encode_MasterOrShadowAccessPoint(mosap, DER).toBytes()),
            knowledge_type: Knowledge.SPECIFIC,
            category: mosap.category,
            chainingRequired: mosap.chainingRequired,
            NSAP: {
                createMany: {
                    data: mosap.address.nAddresses.map((nsap) => {
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
        })),
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
    return vertex.dse.subr?.specificKnowledge?.length ? 1 : 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return Boolean(vertex.dse.subr?.specificKnowledge?.length);
};

export
const driver: AttributeTypeDatabaseDriver = {
    readValues,
    addValue,
    removeValue,
    removeAttribute,
    countValues,
    isPresent,
    // hasValue,
};

export default driver;
