import type { MeerkatContext } from "../ctx";
import type { ClientAssociation } from "@wildboar/meerkat-types";
import {
    OperationProgress_nameResolutionPhase_completed as completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import scrProcedure from "./scrProcedure";
import type { SearchState } from "./search_i";
import {
    SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import { OperationDispatcherState } from "./OperationDispatcher";

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
    ctx: MeerkatContext,
    assn: ClientAssociation,
    arg: SearchArgument,
    res: SearchState,
    state: OperationDispatcherState,
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
                state.SRcontinuationList.push(cr);
            } else {
                state.NRcontinuationList.push(cr);
            }
        }
    }
    if (state.SRcontinuationList.length) {
        // Deviation: this is not specified, but I think we need to do it.
        if (res.poq?.unexplored) {
            // We will re-introduce CRs as we fail to access the
            res.poq.unexplored.length = 0;
        }
        await scrProcedure(
            ctx,
            assn,
            arg,
            res,
            state,
        );
    }
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
