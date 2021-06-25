import { Context } from "../types";
import attributeFromInformationObject from "./attributeFromInformationObject";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import {
    commonName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import {
    surname,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/surname.oa";
import {
    userPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwd.oa";
import {
    caseIgnoreMatch,
} from "@wildboar/x500/src/lib/matching/equality/caseIgnoreMatch";
// TODO: Implement userPwdMatch

export
function loadSelectedAttributeTypes (ctx: Context): void {
    [
        objectClass,
        commonName,
        surname,
        userPwd,
    ]
        .map(attributeFromInformationObject)
        .forEach((attr) => { // FIXME: All attributes do not have their LDAP syntax names...
            ctx.attributes.set(attr.id, attr);
            if (attr.id === "2.5.4.3") {
                ctx.attributes.set("cn", attr);
                ctx.attributes.set("commonName", attr);
            }
            if (attr.id === "2.5.4.4") {
                ctx.attributes.set("sn", attr);
                ctx.attributes.set("surname", attr);
            }
            attr.ldapNames?.forEach((ldapName: string): void => {
                ctx.attributes.set(ldapName.trim().toLowerCase(), attr);
                if (!attr.ldapSyntax) {
                    return;
                }
                const oidSyntax = ctx.ldapSyntaxes.get(attr.ldapSyntax);
                if (!oidSyntax) {
                    return;
                }
                ctx.ldapSyntaxes.set(ldapName, oidSyntax);
            });
        });

    ctx.attributes.get(commonName["&id"]!.toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(surname["&id"]!.toString())!.namingMatcher = caseIgnoreMatch;

    // ctx.attributes.get(commonName["&id"]!.toString())!.namingMatcher = caseIgnoreMatch;
    // ctx.attributes.get(surname["&id"]!.toString())!.namingMatcher = caseIgnoreMatch;
}

export default loadSelectedAttributeTypes;
