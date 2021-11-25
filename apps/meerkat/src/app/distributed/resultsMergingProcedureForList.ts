import type { Context, ClientConnection } from "@wildboar/meerkat-types";
import {
    ListResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData.ta";
import { ContinuationReference } from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import {
    OperationProgress_nameResolutionPhase_completed as completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import { strict as assert } from "assert";
import lcrProcedure from "./lcrProcedure";

export
async function resultsMergingProcedureForList (
    ctx: Context,
    conn: ClientConnection,
    data: ListResultData,
    local: boolean,
    NRcontinuationList: ContinuationReference[],
    SRcontinuationList: ContinuationReference[],
): Promise<ListResultData> {
    // We skip deduplicating listInfo for now.
    if (local) {
        /** REVIEW:
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
        return data;
    }
    if (("listInfo" in data) && data.listInfo.partialOutcomeQualifier) {
        const poq = data.listInfo.partialOutcomeQualifier;
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
        await lcrProcedure(SRcontinuationList);
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
    return data;
}

export default resultsMergingProcedureForList;
