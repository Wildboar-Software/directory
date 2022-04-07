import type { Context, ClientAssociation } from "@wildboar/meerkat-types";
import { ContinuationReference } from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import {
    OperationProgress_nameResolutionPhase_completed as completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import { strict as assert } from "assert";
import lcrProcedure from "./lcrProcedure";
import type { ListState } from "./list_i";

/**
 * @summary The Results Merging Procedure (for list), defined in ITU Recommendation X.518.
 * @description
 *
 * The variant of the Results Merging Procedure for the list operation, as
 * defined in ITU Recommendation X.518 (2016), Section 21.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param res The list operation state
 * @param local Whether the request originated internally by the DSA itself
 * @param NRcontinuationList The list of name resolution continuation references
 * @param SRcontinuationList The list of subrequest continuation references
 * @returns An updated list operation state
 *
 * @function
 * @async
 */
export
async function resultsMergingProcedureForList (
    ctx: Context,
    assn: ClientAssociation,
    res: ListState,
    local: boolean,
    NRcontinuationList: ContinuationReference[],
    SRcontinuationList: ContinuationReference[],
): Promise<ListState> {
    // We skip deduplicating listInfo for now.
    if (local) {
        /** DEVIATION:
         * The specification says that, if the result is "null" (has no entries)
         * the DSA may choose to throw an "appropriate error" depending on
         * access controls and whether "local policy allows." The problem is
         * that I don't know why you would throw an error instead of returning
         * the null result or what to check for with access control. For now, it
         * will be Meerkat DSA's "local policy" to just return the null result
         * until I discover what exactly the security issue (if any) is.
         */
        // const nullResult = (
        //     ("listInfo" in data)
        //     && (data.listInfo.subordinates.length === 0)
        // );
        return res;
    }
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
        await lcrProcedure(SRcontinuationList);
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

export default resultsMergingProcedureForList;
