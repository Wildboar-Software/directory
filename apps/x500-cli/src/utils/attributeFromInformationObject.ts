import {
    ATTRIBUTE,
} from "@wildboar/x500/InformationFramework";
import type { AttributeInfo } from "../types";

export
function attributeFromInformationObject (io: ATTRIBUTE, name?: string): AttributeInfo {
    return {
        id: io["&id"],
        name,
        ldapSyntax: io["&ldapSyntax"],
        ldapNames: io["&ldapName"]?.length
            ? io["&ldapName"]
            : (name ? [ name ] : undefined),
        ldapDescription: io["&ldapDesc"],
        parent: io["&derivation"]?.["&id"],
    };
}

export default attributeFromInformationObject;
