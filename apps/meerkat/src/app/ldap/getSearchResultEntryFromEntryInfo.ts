import type { Context } from "@wildboar/meerkat-types";
import {
    PartialAttributeList,
    SearchResultEntry,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchResultEntry.ta";
import type {
    EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import type {
    PartialAttribute,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/PartialAttribute.ta";
import getPartialAttributeFromEntryInfoItem from "./getPartialAttributeFromEntryInfoItem";
import encodeLDAPDN from "./encodeLDAPDN";

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
    const attrs: PartialAttributeList = [];
    for (const info of einfo.information ?? []) {
        const pattr = getPartialAttributeFromEntryInfoItem(ctx, info);
        if (!pattr) {
            continue;
        }
        attrs.push(pattr);
    }
    return new SearchResultEntry(
        encodeLDAPDN(ctx, einfo.name.rdnSequence),
        attrs,
    );
}

export default getSearchResultEntryFromEntryInfo;
