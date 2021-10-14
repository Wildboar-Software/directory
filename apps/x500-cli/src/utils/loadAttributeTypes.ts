import type { Context } from "@wildboar/meerkat-types";
import * as x500at from "@wildboar/x500/src/lib/collections/attributes";
import attributeFromInformationObject from "./attributeFromInformationObject";

export
function loadAttributeTypes (ctx: Context): void {
    Object.values(x500at)
        .map(attributeFromInformationObject)
        .forEach((attr) => {
            ctx.attributes.set(attr.id.toString(), attr);
            attr.ldapNames?.forEach((ldapName: string): void => {
                ctx.attributes.set(ldapName.trim().toLowerCase(), attr);
                if (!attr.ldapSyntax) {
                    return;
                }
                const oidSyntax = ctx.ldapSyntaxes.get(attr.ldapSyntax.toString());
                if (!oidSyntax) {
                    return;
                }
                ctx.ldapSyntaxes.set(ldapName, oidSyntax);
            });
        });
}

export default loadAttributeTypes;
