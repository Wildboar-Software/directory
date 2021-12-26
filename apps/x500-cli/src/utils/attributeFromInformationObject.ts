import {
    ATTRIBUTE,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import type { AttributeInfo } from "../types";

export
function attributeFromInformationObject (io: ATTRIBUTE, name?: string): AttributeInfo {
    return {
        id: io["&id"],
        name,
        ldapSyntax: io["&ldapSyntax"],
        ldapNames: io["&ldapName"],
        ldapDescription: io["&ldapDesc"],
    };
}

export default attributeFromInformationObject;
