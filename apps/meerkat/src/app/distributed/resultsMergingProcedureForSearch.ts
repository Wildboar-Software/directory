import type { MeerkatContext } from "../ctx.js";
import type { ClientAssociation } from "../types/index.js";
import {
    OperationProgress_nameResolutionPhase_completed as completed,
} from "@wildboar/x500/DistributedOperations";
import scrProcedure from "./scrProcedure.js";
import type { SearchState } from "./search_i.js";
import {
    SearchArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import { OperationDispatcherState } from "./OperationDispatcher.js";
import printInvokeId from "../utils/printInvokeId.js";
import printCode from "../utils/printCode.js";

/**
 * @summary The Results Merging Procedure (for search), defined in ITU Recommendation X.518.
 * @description
 *
 * The variant of the Results Merging Procedure for the search operation, as
 * defined in ITU Recommendation X.518 (2016), Section 21.
 *
 * @param ctx The context object
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
    const logInfo = {
        remoteFamily: assn.socket.remoteFamily,
        remoteAddress: assn.socket.remoteAddress,
        remotePort: assn.socket.remotePort,
        association_id: assn.id,
        invokeId: ("present" in state.invokeId) ? Number(state.invokeId.present) : undefined,
        opCode: printCode(state.operationCode),
        operationIdentifier: state.chainingArguments.operationIdentifier
            ? Number(state.chainingArguments.operationIdentifier)
            : undefined,
    };
    // const data: SearchResultData = getOptionallyProtectedValue(res);
    // We skip removing duplicates for now.
    if (res.poq) {
        if (res.poq.limitProblem !== undefined) {
            ctx.log.debug(ctx.i18n.t("log:search_complete", {
                aid: assn.id,
                iid: printInvokeId(state.invokeId),
                limit: res.poq.limitProblem.toString(),
                context: "limit",
            }), logInfo);
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
    } else {
        ctx.log.debug(ctx.i18n.t("log:search_complete", {
            aid: assn.id,
            iid: printInvokeId(state.invokeId),
        }), logInfo);
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
