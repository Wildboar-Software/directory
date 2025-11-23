import { Context } from "@wildboar/meerkat-types";
import { Knowledge } from "@prisma/client";
import {
    _decode_ConsumerInformation,
} from "@wildboar/x500/DSAOperationalAttributeTypes";
import { BERElement } from "@wildboar/asn1";

/**
 * @summary Remove consumer knowledge for a given shadow operational binding
 * @description
 *
 * This function removes consumer knowledge references associated with a given
 * shadow operational binding.
 *
 * @param ctx The context object
 * @param obid The database ID of the operational binding
 *
 * @async
 * @function
 */
export
async function removeConsumer (
    ctx: Context,
    obid: number
): Promise<void> {
    const all_consumer_aps = await ctx.db.accessPoint.findMany({
        where: {
            knowledge_type: Knowledge.CONSUMER,
            active: true,
        },
        select: {
            id: true,
            ber: true,
        },
    });
    const relevant_consumer_ap_ids: number[] = all_consumer_aps
        .filter((ap) => {
            const el = new BERElement();
            el.fromBytes(ap.ber);
            try {
                const decoded = _decode_ConsumerInformation(el);
                return (Number(decoded.agreementID.identifier) === obid);
            } catch {
                return false;
            }
        })
        .map(({ id }) => id)
        ;

    await ctx.db.accessPoint.deleteMany({
        where: {
            id: {
                in: relevant_consumer_ap_ids,
            },
        },
    });
}
