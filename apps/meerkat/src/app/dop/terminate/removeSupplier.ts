import { Context } from "@wildboar/meerkat-types";
import { Knowledge } from "@prisma/client";
import { BERElement } from "@wildboar/asn1";
import {
    _decode_SupplierInformation,
} from "@wildboar/x500/DSAOperationalAttributeTypes";

/**
 * @summary Remove supplier knowledge for a given shadow operational binding
 * @description
 *
 * This function removes supplier knowledge references associated with a given
 * shadow operational binding.
 *
 * @param ctx The context object
 * @param obid The database ID of the operational binding
 *
 * @async
 * @function
 */
export
async function removeSupplier (
    ctx: Context,
    obid: number,
): Promise<void> {
    const all_supplier_aps = await ctx.db.accessPoint.findMany({
        where: {
            knowledge_type: Knowledge.SUPPLIER,
            active: true,
        },
        select: {
            id: true,
            ber: true,
        },
    });
    const relevant_supplier_ap_ids: number[] = all_supplier_aps
        .filter((ap) => {
            const el = new BERElement();
            el.fromBytes(ap.ber);
            try {
                const decoded = _decode_SupplierInformation(el);
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
                in: relevant_supplier_ap_ids,
            },
        },
    });
}

export default removeSupplier;
