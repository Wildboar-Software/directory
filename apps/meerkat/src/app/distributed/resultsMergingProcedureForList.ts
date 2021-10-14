import type { Context, ClientConnection } from "@wildboar/meerkat-types";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import * as errors from "@wildboar/meerkat-types";
import {
    ListResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData.ta";
import { ContinuationReference } from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import {
    OperationProgress_nameResolutionPhase_completed as completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import { strict as assert } from "assert";
import lcrProcedure from "./lcrProcedure";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_noInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import accessControlSchemesThatUseEntryACI from "../authz/accessControlSchemesThatUseEntryACI";
import accessControlSchemesThatUsePrescriptiveACI from "../authz/accessControlSchemesThatUsePrescriptiveACI";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_ADD,
    PERMISSION_CATEGORY_REMOVE,
    PERMISSION_CATEGORY_MODIFY,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import getIsGroupMember from "../authz/getIsGroupMember";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";

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
        const nullResult = (
            ("listInfo" in data)
            && (data.listInfo.subordinates.length === 0)
        );
        if (nullResult) {
            // TODO: Check ACI, return error if denied... I don't actually feel like this is necessary.
        }
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
