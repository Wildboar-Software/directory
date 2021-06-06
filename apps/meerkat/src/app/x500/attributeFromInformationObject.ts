import {
    ATTRIBUTE,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { ASN1Element, DERElement } from "asn1-ts";
import {
    Context,
    AttributeInfo,
} from "../types";

// TODO: Make ATTRIBUTE.&id non-optional.

const DEFAULT_WRITER = async (ctx: Context, value: ASN1Element): Promise<void> => {
    ctx.log.info(value.value.toString());
};

const DEFAULT_READER = async (ctx: Context): Promise<ASN1Element> => {
    ctx.log.info("Would have read");
    return new DERElement();
};

export
function attributeFromInformationObject (io: ATTRIBUTE): AttributeInfo {
    if (!io["&id"]) {
        throw new Error();
    }
    return {
        id: io["&id"].toString(),
        // parent:
        value: {
            write: DEFAULT_WRITER,
            read: DEFAULT_READER,
        },
        // equalityMatcher?: EqualityMatcher;
        // orderingMatcher?: OrderingMatcher;
        // substringsMatcher?: SubstringsMatcher;
        singleValued: io["&single-valued"] ?? false,
        collective: io["&collective"] ?? false,
        dummy: io["&dummy"] ?? false,
        noUserModification: io["&no-user-modification"] ?? false,
        obsolete: io["&obsolete"] ?? false,
        usage: io["&usage"] ?? AttributeUsage_userApplications,
        ldapSyntax: io["&ldapSyntax"]?.toString(),
        ldapNames: io["&ldapName"],
        ldapDescription: io["&ldapDesc"],
    };
}

export default attributeFromInformationObject;
