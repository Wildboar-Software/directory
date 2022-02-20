import type { Context } from "@wildboar/meerkat-types";
import type LDAPSyntaxDecoder from "@wildboar/ldap/src/lib/types/LDAPSyntaxDecoder";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
import {
    LDAPOID,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPOID.ta";

/**
 * @summary Returns a function that can decode an LDAP value into an X.500 directory value
 * @description
 *
 * Based on the attribute type's LDAP syntax, this function looks up which
 * function can be used to decode LDAP string-encoded values into X.500
 * directory values, which are represented in Meerkat DSA as `ASN1Element`s.
 * If such a function cannot be determined, this function returns `undefined`.
 *
 * @param ctx The context object
 * @param type_ The numeric or non-numeric object identifier of the attribute type
 * @returns A function that can convert the LDAP-string encoded value into an
 *  `ASN1Element` as used internally by Meerkat DSA to represent values, or
 *  `undefined` if such a decoder cannot be determined.
 *
 * @function
 */
export
function getLDAPDecoder (ctx: Context, type_: LDAPOID): LDAPSyntaxDecoder | undefined {
    const desc = normalizeAttributeDescription(type_);
    const spec = ctx.attributeTypes.get(desc);
    if (!spec?.ldapSyntax) {
        return undefined;
    }
    const ldapSyntax = ctx.ldapSyntaxes.get(spec.ldapSyntax.toString());
    return ldapSyntax?.decoder;
}

export default getLDAPDecoder;
