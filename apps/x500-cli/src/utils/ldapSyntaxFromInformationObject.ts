import {
    SYNTAX_NAME,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
import { LDAPSyntaxInfo } from "@wildboar/meerkat-types";

export
function attributeFromInformationObject (io: SYNTAX_NAME): LDAPSyntaxInfo {
    if (!io["&id"]) {
        throw new Error();
    }
    return {
        id: io["&id"],
        description: io["&ldapDesc"],
    };
}

export default attributeFromInformationObject;
