import type { ContextTypeInfo } from "../types.js";
import type {
    CONTEXT,
} from "@wildboar/x500/InformationFramework";

export
function contextTypeFromInformationObject (io: CONTEXT, name?: string, syntax?: string): ContextTypeInfo {
    return {
        id: io["&id"],
        name,
        syntax: syntax ?? "",
    };
}

export default contextTypeFromInformationObject;
