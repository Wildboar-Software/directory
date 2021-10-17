import {
    ATTRIBUTE,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import type { AttributeInfo } from "../types";

export
function attributeFromInformationObject (io: ATTRIBUTE): AttributeInfo {
    return {
        id: io["&id"],
        ldapSyntax: io["&ldapSyntax"],
        ldapNames: io["&ldapName"],
        ldapDescription: io["&ldapDesc"],
    };
}

export default attributeFromInformationObject;
