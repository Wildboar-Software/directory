import type {
    Context,
    Vertex,
} from "@wildboar/meerkat-types";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    id_oa_excludeAllCollectiveAttributes,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-excludeAllCollectiveAttributes.va";
import {
    collectiveAttributeSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/collectiveAttributeSubentry.oa";
import {
    id_ar_collectiveAttributeSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-collectiveAttributeSpecificArea.va";
import {
    id_ar_collectiveAttributeInnerArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-collectiveAttributeInnerArea.va";

const CA_SUBENTRY: string = collectiveAttributeSubentry["&id"].toString();
const ID_CASA: string = id_ar_collectiveAttributeSpecificArea.toString();
const ID_CAIA: string = id_ar_collectiveAttributeInnerArea.toString();
const EXCLUDE_ALL: string = id_oa_excludeAllCollectiveAttributes.toString();

/**
 * @summary Read the collective attributes of an entry
 * @description
 *
 * Reads the collective attributes of an entry.
 *
 * @param ctx The context object
 * @param vertex The DSE whose attributes are to be read
 * @param relevantSubentries The subentries whose subtree specification selects
 *  for the DSE indicated by the argument `vertex`, in order of descending
 *  administrative point
 * @returns An array of collective attributes
 *
 * @function
 */
export
function readCollectiveAttributes (
    ctx: Context,
    vertex: Vertex,
    relevantSubentries: Vertex[],
): Attribute[] {
    if (vertex.dse.entry?.collectiveExclusions.has(EXCLUDE_ALL)) {
        return [];
    }
    const collectiveAttributeSubentries = relevantSubentries
        .filter((sub) => sub.dse.objectClass.has(CA_SUBENTRY))
        .reverse();
    /**
     * It is not enough to simply stop once we've encountered the first subentry
     * whose immediate superior DSE has a CASA administrative role, because
     * there might be other subentries under that same administrative point.
     * Instead, we must note that a CASA has been encountered, then keep
     * iterating until we find a subentry that DOES NOT belong to that admin
     * point.
     */
    const indexOfFirstCASA: number = collectiveAttributeSubentries
        .findIndex((sub, i, array) => {
            const admPoint = sub.immediateSuperior?.dse;
            if (admPoint?.admPoint?.administrativeRole.has(ID_CASA)) {
                const next = array[i + 1];
                return (
                    // If there is no next subentry, or no next admin point
                    !next?.immediateSuperior
                    // Or the next admin point is not the same as this one...
                    || (admPoint.id !== next.immediateSuperior.dse.id)
                );
            }
            return false;
        });
    if (indexOfFirstCASA === -1) {
        return [];
    }
    const subentriesWithinScope = collectiveAttributeSubentries
        .slice(0, indexOfFirstCASA + 1)
        .filter((sub) => (
            sub.immediateSuperior?.dse.admPoint?.administrativeRole.has(ID_CASA)
            || sub.immediateSuperior?.dse.admPoint?.administrativeRole.has(ID_CAIA)
        ));
    return subentriesWithinScope
        .flatMap((subentry) => subentry.dse.subentry?.collectiveAttributes ?? [])
        .filter((attr) => !vertex.dse.entry?.collectiveExclusions.has(attr.type_.toString()));
        ;
}

export default readCollectiveAttributes;
