import type { Context } from "../types/index.js";
import { normalizeAttributeDescription } from "@wildboar/ldap";
import type {
    PartialAttribute,
} from "@wildboar/ldap";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import { getLDAPSyntax } from "../x500/getLDAPSyntax.js";

/**
 * @summary Convert an LDAP `PartialAttribute` into an X.500 directory attribute
 * @description
 *
 * This function converts an LDAP `PartialAttribute`, which is described in IETF
 * RFC 4511, Section 4.1.7, into an X.500 directory attribute. It accepts
 * non-numeric object identifier names as the `type`, and it converts all
 * LDAP-string-represented values into native X.500 attribute values.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4511#section-4.1.7
 *
 * @param ctx The context object
 * @param attr The partial attribute
 * @returns An X.500 directory attribute, or `undefined` if it cannot be converted
 *
 * @function
 */
export
function getAttributeFromPartialAttribute (ctx: Context, attr: PartialAttribute): Attribute | undefined {
    const desc = normalizeAttributeDescription(attr.type_);
    const spec = ctx.attributeTypes.get(desc);
    if (!spec) {
        return undefined;
    }
    const ldapSyntax = getLDAPSyntax(ctx, spec.id);
    if (!ldapSyntax?.decoder) {
        return undefined;
    }
    const decoder = ldapSyntax?.decoder;
    return new Attribute(
        spec.id,
        attr.vals.map(decoder),
        undefined,
    );
}

export default getAttributeFromPartialAttribute;
