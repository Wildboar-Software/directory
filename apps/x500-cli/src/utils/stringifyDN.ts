import type { Context } from "../types";
import type { ASN1Element, OBJECT_IDENTIFIER } from "@wildboar/asn1";
import { stringifyRDNSequence } from "@wildboar/ldap";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { getLDAPSyntax } from "../getLDAPSyntax";

export
function stringifyDN (
    ctx: Context,
    dn: DistinguishedName,
): string {
    return stringifyRDNSequence(dn
        .map((rdn) => rdn
            .map((atav) => [ atav.type_, atav.value ])),
        (syntax: OBJECT_IDENTIFIER) => {
            const attrSpec = ctx.attributes.get(syntax.toString());
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
            const attrSpec = ctx.attributes.get(type.toString());
            return attrSpec?.ldapNames?.[0];
        },
    );
}

export default stringifyDN;
