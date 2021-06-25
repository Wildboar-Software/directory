import type { Context } from "../types";
import type { RDNSequence } from "@wildboar/x500/src/lib/modules/InformationFramework/RDNSequence.ta";
import { AttributeTypeAndValue } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
import destringifyRDNSequence from "@wildboar/ldap/src/lib/destringifiers/RDNSequence";
import { ObjectIdentifier } from "asn1-ts";

export
function decodeLDAPDN (ctx: Context, dn: Uint8Array): RDNSequence {
    if (dn.length === 0) {
        return [];
    }
    return Array.from(destringifyRDNSequence(
        Buffer.from(dn).toString("utf-8"),
        (attrDesc: string) => {
            const attrType = normalizeAttributeDescription(Buffer.from(attrDesc));
            const attr = ctx.attributes.get(attrType);
            if (!attr?.ldapSyntax) {
                throw new Error(attrDesc.toString());
            }
            const syntax_ = ctx.ldapSyntaxes.get(attr.ldapSyntax);
            if (!syntax_ || !syntax_.decoder) {
                throw new Error(attr.ldapSyntax);
            }
            return [
                new ObjectIdentifier(attr.id.split(".").map((node) => Number.parseInt(node))),
                (value: string) => syntax_.decoder!(Buffer.from(value)),
            ];
        },
    )).map((rdn) => rdn.map(([ type_, value ]) => new AttributeTypeAndValue(
        type_,
        value,
    )));
}

export default decodeLDAPDN;
