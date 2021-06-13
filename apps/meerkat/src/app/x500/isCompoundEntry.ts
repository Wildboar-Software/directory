import type { Entry } from "../types";
import {
    id_oc_parent,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-parent.va";
import {
    id_oc_child,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-child.va";

export
function isCompoundEntry (entry: Entry): boolean {
    return (
        entry.objectClass.has(id_oc_parent.toString())
        || !entry.objectClass.has(id_oc_child.toString())
    );
}

export default isCompoundEntry;
