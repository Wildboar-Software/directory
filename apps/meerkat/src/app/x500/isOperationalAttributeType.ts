import type { Context } from "../types/index.js";
import type { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/InformationFramework";

export
function isOperationalAttributeType (ctx: Context, type_: OBJECT_IDENTIFIER): boolean {
    const spec = ctx.attributeTypes.get(type_.toString());
    return !spec || (spec.usage !== AttributeUsage_userApplications);
}

export default isOperationalAttributeType;
