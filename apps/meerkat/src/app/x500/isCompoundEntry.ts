import type { Vertex } from "@wildboar/meerkat-types";
import {
    id_oc_parent,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-parent.va";
import {
    id_oc_child,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-child.va";

export
function isCompoundEntry (entry: Vertex): boolean {
    return (
        entry.dse.objectClass.has(id_oc_parent.toString())
        || !entry.dse.objectClass.has(id_oc_child.toString())
    );
}

export default isCompoundEntry;
