import type { Context } from "../types";
import type { ASN1Element } from "asn1-ts";
import destringifyLDAPDN from "@wildboar/ldap/src/lib/destringifiers/RDNSequence";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import { getLDAPSyntax } from "../getLDAPSyntax";

export
function destringifyDN (
    ctx: Context,
    dn: string,
): DistinguishedName {
    return Array.from(destringifyLDAPDN(
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
