import type { Context } from "@wildboar/meerkat-types";
import {
    PartialAttribute,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/PartialAttribute.ta";
import type {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import encodeLDAPOID from "@wildboar/ldap/src/lib/encodeLDAPOID";

export
function getPartialAttributeFromAttribute (ctx: Context, attr: Attribute): PartialAttribute | undefined {
    const spec = ctx.attributeTypes.get(attr.type_.toString());
    if (!spec?.ldapSyntax) {
        return undefined;
    }
    const ldapSyntax = ctx.ldapSyntaxes.get(spec.ldapSyntax.toString());
    if (!ldapSyntax?.decoder) {
        return undefined;
    }
    const encoder = ldapSyntax?.encoder;
    if (!encoder) {
        return undefined;
    }
    return new PartialAttribute(
        (spec.ldapNames && spec.ldapNames.length > 0)
            ? Buffer.from(spec.ldapNames[0], "utf-8")
            : encodeLDAPOID(attr.type_),
        attr.values.map(encoder),
        undefined,
    );
}

export default getPartialAttributeFromAttribute;
