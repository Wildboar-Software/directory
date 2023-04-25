import { Context } from "@wildboar/meerkat-types";
import { Knowledge } from "@prisma/client";
import { BERElement } from "asn1-ts";
import {
    _decode_SupplierInformation,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/SupplierInformation.ta";

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
