import type { Context } from "@wildboar/meerkat-types";
import type LDAPSyntaxEncoder from "@wildboar/ldap/src/lib/types/LDAPSyntaxEncoder";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";

/**
 * @summary Returns a function that can encode an X.500 directory value into an LDAP value
 * @description
 *
 * Based on the attribute type's LDAP syntax, this function looks up which
 * function can be used to encode LDAP string-encoded values from X.500
 * directory values, which are represented in Meerkat DSA as `ASN1Element`s.
 * If such a function cannot be determined, this function returns `undefined`.
 *
 * @param ctx The context object
 * @param type_ The numeric or non-numeric object identifier of the attribute type
 * @returns A function that can produce an LDAP-string encoded value from an
 *  `ASN1Element` as used internally by Meerkat DSA to represent values, or
 *  `undefined` if such a decoder cannot be determined.
 *
 * @function
 */
export
function getLDAPEncoder (ctx: Context, type_: AttributeType): LDAPSyntaxEncoder | undefined {
    // FIXME: Make this like `getLDAPDecoder()`
    const spec = ctx.attributeTypes.get(type_.toString());
    if (!spec?.ldapSyntax) {
        return undefined;
    }
    const ldapSyntax = ctx.ldapSyntaxes.get(spec.ldapSyntax.toString());
    return ldapSyntax?.encoder;
}

export default getLDAPEncoder;
