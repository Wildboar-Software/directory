import {
    ATTRIBUTE,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { ASN1Element, DERElement } from "asn1-ts";
import {
    Context,
    AttributeInfo,
} from "../types";

const DEFAULT_WRITER = async (ctx: Context, value: ASN1Element): Promise<void> => {
    ctx.log.info(value.value.toString());
};

const DEFAULT_READER = async (ctx: Context): Promise<ASN1Element> => {
    ctx.log.info("Would have read");
    return new DERElement();
};

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
