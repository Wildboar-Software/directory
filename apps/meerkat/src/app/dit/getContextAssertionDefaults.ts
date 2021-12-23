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
export
function getContextAssertionDefaults (
    ctx: Context,
    entry: Vertex,
    relevantSubentries: Vertex[],
): TypeAndContextAssertion[] {
    const cadSubentries = relevantSubentries
        .filter((sub) => sub.dse.objectClass.has(CAD_SUBENTRY))
        .reverse();
    const firstAdmPointIndex = cadSubentries
        .findIndex((sub) => sub.immediateSuperior?.dse.admPoint?.administrativeRole.has(ID_CDSA));
    if (firstAdmPointIndex === -1) {
        return [];
    }
    const subentriesWithinScope = cadSubentries
        .slice(0, firstAdmPointIndex + 1)
        .filter((sub) => (
            sub.immediateSuperior?.dse.admPoint?.administrativeRole.has(ID_CDSA)
        ));
    return subentriesWithinScope
        .flatMap((subentry) => subentry.dse.subentry?.contextAssertionDefaults ?? []);
}

export default getContextAssertionDefaults;
