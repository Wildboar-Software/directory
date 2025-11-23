import type { Context } from "@wildboar/meerkat-types";
import type {
    EntryInformation_information_Item,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    PartialAttribute,
} from "@wildboar/ldap";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import getPartialAttributeFromAttribute from "./getPartialAttributeFromAttribute";

/**
 * @summary Convert an X.500 entry information item into an LDAP `PartialAttribute`
 * @description
 *
 * This function converts an X.500 entry information item into an LDAP
 * `PartialAttribute`. If it cannot be converted, this function returns
 * `undefined`. This might happen in these scenarios:
 *
 * - Meerkat DSA does not know of any LDAP syntax associated with the attribute type
 * - Meerkat DSA does not understand the LDAP syntax
 * - Meerkat DSA does not have an LDAP syntax encoder defined for that syntax
 *
 * The LDAP `PartialAttribute` type is defined in IETF RFC 4511, Section 4.1.7.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4511#section-4.1.7
 *
 * @param ctx The context object
 * @param einfo The X.500 entry information item to be converted to an LDAP `PartialAttribute`
 * @returns An LDAP `PartialAttribute` if it can be constructed, or `undefined` otherwise
 *
 * @function
 */
export
function getPartialAttributeFromEntryInfoItem (
    ctx: Context,
    einfo: EntryInformation_information_Item,
): PartialAttribute | undefined {
    if ("attributeType" in einfo) {
        return getPartialAttributeFromAttribute(ctx, new Attribute(einfo.attributeType, [], undefined));
    } else if ("attribute" in einfo) {
        return getPartialAttributeFromAttribute(ctx, einfo.attribute);
    } else {
        return undefined;
    }
}

export default getPartialAttributeFromEntryInfoItem;
