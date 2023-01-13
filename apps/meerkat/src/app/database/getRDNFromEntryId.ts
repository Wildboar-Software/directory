import type { Context } from "@wildboar/meerkat-types";
import { ASN1Construction, BERElement, ObjectIdentifier } from "asn1-ts";
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
            type_oid: true,
            tag_class: true,
            constructed: true,
            tag_number: true,
            content_octets: true,
        },
        orderBy: { // So the RDNs appear in the order in which they were entered.
            // This prevents an undesirable scenario where some users might show
            // up as GN=Jonathan+SN=Wilbur or SN=Wilbur+GN=Jonathan.
            order_index: "asc",
        },
    })).map((atav) => {
        const type_el = new BERElement();
        const value_el = new BERElement();
        type_el.value = atav.type_oid;
        value_el.tagClass = atav.tag_class;
        value_el.construction = atav.constructed
            ? ASN1Construction.constructed
            : ASN1Construction.primitive;
        value_el.tagNumber = atav.tag_number;
        value_el.value = atav.content_octets;
        return new AttributeTypeAndValue(
            type_el.objectIdentifier,
            value_el,
        );
    });
}

export default getRDNFromEntryId;
