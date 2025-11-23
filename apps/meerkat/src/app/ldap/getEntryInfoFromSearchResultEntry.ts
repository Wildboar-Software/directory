import type { Context } from "@wildboar/meerkat-types";
import type {
    SearchResultEntry,
} from "@wildboar/ldap";
import {
    EntryInformation,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    EntryInformation_information_Item,
} from "@wildboar/x500/DirectoryAbstractService";
import getEntryInfoItemFromPartialAttribute from "./getEntryInfoItemFromPartialAttribute";
import decodeLDAPDN from "./decodeLDAPDN";

/**
 * @summary Converts an LDAP `SearchResultEntry` into X.500 `EntryInformation`
 * @description
 *
 * This function converts an LDAP `SearchResultEntry` into X.500
 * `EntryInformation`. The LDAP `SearchResultEntry` is described in IETF RFC
 * 4511, Section 4.5.2.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4511#section-4.5.2
 *
 * @param ctx The context object
 * @param sre The search result entry
 * @param typesOnly Whether only types were requested
 * @returns The X.500 `EntryInformation`
 *
 * @function
 */
export
function getEntryInfoFromSearchResultEntry (
    ctx: Context,
    sre: SearchResultEntry,
    typesOnly?: boolean,
): EntryInformation {
    return new EntryInformation(
        {
            rdnSequence: decodeLDAPDN(ctx, sre.objectName),
        },
        undefined,
        sre.attributes
            .map((attr) => getEntryInfoItemFromPartialAttribute(ctx, attr))
            .filter((attr): attr is EntryInformation_information_Item => !!attr)
            .map((attr) => (typesOnly
                ? {
                    attributeType: ("attributeType" in attr)
                        ? attr.attributeType
                        : ("attribute" in attr)
                            ? attr.attribute.type_
                            : 0 as never
                }
                : attr)),
        undefined,
        undefined,
        undefined,
    );
}

export default getEntryInfoFromSearchResultEntry;
