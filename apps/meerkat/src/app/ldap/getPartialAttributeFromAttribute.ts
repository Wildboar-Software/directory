import type { Context } from "@wildboar/meerkat-types";
import {
    PartialAttribute,
} from "@wildboar/ldap";
import type {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import { encodeLDAPOID } from "@wildboar/ldap";
import { getLDAPSyntax } from "../x500/getLDAPSyntax.js";

/**
 * @summary Convert an X.500 directory attribute into an LDAP `PartialAttribute`
 * @description
 *
 * This function converts an X.500 directory attribute into an LDAP
 * `PartialAttribute`. If it cannot be converted, this function returns
 * `undefined`. This might happen in these scenarios:
 *
 * - Meerkat DSA does not know of any LDAP syntax associated with the attribute type
 * - Meerkat DSA does not understand the LDAP syntax
 * - Meerkat DSA does not have an LDAP syntax encoder defined for that syntax
 *
 * The LDAP `PartialAttribute` type is defined in IETF RFC 4511, Section 4.1.7.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4511#section-4.1.7
 *
 * @param ctx The context object
 * @param attr The X.500 directory attribute to be converted to an LDAP `PartialAttribute`
 * @returns An LDAP `PartialAttribute` if it can be constructed, or `undefined` otherwise
 *
 * @function
 */
export
function getPartialAttributeFromAttribute (ctx: Context, attr: Attribute): PartialAttribute | undefined {
    const spec = ctx.attributeTypes.get(attr.type_.toString());
    if (!spec) {
        return undefined;
    }
    const ldapSyntax = getLDAPSyntax(ctx, spec.id);
    if (!ldapSyntax?.decoder) {
        return undefined;
    }
    const encoder = ldapSyntax?.encoder;
    if (!encoder) {
        return undefined;
    }
    return new PartialAttribute(
        (spec.ldapNames && spec.ldapNames.length > 0)
            ? Buffer.from(spec.ldapNames[0], "utf-8")
            : encodeLDAPOID(attr.type_),
        attr.values.map(encoder),
        undefined,
    );
}

export default getPartialAttributeFromAttribute;
