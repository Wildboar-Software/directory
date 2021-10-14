import type { Context } from "@wildboar/meerkat-types";
import type LDAPSyntaxDecoder from "@wildboar/ldap/src/lib/types/LDAPSyntaxDecoder";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
import {
    LDAPOID,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPOID.ta";

export
function getLDAPDecoder (ctx: Context, type_: LDAPOID): LDAPSyntaxDecoder | undefined {
    const desc = normalizeAttributeDescription(type_);
    const spec = ctx.attributes.get(desc);
    if (!spec?.ldapSyntax) {
        return undefined;
    }
    const ldapSyntax = ctx.ldapSyntaxes.get(spec.ldapSyntax.toString());
    return ldapSyntax?.decoder;
}

export default getLDAPDecoder;
