import type { Context } from "@wildboar/meerkat-types";
import { OBJECT_IDENTIFIER, ASN1Element } from "asn1-ts";
import stringifyRDNSequence from "@wildboar/ldap/src/lib/stringifiers/RDNSequence";
import type { RDNSequence } from "@wildboar/x500/src/lib/modules/InformationFramework/RDNSequence.ta";

/**
 * @summary Encode an X.500 directory name as an LDAP string
 * @description
 *
 * Encodes an X.500 distinguished name as an LDAP string as defined in IETF RFC
 * 4514.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4514
 *
 * @param ctx The context object
 * @param dn An X.500 distinguished name
 * @returns An distinguished name encoded as an LDAP string
 *
 * @function
 */
export
function encodeLDAPDN (ctx: Context, dn: RDNSequence): Uint8Array {
    return Buffer.from(stringifyRDNSequence(
        [ ...dn ]
            .reverse()
            .map((rdn) => rdn
                .map((atav) => [ atav.type_, atav.value ])),
        (attrType: OBJECT_IDENTIFIER) => {
            const attr = ctx.attributeTypes.get(attrType.toString());
            if (!attr?.ldapSyntax) {
                return undefined;
            }
            const syntax_ = ctx.ldapSyntaxes.get(attr?.ldapSyntax.toString());
            if (!syntax_ || !syntax_.encoder) {
                return undefined;
            }
            return (value: ASN1Element) => Buffer.from(syntax_.encoder!(value)).toString("utf-8");
        },
        (type_: OBJECT_IDENTIFIER): string | undefined => {
            return ctx.attributeTypes.get(type_.toString())
                ?.ldapNames
                ?.sort((a, b) => a.length - b.length)[0];
        },
    ));
}

export default encodeLDAPDN;
