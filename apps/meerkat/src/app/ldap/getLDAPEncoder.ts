import type { Context } from "../types/index.js";
import type { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import { type LDAPSyntaxEncoder } from "@wildboar/ldap";
import type {
    AttributeType,
} from "@wildboar/x500/InformationFramework";
import getAttributeParentTypes from "../x500/getAttributeParentTypes.js";

// TODO: This is unused.

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
    const parentTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, type_));
    const ldapSyntaxOID: OBJECT_IDENTIFIER | undefined = [
        type_,
        ...parentTypes,
    ]
        .map((spec) => ctx.attributeTypes.get(spec.toString())?.ldapSyntax)
        .find((oid) => oid);
    if (!ldapSyntaxOID) {
        return undefined;
    }
    const ldapSyntax = ctx.ldapSyntaxes.get(ldapSyntaxOID.toString());
    return ldapSyntax?.encoder;
}

export default getLDAPEncoder;
