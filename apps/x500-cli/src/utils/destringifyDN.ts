import type { Context } from "../types";
import type { ASN1Element } from "@wildboar/asn1";
import { destringifyRDNSequence } from "@wildboar/ldap";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { normalizeAttributeDescription } from "@wildboar/ldap";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/InformationFramework";
import { getLDAPSyntax } from "../getLDAPSyntax";

export
function destringifyDN (
    ctx: Context,
    dn: string,
): DistinguishedName {
    return Array.from(destringifyRDNSequence(
        dn,
        (syntax: string) => {
            const desc = normalizeAttributeDescription(Buffer.from(syntax));
            const attrSpec = ctx.attributes.get(desc);
            if (!attrSpec) {
                return undefined;
            }
            const ldapSyntax = getLDAPSyntax(ctx, attrSpec.id);
            if (!ldapSyntax?.decoder) {
                return undefined;
            }
            const decoder = ldapSyntax?.decoder;
            return [
                attrSpec.id,
                (value: string): ASN1Element => decoder(Buffer.from(value, "utf-8")),
            ];
        },
    ))
        .map((rdn) => rdn.map((atav) => new AttributeTypeAndValue(
            atav[0],
            atav[1],
        )));
}

export default destringifyDN;
