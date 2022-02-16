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

// TODO: Document expectation of ordering of relevantSubentries.

/**
 * @summary Read the collective attributes of an entry
 * @description
 *
 * Reads the collective attributes of an entry.
 *
 * @param ctx The context object
 * @param vertex The DSE whose attributes are to be read
 * @param relevantSubentries The subentries whose subtree specification selects
 *  for the DSE indicated by the argument `vertex`
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
    const indexOfFirstCASA: number = collectiveAttributeSubentries
        .findIndex((sub) => sub.immediateSuperior?.dse.admPoint?.administrativeRole.has(ID_CASA));
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
