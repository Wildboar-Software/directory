import type { Context, ClientConnection } from "../types";
import * as errors from "../errors";
import { ContinuationReference } from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import {
    OperationProgress_nameResolutionPhase_completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import { ReferralData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReferralData.ta";
import { strict as assert } from "assert";
import { ServiceErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import { apinfoProcedure } from "./apinfoProcedure";
import ChainedRequest from "@wildboar/x500/src/lib/types/ChainedRequest";
import ChainedResultOrError from "@wildboar/x500/src/lib/types/ChainedResultOrError";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    ServiceProblem_timeLimitExceeded,
    ServiceProblem_unableToProceed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import {
    referral,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/referral.oa";

export
interface NRCRProcedureReturn {
    readonly continuationList: ContinuationReference[];
    readonly responses: ChainedResultOrError[];
}

export
async function nrcrProcedure (
    ctx: Context,
    conn: ClientConnection,
    crefs: ContinuationReference[],
    req: ChainedRequest,
    chainingProhibited: boolean,
): Promise<NRCRProcedureReturn> {
    const timeLimitEndTime: Date | undefined = req.chaining.timeLimit
        ? getDateFromTime(req.chaining.timeLimit)
        : undefined;
    const checkTimeLimit = () => {
        if (timeLimitEndTime && (new Date() > timeLimitEndTime)) {
            throw new errors.ServiceError(
                "Could not complete operation in time.",
                new ServiceErrorData(
                    ServiceProblem_timeLimitExceeded,
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
    };
    assert(req.chaining.operationProgress?.nameResolutionPhase !== OperationProgress_nameResolutionPhase_completed);
    assert(crefs.length); // This procedure should not be called if there are no refs.
    if (chainingProhibited) { // TODO: Permit local DSA policy to prohibit chaining.
        // TODO: Permit configuration of what to do here.
        throw new errors.ReferralError(
            "Referral",
            new ReferralData(
                crefs[0], // TODO:
                [],
                createSecurityParameters(
                    ctx,
                    undefined,
                    undefined,
                    referral["&errorCode"],
                ),
                undefined,
                undefined,
                undefined,
            ),
        );
    }
    for (const cref of crefs) {
        checkTimeLimit();
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
            createSecurityParameters(
                ctx,
                undefined,
                undefined,
                serviceError["&errorCode"],
            ),
            undefined,
            undefined,
            undefined,
        ),
    );
    // TODO: This procedure is not actually done.
}

export default nrcrProcedure;
