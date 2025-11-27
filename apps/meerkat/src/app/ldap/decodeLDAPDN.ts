import type { Context } from "../types/index.js";
import type { RDNSequence } from "@wildboar/x500/InformationFramework";
import { AttributeTypeAndValue } from "@wildboar/x500/InformationFramework";
import { normalizeAttributeDescription } from "@wildboar/ldap";
import { destringifyRDNSequence } from "@wildboar/ldap";
import { getLDAPSyntax } from "../x500/getLDAPSyntax.js";

/**
 * @summary Decode an LDAP distinguished name and reverse it.
 * @description
 *
 * This function not only decodes an LDAP distinguished name, but also reverses
 * it so that the ordering of RDNs matches that of the X.500 specifications'
 * `RDNSequence` production.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4514
 *
 * @param ctx The context object
 * @param dn The distinguished name to be decoded from an LDAP string
 * @returns The decoded X.500 distinguished name
 *
 * @function
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
            const attr = ctx.attributeTypes.get(attrType);
            if (!attr) {
                throw new Error(`fc4579b5-76fc-4240-affc-952206e5b343: ${attrDesc.toString()}`);
            }
            const syntax_ = getLDAPSyntax(ctx, attr.id);
            if (!syntax_ || !syntax_.decoder) {
                throw new Error(`ca45d142-f02a-4a75-9850-970868f910db: ${attrDesc.toString()}`);
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
