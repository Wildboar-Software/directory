import type { Context } from "@wildboar/meerkat-types";
import type {
    SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
import type {
    SearchResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResultData.ta";
import { ContinuationReference } from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import {
    OperationProgress_nameResolutionPhase_completed as completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import { strict as assert } from "assert";
import scrProcedure from "./scrProcedure";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";

export
async function resultsMergingProcedureForSearch (
    ctx: Context,
    res: SearchResult,
    NRcontinuationList: ContinuationReference[],
    SRcontinuationList: ContinuationReference[],
): Promise<SearchResult> {
    const data: SearchResultData = getOptionallyProtectedValue(res);
    // We skip removing duplicates for now.
    // TODO: Return if limit problem.
    if (("searchInfo" in data) && data.searchInfo.partialOutcomeQualifier) {
        const poq = data.searchInfo.partialOutcomeQualifier;
        for (const cr of (poq.unexplored ?? [])) {
            // None shall be ignored for now.
            if (cr.operationProgress.nameResolutionPhase === completed) {
                SRcontinuationList.push(cr);
            } else {
                NRcontinuationList.push(cr);
            }
        }
    }
    if (SRcontinuationList.length) {
        await scrProcedure(SRcontinuationList);
    }
    assert(SRcontinuationList.length === 0);
    /**
     * The text of the specification seems to imply that NRCR procedure is only
     * called when results merging is being done for the search operation. The
     * specification says:
     *
     * > If SRcontinuationList is empty, then check if there are Continuation
     * > References in NRcontinuationList . If so, call the Name Resolution
     * > Continuation Reference procedure and continue at step 3).
     *
     * Step 3 says right away: "The operation is a Search operation."
     *
     * This makes more sense to me, since I can't imagine a situation where you
     * would need to resolve a name after resolving the target object for the
     * list operation.
     */
    return res;
}

export default resultsMergingProcedureForSearch;
