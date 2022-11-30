import type { Context } from "@wildboar/meerkat-types";
import type { ASN1Element, OBJECT_IDENTIFIER } from "asn1-ts";
import stringifyLDAPDN from "@wildboar/ldap/src/lib/stringifiers/RDNSequence";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import { getLDAPSyntax } from "../x500/getLDAPSyntax";

/**
 * @summary Convert a distinguished name to a string
 * @description
 *
 * This function converts a distinguished name to a string according to the
 * procedures defined for the Lightweight Directory Access Protocol (LDAP), as
 * described in [IETF RFC 4514](https://datatracker.ietf.org/doc/html/rfc4514),
 * EXCEPT that it does not reverse the ordering of RDNs in the distinguished
 * name. (LDAP, for some reason, reverses the ordering of RDNs from that used by
 * X.500 directory systems, so this implementation does not do that.)
 *
 * @param ctx The context object
 * @param dn The distinguished name to be converted to a string
 * @returns The string representation of the distinguished name
 *
 * @function
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc4514}
 */
export
function stringifyDN (
    ctx: Context,
    dn: DistinguishedName,
): string {
    return stringifyLDAPDN(dn
        .map((rdn) => rdn
            .map((atav) => [ atav.type_, atav.value ])),
        (syntax: OBJECT_IDENTIFIER) => {
            const attrSpec = ctx.attributeTypes.get(syntax.toString());
            if (!attrSpec) {
                return undefined;
            }
            const ldapSyntax = getLDAPSyntax(ctx, attrSpec.id);
            if (!ldapSyntax?.encoder) {
                return undefined;
            }
            const encoder = ldapSyntax.encoder;
            return (value: ASN1Element): string => Buffer.from(encoder(value)).toString("utf-8");
        },
        (type: OBJECT_IDENTIFIER) => {
            const attrSpec = ctx.attributeTypes.get(type.toString());
            return attrSpec?.ldapNames?.[0];
        },
    );
}

export default stringifyDN;
