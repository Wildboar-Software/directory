import type { Context } from "@wildboar/meerkat-types";
import type {
    EntryInformation_information_Item,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    PartialAttribute,
} from "@wildboar/ldap";
import getAttributeFromPartialAttribute from "./getAttributeFromPartialAttribute";
import { normalizeAttributeDescription } from "@wildboar/ldap";

/**
 * @summary Converts an LDAP `PartialAttribute` into an X.500 entry information item
 * @description
 *
 * This function converts an LDAP `PartialAttribute`, which is described in IETF
 * RFC 4511, Section 4.1.7, into an X.500 entry information item. It accepts
 * non-numeric object identifier names as the `type`, and it converts all
 * LDAP-string-represented values into native X.500 attribute values.
 *
 * @param ctx The context object
 * @param partattr The partial attribute to be converted
 * @param typesOnly Whether only types were requested
 * @returns An X.500 `EntryInformation.information` item
 *
 * @function
 */
export
function getEntryInfoItemFromPartialAttribute (
    ctx: Context,
    partattr: PartialAttribute,
    typesOnly?: boolean,
): EntryInformation_information_Item | undefined {
    if (typesOnly) {
        const desc = normalizeAttributeDescription(partattr.type_);
        const spec = ctx.attributeTypes.get(desc);
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
