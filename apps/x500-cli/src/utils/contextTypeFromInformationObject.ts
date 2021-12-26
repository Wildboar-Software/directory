import type { ContextTypeInfo } from "../types";
import type {
    CONTEXT,
} from "@wildboar/x500/src/lib/modules/InformationFramework/CONTEXT.oca";

export
function contextTypeFromInformationObject (io: CONTEXT, name?: string, syntax?: string): ContextTypeInfo {
    return {
        id: io["&id"],
        name,
        syntax: syntax ?? "",
    };
}

export default contextTypeFromInformationObject;
