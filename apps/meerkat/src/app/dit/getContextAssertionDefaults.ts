import type {
    Context,
    Vertex,
} from "@wildboar/meerkat-types";
import {
    contextAssertionSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/contextAssertionSubentry.oa";
import {
    id_ar_contextDefaultSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-contextDefaultSpecificArea.va";
import type {
    TypeAndContextAssertion,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/TypeAndContextAssertion.ta";

const CAD_SUBENTRY: string = contextAssertionSubentry["&id"].toString();
const ID_CDSA: string = id_ar_contextDefaultSpecificArea.toString();

// TODO: Document expectation of ordering of relevantSubentries.
/**
 * @summary Get the context assertion defaults for an entry
 * @description
 *
 * This function retrieves the context assertion defaults for an entry.
 *
 * @param ctx The context object
 * @param entry The entry whose context assertion defaults are to be determined
 * @param relevantSubentries The subentries whose subtree specification selected
 *  the entry given by the `entry` parameter.
 * @returns An array of `TypeAndContextAssertion`s, which are the applicable
 *  context assertion defaults
 *
 * @function
 */
export
function getContextAssertionDefaults (
    ctx: Context,
    entry: Vertex,
    relevantSubentries: Vertex[],
): TypeAndContextAssertion[] {
    const cadSubentries = relevantSubentries
        .filter((sub) => sub.dse.objectClass.has(CAD_SUBENTRY))
        .reverse();
    return cadSubentries
        .find((sub) => sub.immediateSuperior?.dse.admPoint?.administrativeRole.has(ID_CDSA))
        ?.dse.subentry?.contextAssertionDefaults ?? [];
}

export default getContextAssertionDefaults;
