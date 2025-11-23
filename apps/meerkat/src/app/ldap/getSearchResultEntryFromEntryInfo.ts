import type { Context } from "@wildboar/meerkat-types";
import {
    SearchResultEntry,
} from "@wildboar/ldap";
import type {
    EntryInformation,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    PartialAttribute,
} from "@wildboar/ldap";
import getPartialAttributeFromEntryInfoItem from "./getPartialAttributeFromEntryInfoItem.js";
import encodeLDAPDN from "./encodeLDAPDN.js";

/**
 * @summary Converts X.500 `EntryInformation` into an LDAP `SearchResultEntry`
 * @description
 *
 * This function converts X.500 `EntryInformation` into an LDAP
 * `SearchResultEntry`.
 *
 * @param ctx The context object
 * @param einfo The X.500 entry information to be converted to an LDAP search result
 * @returns An LDAP search result
 *
 * @function
 */
export
function getSearchResultEntryFromEntryInfo (
    ctx: Context,
    einfo: EntryInformation,
): SearchResultEntry {
    return new SearchResultEntry(
        encodeLDAPDN(ctx, einfo.name.rdnSequence),
        einfo.information
            ?.map((item) => getPartialAttributeFromEntryInfoItem(ctx, item))
            .filter((item): item is PartialAttribute => !!item) ?? [],
    );
}

export default getSearchResultEntryFromEntryInfo;
