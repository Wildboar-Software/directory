import { Buffer } from "node:buffer";
import type { Context } from "../types/index.js";
import { OBJECT_IDENTIFIER, ASN1Element } from "@wildboar/asn1";
import { stringifyRDNSequence } from "@wildboar/ldap";
import type { RDNSequence } from "@wildboar/x500/InformationFramework";
import { getLDAPSyntax } from "../x500/getLDAPSyntax.js";

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
            const syntax_ = getLDAPSyntax(ctx, attrType);
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
