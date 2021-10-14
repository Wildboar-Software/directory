import type { ContextTypeInfo } from "@wildboar/meerkat-types";
import { TRUE } from "asn1-ts";
import type ContextMatcher from "@wildboar/x500/src/lib/types/ContextMatcher";
import type {
    CONTEXT,
} from "@wildboar/x500/src/lib/modules/InformationFramework/CONTEXT.oca";

export
function contextTypeFromInformationObject (io: CONTEXT, matcher: ContextMatcher, syntax?: string): ContextTypeInfo {
    return {
        id: io["&id"],
        absentMatch: io["&absentMatch"] ?? TRUE,
        matcher,
        syntax: syntax ?? "",
    };
}

export default contextTypeFromInformationObject;
