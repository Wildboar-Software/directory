import type { Context } from "../types";
import type {
    EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import type {
    PartialAttribute,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/PartialAttribute.ta";
import getAttributeFromPartialAttribute from "./getAttributeFromPartialAttribute";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";

export
function getEntryInfoItemFromPartialAttribute (
    ctx: Context,
    partattr: PartialAttribute,
    typesOnly?: boolean,
): EntryInformation_information_Item | undefined {
    if (typesOnly) {
        const desc = normalizeAttributeDescription(partattr.type_);
        const spec = ctx.attributes.get(desc);
        return spec?.id
            ? {
                attributeType: spec.id,
            }
            : undefined;
    }
    const attribute = getAttributeFromPartialAttribute(ctx, partattr);
    if (!attribute) {
        return undefined;
    }
    if (attribute.values.length) {
        return {
            attribute,
        };
    } else {
        return {
            attributeType: attribute.type_,
        };
    }
}

export default getEntryInfoItemFromPartialAttribute;
