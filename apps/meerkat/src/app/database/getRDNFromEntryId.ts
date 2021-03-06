import type { Context } from "@wildboar/meerkat-types";
import { BERElement, ObjectIdentifier } from "asn1-ts";
import type {
    RelativeDistinguishedName as RDN,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";

/**
 * @summary Get the relative distinguished name (RDN) of a DSE
 * @description
 *
 * This function retrieves the relative distinguished name of a DSE from the
 * database, converting it to the strongly-typed `RDN` from the `@wildboar/x500`
 * NPM package.
 *
 * @param ctx The context object
 * @param id The database ID of the entry to be queried
 * @returns The relative distinguished name of the entry
 *
 * @function
 * @async
 */
export
async function getRDNFromEntryId (ctx: Context, id: number): Promise<RDN> {
    return (await ctx.db.distinguishedValue.findMany({
        where: {
            entry_id: id,
        },
        select: {
            type: true,
            value: true,
        },
        orderBy: { // So the RDNs appear in the order in which they were entered.
            // This prevents an undesirable scenario where some users might show
            // up as GN=Jonathan+SN=Wilbur or SN=Wilbur+GN=Jonathan.
            order_index: "asc",
        },
    }))
        .map((atav) => new AttributeTypeAndValue(
            ObjectIdentifier.fromString(atav.type),
            (() => {
                const el = new BERElement();
                el.fromBytes(atav.value);
                return el;
            })(),
        ));
}

export default getRDNFromEntryId;
