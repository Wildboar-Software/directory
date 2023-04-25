import { Context } from "@wildboar/meerkat-types";
import { Knowledge } from "@prisma/client";
import {
    _decode_ConsumerInformation,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/ConsumerInformation.ta";
import { BERElement } from "asn1-ts";

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
