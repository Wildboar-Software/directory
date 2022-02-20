import type { Vertex } from "@wildboar/meerkat-types";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";

/**
 * @summary Given a vertex, recurses up the internal DIT to produce its distinguished name
 * @description
 *
 * Recurses up the internal DIT starting with a given vertex to obtain its
 * distinguished name.
 *
 * @param entry The DSE whose distinguished name is sought
 * @returns The DSE's distinguished name
 *
 * @function
 */
export
function getDistinguishedName (entry: Vertex): DistinguishedName {
    if (entry.dse.rdn.length === 0 || !entry.immediateSuperior) {
        return [];
    }
    return [ ...getDistinguishedName(entry.immediateSuperior), entry.dse.rdn ];
}

export default getDistinguishedName;
