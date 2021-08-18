import type { Context } from "../types";
import * as errors from "../errors";
import { ContinuationReference } from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import {
    OperationProgress_nameResolutionPhase_completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import { ReferralData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReferralData.ta";
import { strict as assert } from "assert";
import { ServiceErrorData, ServiceProblem_unableToProceed } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import { apinfoProcedure } from "./apinfoProcedure";
import ChainedRequest from "@wildboar/x500/src/lib/types/ChainedRequest";
import ChainedResultOrError from "@wildboar/x500/src/lib/types/ChainedResultOrError";

export
interface NRCRProcedureReturn {
    readonly continuationList: ContinuationReference[];
    readonly responses: ChainedResultOrError[];
}

export
async function nrcrProcedure (
    ctx: Context,
    crefs: ContinuationReference[],
    req: ChainedRequest,
    chainingProhibited: boolean,
): Promise<NRCRProcedureReturn> {
    assert(req.chaining.operationProgress?.nameResolutionPhase !== OperationProgress_nameResolutionPhase_completed);
    assert(crefs.length); // This procedure should not be called if there are no refs.
    if (chainingProhibited) { // TODO: Permit local DSA policy to prohibit chaining.
        // TODO: Permit configuration of what to do here.
        throw new errors.ReferralError(
            "Referral",
            new ReferralData(
                crefs[0], // TODO:
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    }
    for (const cref of crefs) {
        try {
            const result: ChainedResultOrError | null = await apinfoProcedure(ctx, cref.accessPoints, req);
            if (!result) {
                continue;
            }
            return {
                continuationList: [],
                responses: [ result ],
            };
        } catch (e) {
            continue;
        }

        // All of this is commented out because I think the actual procedure does not effectively differ.
        // /**
        //  * From ITU Recommendation X.518 (2016), Section 10.11, Item f:
        //  *
        //  * > Only where non-specific subordinate references are involved can
        //  * > there be more than one AccessPointInformation item [on a
        //  * > Continuation Reference].
        //  *
        //  * TODO: Review if NSSRs can produce a CR with only one API.
        //  */
        // if (cref.accessPoints.length > 1) { // How the hell do you determine if a CR is NSSR?
        //     // call APInfo();
        // }
    }
    throw new errors.ServiceError(
        "Name could not be resolved.",
        new ServiceErrorData(
            ServiceProblem_unableToProceed, // REVIEW: Not sure this is the right error.
            [],
            undefined,
            undefined,
            undefined,
            undefined,
        ),
    );
    // TODO: This procedure is not actually done.
}

export default nrcrProcedure;
