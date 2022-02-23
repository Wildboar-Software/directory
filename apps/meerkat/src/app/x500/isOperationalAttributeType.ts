import type { Context } from "@wildboar/meerkat-types";
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";

export
function isOperationalAttributeType (ctx: Context, type_: OBJECT_IDENTIFIER): boolean {
    const spec = ctx.attributeTypes.get(type_.toString());
    return !spec || (spec.usage !== AttributeUsage_userApplications);
}

export default isOperationalAttributeType;
