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
import { naddrToURI } from "@wildboar/x500/src/lib/distributed/naddrToURI";
import { Knowledge } from "@prisma/client";
import rdnToJson from "../x500/rdnToJson";
import { DER } from "asn1-ts/dist/node/functional";
import { URL } from "url";

/**
 * @summary Save an access point to the database
 * @description
 *
 * This function saves an access point to the database.
 *
 * The access point can optionally be associated with an entry. One use case for
 * doing this is merely to record for analytics what other DSAs are in
 * existence. Another use is as an intermediary stage when an entry is being
 * updated: during an entry modification, this function can be called to save
 * an access point, then the only query that remains to be done within the
 * transaction to update the entry is to update the `entry_id` of the access
 * point. This is done several times throughout Meerkat DSA.
 *
 * If the access point is a shadow consumer, the access point from which it
 * consumes can be identified by the `is_consumer_of_id` parameter.
 *
 * If the access point is a part of the `nonSpecificKnowledge` attribute, it
 * will be one of many access points within a single value, and
 * `nonSpecificKnowledge` is a multi-valued attribute. There is significance to
 * this grouping too: a single value represents a single DSA (or cluster of
 * DSAs) bound by a non-specific hierarchical operational binding (NHOB), so you
 * cannot just join all of these access points into a single value, split them
 * up, or shuffle them around. There is meaning to how they are grouped.
 *
 * Therefore, to preserve
 * which value of `nonSpecificKnowledge` an access point came from, we have to
 * assign it an arbitrary number that is identical for all access points within
 * a single `nonSpecificKnowledge` value. This is done with `nsk_group`. If the
 * access point you are adding is a part of a `nonSpecificKnowledge` attribute,
 * you MUST make sure to assign an `nsk_group` value that can be used to
 * re-group access points that are part of the same value.
 *
 * @param ctx The context object
 * @param ap The access point to be saved
 * @param knowledge_type What knowledge type this access point represents
 * @param entry_id The database ID of the entry associated with this access point
 * @param is_consumer_of_id The database ID of the access point for which this
 *  access point is a shadow consumer
 * @param nsk_group The non-specific knowledge group. This is an arbitrary
 *  integer that must be identical for access points that fall within the same
 *  non-specific knowledge attribute for an entry
 * @returns The database ID of the newly added access point
 *
 * @function
 * @async
 */
export
async function saveAccessPoint (
    ctx: Context,
    ap: AccessPoint | MasterOrShadowAccessPoint | SupplierOrConsumer | SupplierInformation | SupplierAndConsumers,
    knowledge_type: Knowledge,
    entry_id?: number,
    is_consumer_of_id?: number,
    nsk_group?: bigint,
): Promise<number> {
    const ber: Buffer = ((): Buffer => {
        if (ap instanceof AccessPoint) {
            return Buffer.from(_encode_AccessPoint(ap, DER).toBytes().buffer);
        } else if (ap instanceof MasterOrShadowAccessPoint) {
            return Buffer.from(_encode_MasterOrShadowAccessPoint(ap, DER).toBytes().buffer);
        } else if (ap instanceof SupplierOrConsumer) {
            return Buffer.from(_encode_SupplierOrConsumer(ap, DER).toBytes().buffer);
        } else if (ap instanceof SupplierInformation) {
            return Buffer.from(_encode_SupplierInformation(ap, DER).toBytes().buffer);
        } else {
            return Buffer.from(_encode_SupplierAndConsumers(ap, DER).toBytes().buffer);
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
            nsk_group,
            active: true,
            NSAP: {
                createMany: {
                    data: ap.address.nAddresses.map((nsap) => {
                        const uri = naddrToURI(nsap);
                        if (!uri) {
                            return {
                                bytes: Buffer.from(nsap.buffer),
                            };
                        }
                        const url = new URL(uri);
                        return {
                            url: url.toString(),
                            bytes: Buffer.from(nsap.buffer),
                            hostname: url.hostname,
                        };
                    }),
                },
            },
        },
    });
    if (("consumers" in ap) && ap.consumers) {
        await Promise.all(
            ap.consumers.map((consumer) => saveAccessPoint(ctx, consumer, Knowledge.CONSUMER, undefined, created.id)),
        );
    }
    return created.id;
}

export default saveAccessPoint;
