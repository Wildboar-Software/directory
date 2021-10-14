import type { Context } from "@wildboar/meerkat-types";
import {
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
