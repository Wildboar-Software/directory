import type { Context } from "@wildboar/meerkat-types";
import type { RDNSequence } from "@wildboar/x500/src/lib/modules/InformationFramework/RDNSequence.ta";
import { AttributeTypeAndValue } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
import destringifyRDNSequence from "@wildboar/ldap/src/lib/destringifiers/RDNSequence";

/**
 * @summary Decode an LDAP distinguished name and reverse it.
 * @description
 *
 * This function not only decodes an LDAP distinguished name, but also reverses
 * it so that the ordering of RDNs matches that of the X.500 specifications'
 * `RDNSequence` production.
 *
 * @param ctx
 * @param dn
 * @returns
 */
export
function decodeLDAPDN (ctx: Context, dn: Uint8Array | string): RDNSequence {
    if (dn.length === 0) {
        return [];
    }
    const dnStr: string = (typeof dn === "string")
        ? dn
        : Buffer.from(dn).toString("utf-8");
    return Array.from(destringifyRDNSequence(
        dnStr,
        (attrDesc: string) => {
            const attrType = normalizeAttributeDescription(Buffer.from(attrDesc));
            const attr = ctx.attributes.get(attrType);
            if (!attr?.ldapSyntax) {
                throw new Error(attrDesc.toString());
            }
            const syntax_ = ctx.ldapSyntaxes.get(attr.ldapSyntax.toString());
            if (!syntax_ || !syntax_.decoder) {
                throw new Error(attr.ldapSyntax.toString());
            }
            return [
                attr.id,
                (value: string) => syntax_.decoder!(Buffer.from(value)),
            ];
        },
    ))
        .map((rdn) => rdn.map(([ type_, value ]) => new AttributeTypeAndValue(
            type_,
            value,
        )))
        .reverse();
}

export default decodeLDAPDN;
