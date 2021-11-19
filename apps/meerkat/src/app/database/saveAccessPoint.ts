import type { Context } from "@wildboar/meerkat-types";
import {
    AccessPoint,
    _encode_AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import {
    MasterOrShadowAccessPoint,
    _encode_MasterOrShadowAccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";
import {
    SupplierOrConsumer,
    _encode_SupplierOrConsumer,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/SupplierOrConsumer.ta";
import {
    SupplierInformation,
    _encode_SupplierInformation,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/SupplierInformation.ta";
import {
    SupplierAndConsumers,
    _encode_SupplierAndConsumers,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/SupplierAndConsumers.ta";
import { ipv4FromNSAP } from "@wildboar/x500/src/lib/distributed/ipv4";
import { uriFromNSAP } from "@wildboar/x500/src/lib/distributed/uri";
import { Knowledge } from "@prisma/client";
import rdnToJson from "../x500/rdnToJson";
import { DER } from "asn1-ts/dist/node/functional";
import IPV4_AFI_IDI from "@wildboar/x500/src/lib/distributed/IPV4_AFI_IDI";

export
async function saveAccessPoint (
    ctx: Context,
    ap: AccessPoint | MasterOrShadowAccessPoint | SupplierOrConsumer | SupplierInformation | SupplierAndConsumers,
    knowledge_type: Knowledge,
    entry_id?: number,
    is_consumer_of_id?: number,
): Promise<number> {
    const ber: Buffer = ((): Buffer => {
        if (ap instanceof AccessPoint) {
            return Buffer.from(_encode_AccessPoint(ap, DER).toBytes());
        } else if (ap instanceof MasterOrShadowAccessPoint) {
            return Buffer.from(_encode_MasterOrShadowAccessPoint(ap, DER).toBytes());
        } else if (ap instanceof SupplierOrConsumer) {
            return Buffer.from(_encode_SupplierOrConsumer(ap, DER).toBytes());
        } else if (ap instanceof SupplierInformation) {
            return Buffer.from(_encode_SupplierInformation(ap, DER).toBytes());
        } else {
            return Buffer.from(_encode_SupplierAndConsumers(ap, DER).toBytes());
        }
    })();
    const non_supplying_master_id = (("non_supplying_master" in ap) && ap.non_supplying_master)
        ? await saveAccessPoint(ctx, ap.non_supplying_master, Knowledge.NON_SUPPLYING_MASTER, undefined)
        : undefined;
    const created = await ctx.db.accessPoint.create({
        data: {
            knowledge_type,
            ae_title: ap.ae_title.rdnSequence.map((rdn) => rdnToJson(rdn)),
            category: ("category" in ap)
                ? ap.category
                : undefined,
            chainingRequired: ("chainingRequired" in ap)
                ? ap.chainingRequired
                : undefined,
            supplier_is_master: ("supplier_is_master" in ap)
                ? ap.supplier_is_master
                : undefined,
            entry_id,
            non_supplying_master_id,
            is_consumer_of_id,
            ber,
            NSAP: {
                createMany: {
                    data: ap.address.nAddresses.map((nsap) => {
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
    });
    if (("consumers" in ap) && ap.consumers) {
        for (const consumer of ap.consumers) {
            await saveAccessPoint(ctx, consumer, Knowledge.CONSUMER, undefined, created.id);
        }
    }
    return created.id;
}

export default saveAccessPoint;
