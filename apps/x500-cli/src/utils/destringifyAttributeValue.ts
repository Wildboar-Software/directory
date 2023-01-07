import type { Context } from "../types";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
import { getLDAPSyntax } from "./getLDAPSyntax";
import { LDAPString } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPString.ta";
import { ASN1Element, OBJECT_IDENTIFIER, ObjectIdentifier, BERElement } from "asn1-ts";

export
function destringifyAttributeValue (ctx: Context, type: LDAPString | OBJECT_IDENTIFIER, value: string): ASN1Element | undefined {
    if (value[0] === '#') {
        const bytes = Buffer.from(value.substring(1), "hex");
        const el = new BERElement();
        el.fromBytes(bytes);
        return el;
    }
    const type_id: OBJECT_IDENTIFIER | undefined = (type instanceof ObjectIdentifier)
        ? type
        : (() => ctx.attributes.get(normalizeAttributeDescription(type))?.id)();
    if (!type_id) {
        return undefined;
    }
    const ldapSyntax = getLDAPSyntax(ctx, type_id);
    if (!ldapSyntax?.decoder) {
        return undefined;
    }
    const decoder = ldapSyntax?.decoder;
    return decoder(Buffer.from(value, "utf-8"));
}

export default destringifyAttributeValue;
