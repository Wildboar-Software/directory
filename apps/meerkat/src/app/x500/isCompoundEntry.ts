import type { Vertex } from "../types/index.js";
import {
    id_oc_parent,
} from "@wildboar/x500/InformationFramework";
import {
    id_oc_child,
} from "@wildboar/x500/InformationFramework";

/**
 * @summary Determine whether an entry is compound
 * @description
 *
 * This function takes an entry and returns a `boolean` indicating whether the
 * entry is compound. This is easily determined by whether the entry has the
 * auxiliary object classes `parent` or `child` defined in ITU Recommendation
 * X.501 (2016), section 13.3.3.
 *
 * @param entry The entry whose composition is in question
 * @returns A `boolean` indicating whether the entry is compound or not
 *
 * @function
 */
export
function isCompoundEntry (entry: Vertex): boolean {
    return (
        entry.dse.objectClass.has(id_oc_parent.toString())
        || !entry.dse.objectClass.has(id_oc_child.toString())
    );
}

export default isCompoundEntry;
