import type { Context, ClientConnection } from "../types";
import { BOOLEAN, TRUE } from "asn1-ts";
import * as errors from "../errors";
import {
    OperationProgress,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress.ta";
import {
    OperationProgress_nameResolutionPhase_completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import { ReferralData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReferralData.ta";
import { strict as assert } from "assert";
import { ServiceErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import { apinfoProcedure } from "./apinfoProcedure";
import ChainedResultOrError from "@wildboar/x500/src/lib/types/ChainedResultOrError";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    ServiceProblem_timeLimitExceeded,
    ServiceProblem_unableToProceed,
    ServiceProblem_busy,
    ServiceProblem_unavailable,
    ServiceProblem_unwillingToPerform,
    ServiceProblem_invalidReference,
    ServiceProblem_ditError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    NameProblem_noSuchObject,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import {
    nameError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/nameError.oa";
import {
    referral,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/referral.oa";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import { NameErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameErrorData.ta";
import type { OperationDispatcherState } from "./OperationDispatcher";
import cloneChainingArguments from "../x500/cloneChainingArguments";

export
async function nrcrProcedure (
    ctx: Context,
    conn: ClientConnection,
    state: OperationDispatcherState,
    chainingProhibited: BOOLEAN,
    partialNameResolution: BOOLEAN,
): Promise<ChainedResultOrError | null> {
    const timeLimitEndTime: Date | undefined = state.chainingArguments.timeLimit
        ? getDateFromTime(state.chainingArguments.timeLimit)
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
    assert(state.chainingArguments.operationProgress?.nameResolutionPhase !== OperationProgress_nameResolutionPhase_completed);
    assert(state.NRcontinuationList.length); // This procedure should not be called if there are no refs.
    if (chainingProhibited) { // TODO: Permit local DSA policy to prohibit chaining.
        // TODO: Permit configuration of what to do here.
        throw new errors.ReferralError( // TODO: If this is called from LDAP, an LDAP referral must be returned.
            "Referral",
            new ReferralData(
                state.NRcontinuationList[0],
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    referral["&errorCode"],
                ),
                undefined,
                undefined,
                undefined,
            ),
        );
    }
    const req = {
        chaining: state.chainingArguments,
        argument: state.operationArgument,
        invokeId: state.invokeId,
        opCode: state.operationCode,
    };
    for (const cref of state.NRcontinuationList) {
        assert(cref.accessPoints[0]);
        checkTimeLimit();
        // /**
        //  * From ITU Recommendation X.518 (2016), Section 10.11, Item f:
        //  *
        //  * > Only where non-specific subordinate references are involved can
        //  * > there be more than one AccessPointInformation item [on a
        //  * > Continuation Reference].
        //  *
        //  * TODO: Review if NSSRs can produce a CR with only one API.
        //  */
        const isNSSR = (cref.accessPoints.length > 1);
        if (!isNSSR) {
            const outcome: ChainedResultOrError | null = await apinfoProcedure(ctx, cref.accessPoints[0], req);
            if (!outcome) {
                continue;
            }
            return outcome;
        }
        let allServiceErrors: boolean = true;
        for (const ap of cref.accessPoints) {
            try {
                const outcome: ChainedResultOrError | null = await apinfoProcedure(ctx, ap, req);
                if (!outcome) {
                    continue;
                }
                if ("result" in outcome) {
                    return outcome;
                } else if ("error" in outcome) {
                    if (outcome.errcode && compareCode(outcome.errcode, serviceError["&errorCode"]!)) {
                        const errorParam = serviceError.decoderFor["&ParameterType"]!(outcome.error);
                        const errorData = getOptionallyProtectedValue(errorParam);
                        if (
                            (errorData.problem === ServiceProblem_unableToProceed)
                            || (errorData.problem === ServiceProblem_busy)
                            || (errorData.problem === ServiceProblem_unavailable)
                            || (errorData.problem === ServiceProblem_unwillingToPerform)
                        ) {
                            if (errorData.problem !== ServiceProblem_unableToProceed) {
                                allServiceErrors = false;
                            }
                            continue;
                        } else if (errorData.problem === ServiceProblem_invalidReference) {
                            throw new errors.ServiceError(
                                "DIT Error.",
                                new ServiceErrorData(
                                    ServiceProblem_ditError,
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
                        } else {
                            return outcome;
                        }
                    } else {
                        allServiceErrors = false;
                        continue;
                    }
                }
            } catch (e) {
                continue;
            }
        } // End of NSSR access point loop.
        if (allServiceErrors) {
            if (partialNameResolution) {
                state.partialName = TRUE;
                state.entrySuitable = TRUE;
                state.chainingArguments = cloneChainingArguments(state.chainingArguments, {
                    operationProgress: new OperationProgress(
                        OperationProgress_nameResolutionPhase_completed,
                        undefined,
                    ),
                });
                return null;
            } else {
                throw new errors.NameError(
                    "Could not find object in any relevant NSSR DSA.",
                    new NameErrorData(
                        NameProblem_noSuchObject,
                        {
                            rdnSequence: [],
                        },
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            nameError["&errorCode"],
                        ),
                        undefined,
                        undefined,
                        undefined,
                    ),
                );
            }
        }
    }
    throw new errors.ServiceError(
        "Name could not be resolved.",
        new ServiceErrorData(
            ServiceProblem_unableToProceed, // TODO: Not sure this is the right error.
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

export default nrcrProcedure;
