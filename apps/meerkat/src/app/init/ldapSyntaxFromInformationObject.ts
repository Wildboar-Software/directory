import {
    SYNTAX_NAME,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
import { LDAPSyntaxInfo } from "../types";

export
function ldapSyntaxFromInformationObject (io: SYNTAX_NAME): LDAPSyntaxInfo {
    if (!io["&id"]) {
        throw new Error();
    }
    return {
        id: io["&id"],
        description: io["&ldapDesc"],
    };
}

export default ldapSyntaxFromInformationObject;
