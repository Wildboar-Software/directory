import type { ClientAssociation, OPCR } from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
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
import {
    ReferenceType_nonSpecificSubordinate,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ReferenceType.ta";
import { printInvokeId } from "../utils/printInvokeId";
import { compareAuthenticationLevel } from "@wildboar/x500";
import { OperationOutcome, ErrorParameters } from "@wildboar/rose-transport";

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
 * @param signErrors Whether to cryptographically sign errors
 * @returns An optionally-protected chained result or an error
 *
 * @function
 * @async
 */
export
async function nrcrProcedure (
    ctx: MeerkatContext,
    assn: ClientAssociation | undefined,
    reqData: Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
    state: OperationDispatcherState,
    chainingProhibited: BOOLEAN,
    partialNameResolution: BOOLEAN,
    signErrors: boolean,
): Promise<OPCR | ErrorParameters> {
    const op = ("present" in state.invokeId)
        ? assn?.invocations.get(Number(state.invokeId.present))
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
                        signErrors,
                        assn?.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
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
    const insufficientAuthForChaining = assn && (
        (
            ("basicLevels" in assn.authLevel)
            && (compareAuthenticationLevel( // Returns true if a > b.
                ctx.config.chaining.minAuthRequired,
                assn.authLevel.basicLevels,
            ))
        )
        || !("basicLevels" in assn.authLevel)
    );
    if (
        ctx.config.chaining.prohibited
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
                    signErrors,
                    assn?.boundNameAndUID?.dn,
                    undefined,
                    referral["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
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
                        signErrors,
                        assn?.boundNameAndUID?.dn,
                        undefined,
                        abandoned["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        assert(cref.accessPoints[0]);
        checkTimeLimit();
        const isNSSR = (cref.referenceType === ReferenceType_nonSpecificSubordinate);
        if (!isNSSR) {
            const outcome = await apinfoProcedure(
                ctx,
                cref.accessPoints[0],
                req,
                assn,
                state,
                signErrors,
                chainingProhibited,
            );
            if (!outcome) {
                continue;
            } else if (("result" in outcome) && outcome.result) {
                return chainedRead.decoderFor["&ResultType"]!(outcome.result.parameter);
            } else if (("error" in outcome) && outcome.error) {
                return outcome.error;
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
                            signErrors,
                            assn?.boundNameAndUID?.dn,
                            undefined,
                            abandoned["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
            let outcome: OperationOutcome | null = null;
            try {
                outcome = await apinfoProcedure(
                    ctx,
                    ap,
                    req,
                    assn,
                    state,
                    signErrors,
                    chainingProhibited,
                );
            } catch {
                continue;
            }
            if (!outcome) {
                continue;
            }
            if (("result" in outcome) && outcome.result) {
                try {
                    return chainedRead.decoderFor["&ResultType"]!(outcome.result.parameter);
                } catch (e) {
                    ctx.log.error(e.message, {
                        remoteFamily: assn?.socket.remoteFamily,
                        remoteAddress: assn?.socket.remoteAddress,
                        remotePort: assn?.socket.remotePort,
                        association_id: assn?.id,
                        invokeID: printInvokeId(req.invokeId),
                    });
                    continue;
                }
            } else if ("error" in outcome) {
                if (compareCode(outcome.error.code, serviceError["&errorCode"]!)) {
                    let errorParam: OPTIONALLY_PROTECTED<ServiceErrorData> | null = null;
                    try {
                        errorParam = serviceError.decoderFor["&ParameterType"]!(outcome.error.parameter);
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
                                    signErrors,
                                    assn?.boundNameAndUID?.dn,
                                    undefined,
                                    serviceError["&errorCode"],
                                ),
                                ctx.dsa.accessPoint.ae_title.rdnSequence,
                                state.chainingArguments.aliasDereferenced,
                                undefined,
                            ),
                            signErrors,
                        );
                    } else {
                        return outcome.error;
                    }
                } else {
                    allServiceErrors = false;
                    continue;
                }
            }
        } // End of NSSR access point loop.
        if (allServiceErrors) {
            // partialNameResolution simply will not be available for
            // internally-generated requests so that operationEvaluation() does
            // not have to be re-written to tolerate an undefined association.
            if (partialNameResolution && assn) {
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
                            signErrors,
                            assn?.boundNameAndUID?.dn,
                            undefined,
                            nameError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
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
                signErrors,
                assn?.boundNameAndUID?.dn,
                undefined,
                serviceError["&errorCode"],
            ),
            ctx.dsa.accessPoint.ae_title.rdnSequence,
            state.chainingArguments.aliasDereferenced,
            undefined,
        ),
        signErrors,
    );
}

export default nrcrProcedure;
