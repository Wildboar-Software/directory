import type {
    Context,
    Vertex,
} from "../../types";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    id_oa_excludeAllCollectiveAttributes,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-excludeAllCollectiveAttributes.va";

const EXCLUDE_ALL: string = id_oa_excludeAllCollectiveAttributes.toString();

export
function readCollectiveAttributes (
    ctx: Context,
    entry: Vertex,
    relevantSubentries: Vertex[],
): Attribute[] {
    if (entry.dse.entry?.collectiveExclusions.has(EXCLUDE_ALL)) {
        return [];
    }
    return relevantSubentries
        .flatMap((subentry) => subentry.dse.subentry?.collectiveAttributes ?? [])
        .filter((attr) => !entry.dse.entry?.collectiveExclusions.has(attr.type_.toString()));
        ;
    // TODO: Support collectiveExclusions
}

export default readCollectiveAttributes;
