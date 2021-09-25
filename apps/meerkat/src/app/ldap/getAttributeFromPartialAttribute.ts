import type { Context } from "../types";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
import type {
    PartialAttribute,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/PartialAttribute.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";

export
function getAttributeFromPartialAttribute (ctx: Context, attr: PartialAttribute): Attribute | undefined {
    const desc = normalizeAttributeDescription(attr.type_);
    const spec = ctx.attributes.get(desc);
    if (!spec?.ldapSyntax) {
        return undefined;
    }
    const ldapSyntax = ctx.ldapSyntaxes.get(spec.ldapSyntax.toString());
    if (!ldapSyntax?.decoder) {
        return undefined;
    }
    const decoder = ldapSyntax?.decoder;
    return new Attribute(
        spec.id,
        attr.vals.map(decoder),
        undefined,
    );
}

export default getAttributeFromPartialAttribute;
