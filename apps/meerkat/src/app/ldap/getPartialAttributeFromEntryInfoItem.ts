import type { Context } from "../types";
import type {
    EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import type {
    PartialAttribute,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/PartialAttribute.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import getPartialAttributeFromAttribute from "./getPartialAttributeFromAttribute";

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
