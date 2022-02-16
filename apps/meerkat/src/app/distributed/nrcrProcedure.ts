import type { Context, ClientAssociation, OPCR } from "@wildboar/meerkat-types";
import { BOOLEAN, TRUE } from "asn1-ts";
import * as errors from "@wildboar/meerkat-types";
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
import Error_ from "@wildboar/x500/src/lib/types/Error_";
import ResultOrError from "@wildboar/x500/src/lib/types/ResultOrError";
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
import { OperationDispatcher, OperationDispatcherState } from "./OperationDispatcher";
import cloneChainingArguments from "../x500/cloneChainingArguments";
import { chainedRead } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedRead.oa";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import getDistinguishedName from "../x500/getDistinguishedName";
import type {
    OPTIONALLY_PROTECTED,
} from "@wildboar/x500/src/lib/modules/EnhancedSecurity/OPTIONALLY-PROTECTED.ta";
import type {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";

// TODO: Really, this should have the same return type as the OperationDispatcher.
// This also returns a value, but also mutates the OD state, which is sketchy.

/**
 * @summary The Name Resolution Continuation Reference Procedure, defined in ITU Recommendation X.518.
 * @description
 *
 * The Name Resolution Continuation Reference Procedure, as defined in ITU
 * Recommendation X.518 (2016), Section 20.4.1.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param reqData The chained request
 * @param state The operation dispatcher state
 * @param chainingProhibited Whether chaining was prohibited
 * @param partialNameResolution Whether partial name resolution is permitted
 * @returns An optionally-protected chained result or an error
 *
 * @function
 * @async
 */
export
async function nrcrProcedure (
    ctx: Context,
    assn: ClientAssociation,
    reqData: Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
    state: OperationDispatcherState,
    chainingProhibited: BOOLEAN,
    partialNameResolution: BOOLEAN,
): Promise<OPCR | Error_> {
    const op = ("present" in state.invokeId)
        ? assn.invocations.get(Number(state.invokeId.present))
        : undefined;
    const timeLimitEndTime: Date | undefined = state.chainingArguments.timeLimit
        ? getDateFromTime(state.chainingArguments.timeLimit)
        : undefined;
    const checkTimeLimit = () => {
        if (timeLimitEndTime && (new Date() > timeLimitEndTime)) {
            throw new errors.ServiceError(
                ctx.i18n.t("err:time_limit"),
                new ServiceErrorData(
                    ServiceProblem_timeLimitExceeded,
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
    };
    assert(state.chainingArguments.operationProgress?.nameResolutionPhase !== OperationProgress_nameResolutionPhase_completed);
    assert(state.NRcontinuationList.length); // This procedure should not be called if there are no refs.
    /**
     * This exists to mitigate a vulnerability. Without requiring authentication
     * of a user for chaining, a nefarious user could discover entries that have
     * a `uniqueIdentifier` by binding anonymously as an entry whose existence
     * is to be determined illegitimately and requesting an operation that would
     * result in chaining to a DSA that the nefarious user controls and seeing
     * if the `ChainingArguments` now has a `uniqueIdentifier`. If this is the
     * case, the entry to which the user was anonymously bound can be confirmed
     * to exist.
     *
     * The unique identifier MUST be sent along with chained requests. It is
     * a security feature, so you can't just disable sending the unique
     * identifier in chained requests. Specifically, the unique identifier
     * exists to distinguish between different generations of an object having
     * the same name.
     */
    const insufficientAuthForChaining = (
        ("basicLevels" in assn.authLevel)
        && (
            (assn.authLevel.basicLevels.level < ctx.config.chaining.minAuthLevel)
            || ((assn.authLevel.basicLevels.localQualifier ?? 0) < ctx.config.chaining.minAuthLocalQualifier)
        )
    )
    if (
        ctx.config.prohibitChaining
        || chainingProhibited
        || insufficientAuthForChaining
    ) {
        throw new errors.ReferralError(
            ctx.i18n.t("err:referral"),
            new ReferralData(
                state.NRcontinuationList[0],
                [],
                createSecurityParameters(
                    ctx,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    referral["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
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
        if (op?.abandonTime) {
            op.events.emit("abandon");
            throw new errors.AbandonError(
                ctx.i18n.t("err:abandoned"),
                new AbandonedData(
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        abandoned["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
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
            const outcome: ResultOrError | null = await apinfoProcedure(ctx, cref.accessPoints[0], req, assn, state);
            if (!outcome) {
                continue;
            } else if (("result" in outcome) && outcome.result) {
                return chainedRead.decoderFor["&ResultType"]!(outcome.result);
            } else if (("error" in outcome) && outcome.error) {
                return outcome;
            }
        }
        let allServiceErrors: boolean = true;
        for (const ap of cref.accessPoints) {
            if (op?.abandonTime) {
                op.events.emit("abandon");
                throw new errors.AbandonError(
                    ctx.i18n.t("err:abandoned"),
                    new AbandonedData(
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            abandoned["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
            let outcome: ResultOrError | null = null;
            try {
                outcome = await apinfoProcedure(ctx, ap, req, assn, state);
            } catch {
                continue;
            }
            if (!outcome) {
                continue;
            }
            if (("result" in outcome) && outcome.result) {
                try {
                    return chainedRead.decoderFor["&ResultType"]!(outcome.result);
                } catch (e) {
                    ctx.log.error(e.message);
                    continue;
                }
            } else if ("error" in outcome) {
                if (outcome.errcode && compareCode(outcome.errcode, serviceError["&errorCode"]!)) {
                    let errorParam: OPTIONALLY_PROTECTED<ServiceErrorData> | null = null;
                    try {
                        errorParam = serviceError.decoderFor["&ParameterType"]!(outcome.error);
                    } catch {
                        continue;
                    }
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
                            ctx.i18n.t("err:dit_error"),
                            new ServiceErrorData(
                                ServiceProblem_ditError,
                                [],
                                createSecurityParameters(
                                    ctx,
                                    assn.boundNameAndUID?.dn,
                                    undefined,
                                    serviceError["&errorCode"],
                                ),
                                ctx.dsa.accessPoint.ae_title.rdnSequence,
                                state.chainingArguments.aliasDereferenced,
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
                const localResult = await OperationDispatcher.operationEvaluation(
                    ctx,
                    state,
                    assn,
                    req,
                    reqData,
                    false,
                );
                return localResult.result;
            } else {
                throw new errors.NameError(
                    ctx.i18n.t("err:entry_not_found_in_nssr"),
                    new NameErrorData(
                        NameProblem_noSuchObject,
                        {
                            rdnSequence: getDistinguishedName(state.foundDSE),
                        },
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            nameError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
        }
    }
    throw new errors.ServiceError(
        ctx.i18n.t("err:name_not_resolved"),
        new ServiceErrorData(
            ServiceProblem_unavailable, // The specification does not clarify what the problem is supposed to be.
            [],
            createSecurityParameters(
                ctx,
                assn.boundNameAndUID?.dn,
                undefined,
                serviceError["&errorCode"],
            ),
            ctx.dsa.accessPoint.ae_title.rdnSequence,
            state.chainingArguments.aliasDereferenced,
            undefined,
        ),
    );
}

export default nrcrProcedure;
