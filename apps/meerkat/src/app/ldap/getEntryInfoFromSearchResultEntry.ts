import type { Context } from "@wildboar/meerkat-types";
import type {
    SearchResultEntry,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchResultEntry.ta";
import {
    EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import type {
    EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import getEntryInfoItemFromPartialAttribute from "./getEntryInfoItemFromPartialAttribute";
import decodeLDAPDN from "./decodeLDAPDN";

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
