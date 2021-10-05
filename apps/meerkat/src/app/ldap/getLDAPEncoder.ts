import type { Context } from "../types";
import type LDAPSyntaxEncoder from "@wildboar/ldap/src/lib/types/LDAPSyntaxEncoder";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";

export
function getLDAPEncoder (ctx: Context, type_: AttributeType): LDAPSyntaxEncoder | undefined {
    const spec = ctx.attributes.get(type_.toString());
    if (!spec?.ldapSyntax) {
        return undefined;
    }
    const ldapSyntax = ctx.ldapSyntaxes.get(spec.ldapSyntax.toString());
    return ldapSyntax?.encoder;
}

export default getLDAPEncoder;
