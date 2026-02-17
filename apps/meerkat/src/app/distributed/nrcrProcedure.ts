import { Buffer } from "node:buffer";
import type { ClientAssociation, OPCR } from "../types/index.js";
import type { MeerkatContext } from "../ctx.js";
import { BOOLEAN, TRUE } from "@wildboar/asn1";
import * as errors from "../types/index.js";
import {
    OperationProgress,
} from "@wildboar/x500/DistributedOperations";
import {
    OperationProgress_nameResolutionPhase_completed,
} from "@wildboar/x500/DistributedOperations";
import { ReferralData } from "@wildboar/x500/DirectoryAbstractService";
import { strict as assert } from "node:assert";
import { ServiceErrorData } from "@wildboar/x500/DirectoryAbstractService";
import { apinfoProcedure } from "./apinfoProcedure.js";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import {
    ServiceProblem_timeLimitExceeded,
    ServiceProblem_unableToProceed,
    ServiceProblem_busy,
    ServiceProblem_unavailable,
    ServiceProblem_unwillingToPerform,
    ServiceProblem_invalidReference,
    ServiceProblem_ditError,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    NameProblem_noSuchObject,
} from "@wildboar/x500/DirectoryAbstractService";
import { getDateFromTime } from "@wildboar/x500";
import {
    serviceError,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    nameError,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    referral,
} from "@wildboar/x500/DirectoryAbstractService";
import { compareCode } from "@wildboar/x500";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import { NameErrorData } from "@wildboar/x500/DirectoryAbstractService";
import { OperationDispatcher, OperationDispatcherState } from "./OperationDispatcher.js";
import cloneChainingArguments from "../x500/cloneChainingArguments.js";
import { chainedRead } from "@wildboar/x500/DistributedOperations";
import {
    AbandonedData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    abandoned,
} from "@wildboar/x500/DirectoryAbstractService";
import getDistinguishedName from "../x500/getDistinguishedName.js";
import type {
    OPTIONALLY_PROTECTED,
} from "@wildboar/x500/EnhancedSecurity";
import type {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/DistributedOperations";
import {
    ReferenceType_nonSpecificSubordinate,
} from "@wildboar/x500/DistributedOperations";
import { printInvokeId } from "../utils/printInvokeId.js";
import { compareAuthenticationLevel } from "@wildboar/x500";
import { OperationOutcome, RejectReason, AbortReason } from "@wildboar/rose-transport";
import stringifyDN from "../x500/stringifyDN.js";
import printCode from "../utils/printCode.js";

/**
 * These are rejection reasons that may reflect some transient or circumstantial
 * state of the correspondent DSA, rather than a problem with the request
 * itself.
 */
const RECOVERABLE_REJECT_REASONS: RejectReason[] = [
    // The other DSA just might not support this operation.
    RejectReason.unsupported_operation_request,
    // The other DSA just might be old and not recognize this operation.
    RejectReason.unknown_operation_request,
    // The other DSA just might be overwhelmed with other requests.
    RejectReason.resource_limitation_request,
];

/**
 * These are abort reasons that may reflect some transient or circumstantial
 * state of the correspondent DSA, rather than a problem with the request
 * itself.
 */
const RECOVERABLE_ABORT_REASONS: AbortReason[] = [
    // The other DSA just might be overwhelmed.
    AbortReason.resource_limitation,
    // The other DSA might have had some internal problem. The operation probably did not even begin.
    AbortReason.connection_failed,
    // The other DSA did not recognize our protocol. Is it even a DSA at all?
    AbortReason.invalid_protocol,
];

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
    localScope: boolean = false,
): Promise<OperationOutcome<OPCR>> {
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
    // TODO: Can you assert that every CR has OP not set to completed?
    assert(state.chainingArguments.operationProgress?.nameResolutionPhase !== OperationProgress_nameResolutionPhase_completed, "7d3c9dbc-41e1-4cde-a634-ff6d2d82e8f0");
    assert(state.NRcontinuationList.length, "b5df97a7-f855-4ce5-b40b-38bb78fa8247"); // This procedure should not be called if there are no refs.
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
    // B - A gives you descending sort.
    // We sort by rdnsResolved to get the "deepest" reference.
    // This means that, if you have a chain of two cross reference DSEs, the deepest one will be used.
    state.NRcontinuationList.sort((a, b) => Number(b.rdnsResolved ?? 0) - Number(a.rdnsResolved ?? 0));
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
            ctx.log.debug(ctx.i18n.t("log:continuing_name_resolution", {
                opid: req.chaining.operationIdentifier ?? "ABSENT",
                dn: stringifyDN(ctx, cref.targetObject.rdnSequence),
            }));
            const outcome = await apinfoProcedure(
                ctx,
                cref.accessPoints[0],
                req,
                assn,
                state,
                signErrors,
                chainingProhibited,
                cref,
                timeLimitEndTime,
            );
            if (!outcome) {
                // This can happen if chaining is prohibited or if all access points fail.
                continue;
            }
            else if ("result" in outcome) {
                ctx.log.debug(ctx.i18n.t("log:nrcr_result", {
                    opid: req.chaining.operationIdentifier ?? "ABSENT",
                }));
                return {
                    result: {
                        ...outcome.result,
                        parameter: chainedRead.decoderFor["&ResultType"]!(outcome.result.parameter),
                    },
                };
            }
            else if ("error" in outcome) {
                ctx.log.debug(ctx.i18n.t("log:nrcr_error", {
                    opid: req.chaining.operationIdentifier ?? "ABSENT",
                    code: printCode(outcome.error.code),
                    bytes: Buffer.from(outcome.error.parameter.toBytes()).subarray(0, 16).toString("hex"),
                }));
                return outcome;
            }
            else if ("reject" in outcome) {
                ctx.log.debug(ctx.i18n.t("log:nrcr_reject", {
                    opid: req.chaining.operationIdentifier ?? "ABSENT",
                    reason: outcome.reject.problem,
                }));
                return outcome;
            }
            else if ("abort" in outcome) {
                ctx.log.debug(ctx.i18n.t("log:nrcr_abort", {
                    opid: req.chaining.operationIdentifier ?? "ABSENT",
                    reason: outcome.abort,
                }));
                return outcome;
            }
            else if ("timeout" in outcome) {
                ctx.log.debug(ctx.i18n.t("log:nrcr_timeout", {
                    opid: req.chaining.operationIdentifier ?? "ABSENT",
                }));
                return outcome;
            }
        }
        ctx.log.debug(ctx.i18n.t("log:continuing_name_resolution", {
            context: "nssr",
            opid: req.chaining.operationIdentifier ?? "ABSENT",
            dn: stringifyDN(ctx, cref.targetObject.rdnSequence),
            i: cref.operationProgress?.nextRDNToBeResolved?.toString(),
        }));
        let allUnableToProceed: boolean = true;
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
                    cref,
                    timeLimitEndTime,
                    localScope,
                );
            } catch (e) {
                ctx.log.debug(ctx.i18n.t("log:ap_info_procedure_error", { e }));
                continue;
            }
            if (!outcome) {
                // TODO: Log this? I don't think you have to do anything beyond this.
                continue;
            }
            if ("result" in outcome) {
                allUnableToProceed = false;
                try {
                    return {
                        result: {
                            ...outcome.result,
                            parameter: chainedRead.decoderFor["&ResultType"]!(outcome.result.parameter),
                        },
                    };
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
            }
            else if ("error" in outcome) {
                ctx.log.debug(ctx.i18n.t("log:nrcr_error", {
                    opid: req.chaining.operationIdentifier ?? "ABSENT",
                    code: printCode(outcome.error.code),
                    bytes: Buffer.from(outcome.error.parameter.toBytes()).subarray(0, 16).toString("hex"),
                }));
                if (compareCode(outcome.error.code, serviceError["&errorCode"]!)) {
                    let errorParam: OPTIONALLY_PROTECTED<ServiceErrorData> | null = null;
                    try {
                        errorParam = serviceError.decoderFor["&ParameterType"]!(outcome.error.parameter);
                    } catch {
                        continue;
                    }
                    const errorData = getOptionallyProtectedValue(errorParam);
                    // Step 7, bullet point 1
                    if (errorData.problem === ServiceProblem_unableToProceed) {
                        // allUnableToProceed = false;
                        continue;
                    }
                    allUnableToProceed = false;
                    if ( // Step 7, bullet point 2
                        (errorData.problem === ServiceProblem_busy)
                        || (errorData.problem === ServiceProblem_unavailable)
                        || (errorData.problem === ServiceProblem_unwillingToPerform)
                    ) {
                        continue;
                    } else if (errorData.problem === ServiceProblem_invalidReference) {
                        // Step 7, bullet point 3
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
                        return outcome;
                    }
                } else { // Step 7, bullet point 3
                    /* This will return the referral to the operation
                    dispatcher, if it is one, per bullet point 4. */
                    throw new errors.ChainedError(
                        ctx.i18n.t("err:chained_error"),
                        outcome.error.parameter,
                        outcome.error.code,
                        signErrors,
                    );
                }
            }
            else if ("reject" in outcome) {
                ctx.log.debug(ctx.i18n.t("log:nrcr_reject", {
                    opid: req.chaining.operationIdentifier ?? "ABSENT",
                    reason: outcome.reject.problem,
                }));
                allUnableToProceed = false;
                /* What to do here is unspecified, but for some reject outcomes,
                we can just carry on. */
                if (RECOVERABLE_REJECT_REASONS.includes(outcome.reject.problem)) {
                    continue;
                }
                continue;
            }
            else if ("abort" in outcome) {
                ctx.log.debug(ctx.i18n.t("log:nrcr_abort", {
                    opid: req.chaining.operationIdentifier ?? "ABSENT",
                    reason: outcome.abort,
                }));
                allUnableToProceed = false;
                /* What to do here is unspecified, but for some abort outcomes,
                we can just carry on. */
                if (RECOVERABLE_ABORT_REASONS.includes(outcome.abort)) {
                    continue;
                }
                continue;
            }
            else if ("timeout" in outcome) {
                ctx.log.debug(ctx.i18n.t("log:nrcr_timeout", {
                    opid: req.chaining.operationIdentifier ?? "ABSENT",
                }));
                allUnableToProceed = false;
                continue;
            }
            else {
                allUnableToProceed = false;
            }
        } // End of NSSR access point loop.

        if (allUnableToProceed) {
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
                return {
                    result: {
                        code: req.opCode,
                        invoke_id: req.invokeId,
                        parameter: localResult.result,
                    },
                };
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
