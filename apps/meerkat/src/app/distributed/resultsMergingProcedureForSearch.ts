import type { Context } from "@wildboar/meerkat-types";
import { ContinuationReference } from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import {
    OperationProgress_nameResolutionPhase_completed as completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import { strict as assert } from "assert";
import scrProcedure from "./scrProcedure";
import type { SearchState } from "./search_i";

/**
 * @summary The Results Merging Procedure (for search), defined in ITU Recommendation X.518.
 * @description
 *
 * The variant of the Results Merging Procedure for the search operation, as
 * defined in ITU Recommendation X.518 (2016), Section 21.
 *
 * @param ctx The context object
 * @param res The search operation state
 * @param NRcontinuationList The list of name resolution continuation references
 * @param SRcontinuationList The list of subrequest continuation references
 * @returns An updated search operation state
 *
 * @function
 * @async
 */
export
async function resultsMergingProcedureForSearch (
    ctx: Context,
    res: SearchState,
    NRcontinuationList: ContinuationReference[],
    SRcontinuationList: ContinuationReference[],
): Promise<SearchState> {
    // const data: SearchResultData = getOptionallyProtectedValue(res);
    // We skip removing duplicates for now.
    if (res.poq) {
        if (res.poq.limitProblem !== undefined) {
            return res;
        }
        for (const cr of (res.poq.unexplored ?? [])) {
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
