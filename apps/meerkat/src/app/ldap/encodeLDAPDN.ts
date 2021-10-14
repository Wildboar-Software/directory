import type { Context } from "@wildboar/meerkat-types";
import { OBJECT_IDENTIFIER, ASN1Element } from "asn1-ts";
import stringifyRDNSequence from "@wildboar/ldap/src/lib/stringifiers/RDNSequence";
import type { RDNSequence } from "@wildboar/x500/src/lib/modules/InformationFramework/RDNSequence.ta";

export
function encodeLDAPDN (ctx: Context, dn: RDNSequence): Uint8Array {
    return Buffer.from(stringifyRDNSequence(
        dn
            .reverse()
            .map((rdn) => rdn
                .map((atav) => [ atav.type_, atav.value ])),
        (attrType: OBJECT_IDENTIFIER) => {
            const attr = ctx.attributes.get(attrType.toString());
            if (!attr?.ldapSyntax) {
                throw new Error(attrType.toString());
            }
            const syntax_ = ctx.ldapSyntaxes.get(attr?.ldapSyntax.toString());
            if (!syntax_ || !syntax_.encoder) {
                throw new Error(attrType.toString());
            }
            return (value: ASN1Element) => Buffer.from(syntax_.encoder!(value)).toString("utf-8");
        },
        (type_: OBJECT_IDENTIFIER): string | undefined => {
            return ctx.attributes.get(type_.toString())
                ?.ldapNames
                ?.sort((a, b) => a.length - b.length)[0];
        },
    ));
}

export default encodeLDAPDN;
