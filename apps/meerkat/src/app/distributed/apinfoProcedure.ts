import type { ClientAssociation, Vertex } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx.js";
import { BOOLEAN } from "@wildboar/asn1";
import { AccessPointInformation } from "@wildboar/x500/DistributedOperations";
import { ChainingArguments } from "@wildboar/x500/DistributedOperations";
import type {
    Code,
} from "@wildboar/x500/CommonProtocolSpecification";
import {
    chainedAbandon,
} from "@wildboar/x500/DistributedOperations";
import {
    referral,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    serviceError,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceProblem_busy,
    ServiceProblem_unavailable,
    ServiceProblem_unwillingToPerform,
    ServiceProblem_invalidReference,
    ServiceProblem_loopDetected,
    ServiceProblem_timeLimitExceeded,
} from "@wildboar/x500/DirectoryAbstractService";
import { compareCode } from "@wildboar/x500";
import type { ChainedRequest } from "@wildboar/x500";
import type { Chained } from "@wildboar/x500";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/DistributedOperations";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1,
    ChainingResults,
    _encode_Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/DistributedOperations";
import { chainedRead } from "@wildboar/x500/DistributedOperations";
import { DER } from "@wildboar/asn1/functional";
import {
    MasterOrShadowAccessPoint,
} from "@wildboar/x500/DistributedOperations";
import {
    MasterOrShadowAccessPoint_category_shadow,
} from "@wildboar/x500/DistributedOperations";
import { isModificationOperation } from "@wildboar/x500";
import {
    OperationProgress_nameResolutionPhase_proceeding as proceeding,
} from "@wildboar/x500/DistributedOperations";
import {
    ReferenceType_cross,
    ReferenceType_immediateSuperior,
    ReferenceType_nonSpecificSubordinate,
    ReferenceType_subordinate,
    ReferenceType_superior,
    ReferenceType_nonSpecificSubordinate as nssr,
} from "@wildboar/x500/DistributedOperations";
import cloneChainingArguments from "../x500/cloneChainingArguments";
import {
    TraceItem,
} from "@wildboar/x500/DistributedOperations";
import {
    ServiceErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import { loopDetected } from "@wildboar/x500";
import createSecurityParameters from "../x500/createSecurityParameters";
import type { OperationDispatcherState } from "./OperationDispatcher";
import {
    AbandonedData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    abandoned,
} from "@wildboar/x500/DirectoryAbstractService";
import { printInvokeId } from "../utils/printInvokeId";
import { signChainedArgument } from "../pki/signChainedArgument";
import { strict as assert } from "assert";
import { verifySIGNED } from "../pki/verifySIGNED";
import stringifyDN from "../x500/stringifyDN";
import { bindForChaining } from "../net/bindToOtherDSA";
import { OperationOutcome } from "@wildboar/rose-transport";
import generateUnusedInvokeID from "../net/generateUnusedInvokeID";
import { ContinuationReference } from "@wildboar/x500/DistributedOperations";
import { addMilliseconds, differenceInMilliseconds, differenceInSeconds } from "date-fns";
import { upsertCrossReferences } from "../dit/upsertCrossReferences";
import { Promise as bPromise } from "bluebird";
import isPrefix from "../x500/isPrefix";
import { compareDistinguishedName, getDateFromTime } from "@wildboar/x500";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { CrossReference } from "@wildboar/x500/DistributedOperations";
import { signChainedResult } from "../pki/signChainedResult";
import deleteEntry from "../database/deleteEntry";
import DAPAssociation from "../dap/DAPConnection";

/**
 * @summary The Access Point Information Procedure, as defined in ITU Recommendation X.518.
 * @description
 *
 * The Access Point Information (APInfo) Procedure, as defined in ITU
 * Recommendation X.518 (2016), Section 20.4.4.
 *
 * @param ctx The context object
 * @param api The access point information
 * @param req The chained request
 * @param assn The client association
 * @param state The operation dispatcher state
 * @param signErrors Whether to cryptographically sign errors
 * @param chainingProhibited Whether chaining was prohibited
 * @param cref The continuation reference
 * @returns An operation outcome, or null if chaining is prohibited.
 *
 * @function
 * @async
 */
export
async function apinfoProcedure (
    ctx: MeerkatContext,
    api: AccessPointInformation,
    req: ChainedRequest,
    assn: ClientAssociation | undefined,
    state: OperationDispatcherState,
    signErrors: boolean,
    chainingProhibited: boolean,
    cref: ContinuationReference,
    deadline?: Date,
): Promise<OperationOutcome | null> {
    const op = ("present" in state.invokeId)
        ? assn?.invocations.get(Number(state.invokeId.present))
        : undefined;
    if (chainingProhibited) {
        return null;
    }
    const namingMatcher = getNamingMatcherGetter(ctx);
    const excludeShadows: BOOLEAN = req.chaining.excludeShadows ?? ChainingArguments._default_value_for_excludeShadows;
    const nameResolveOnMaster: BOOLEAN = req.chaining.nameResolveOnMaster
        ?? ChainingArguments._default_value_for_nameResolveOnMaster;
    const nameResolutionIsProceeding: boolean = (req.chaining.operationProgress?.nameResolutionPhase === proceeding);
    const i_want_cross_refs: boolean = (
        ctx.config.xr.requestCrossReferences
        /* supr, immSupr, subr, and nssr are the only reference types for which
        it makes sense, but cross is added to constantly refresh the access
        point info of the cross reference. */
        && (
            (cref.referenceType === ReferenceType_superior)
            || (cref.referenceType === ReferenceType_immediateSuperior)
            || (cref.referenceType === ReferenceType_cross)
            || (cref.referenceType === ReferenceType_subordinate)
            || (cref.referenceType === ReferenceType_nonSpecificSubordinate)
        )
    );

    const chainingArgs: ChainingArguments = cloneChainingArguments(req.chaining, {
        nameResolveOnMaster: (
            (nameResolutionIsProceeding && nameResolveOnMaster)
            || (isModificationOperation(req.opCode) && (req.chaining.referenceType === nssr))
        ),
        referenceType: cref.referenceType,
        operationProgress: cref.operationProgress,
        securityParameters: createSecurityParameters(
            ctx,
            ctx.config.chaining.signChainedRequests,
            api.ae_title.rdnSequence,
            req.opCode,
            undefined,
            true,
        ),
        returnCrossRefs: (req.chaining.returnCrossRefs || i_want_cross_refs)
    });
    const accessPoints: MasterOrShadowAccessPoint[] = [
        new MasterOrShadowAccessPoint(
            api.ae_title,
            api.address,
            api.protocolInformation,
            undefined,
            undefined,
        ),
        ...api.additionalPoints ?? [],
    ];
    const startTime = new Date();
    const timeoutTime: Date = deadline ?? addMilliseconds(startTime, 60_000);
    let timeRemaining: number = 0;
    const checkTimeLimit = () => {
        if (new Date() < timeoutTime) {
            return;
        }
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
    };
    for (const ap of accessPoints) {
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
        checkTimeLimit();
        const tenativeTrace: TraceItem[] = [
            ...req.chaining.traceInformation,
            new TraceItem(
                {
                    rdnSequence: ap.ae_title.rdnSequence,
                },
                req.chaining.targetObject
                    ? {
                        rdnSequence: req.chaining.targetObject,
                    }
                    : undefined,
                req.chaining.operationProgress ?? ChainingArguments._default_value_for_operationProgress,
            ),
        ];
        if (loopDetected(tenativeTrace)) {
            throw new errors.ServiceError(
                ctx.i18n.t("err:loop_detected"),
                new ServiceErrorData(
                    ServiceProblem_loopDetected,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        undefined,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    req.chaining.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        // TODO: Check if localScope.
        if (
            (ap.category === MasterOrShadowAccessPoint_category_shadow)
            && (
                excludeShadows
                || (nameResolutionIsProceeding && nameResolveOnMaster)
                || isModificationOperation(req.opCode) // If mod operation, we can only use the master.
            )
        ) {
            continue;
        }
        timeRemaining = Math.abs(differenceInMilliseconds(new Date(), timeoutTime));
        let connected: boolean = false;
        try {
            const dsp_client = await bindForChaining(ctx, assn, op, ap, false, signErrors, timeRemaining);
            if (!dsp_client) {
                // If there is a network failure, delete the cross reference. That happens here.
                if ((cref.referenceType === ReferenceType_cross) && state.crossReferenceVertex) {
                    const to_delete: Vertex[] = [ state.crossReferenceVertex ];
                    let current: Vertex | undefined = state.crossReferenceVertex.immediateSuperior;
                    while (current && current.dse.glue) {
                        to_delete.push(current);
                        current = current.immediateSuperior;
                    }
                    Promise.all(to_delete.map((v) => deleteEntry(ctx, v))); // INTENTIONAL_NO_AWAIT
                    // REGRET: I wish I had some extended continuation reference type that also adds the DSE ID.
                }
                ctx.log.warn(ctx.i18n.t("log:could_not_establish_connection", {
                    ae: stringifyDN(ctx, ap.ae_title.rdnSequence),
                    iid: "present" in req.invokeId
                        ? req.invokeId.present.toString()
                        : "ABSENT",
                }));
                continue;
            }
            connected = true;
            const argument: Chained = {
                unsigned: new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                    chainingArgs,
                    req.argument!,
                ),
            };
            const payload: Chained = ctx.config.chaining.signChainedRequests
                ? signChainedArgument(ctx, argument)
                : argument;
            timeRemaining = Math.abs(differenceInMilliseconds(new Date(), timeoutTime));
            const response = await dsp_client.rose.request({
                invoke_id: {
                    present: generateUnusedInvokeID(ctx),
                },
                code: req.opCode,
                parameter: chainedRead.encoderFor["&ArgumentType"]!(payload, DER),
                timeout: timeRemaining,
            });
            // We intentionally do not unbind so that this connection can be re-used.
            // dsp_client.unbind().then().catch();
            // if (dsp_client.rose.socket?.writable) {
            //     dsp_client.rose.socket?.end(); // Unbind does not necessarily close the socket.
            // }

            if ("result" in response) {
                assert(chainedAbandon["&operationCode"]);
                assert("local" in chainedAbandon["&operationCode"]);
                const decoded = chainedRead.decoderFor["&ResultType"]!(response.result.parameter);
                const resultData = getOptionallyProtectedValue(decoded);
                /* The directory specifications do not seem to say what to do if
                a DSP signature is invalid. If they are invalid, Meerkat DSA
                will log the problem, */
                let dsp_signature_valid: boolean = true;
                let acceptableCrossReferences: CrossReference[] = [];
                if (
                    ctx.config.chaining.checkSignaturesOnResponses
                    && ("local" in response.result.code)
                    && (response.result.code.local !== chainedAbandon["&operationCode"]!.local)
                ) {
                    if (resultData.chainedResult.securityParameters?.errorCode) {
                        ctx.log.warn(ctx.i18n.t("log:dsp_result_error_code"), {
                            opid: chainingArgs.operationIdentifier ?? "ABSENT",
                        });
                        dsp_signature_valid = false;
                    }
                    if (dsp_signature_valid && resultData.chainedResult.securityParameters?.time) {
                        const secureTime = getDateFromTime(resultData.chainedResult.securityParameters.time);
                        const now = new Date();
                        if (now > secureTime) {
                            ctx.log.warn(ctx.i18n.t("log:dsp_result_time"), {
                                opid: chainingArgs.operationIdentifier ?? "ABSENT",
                            });
                            dsp_signature_valid = false;
                        }
                    }
                    if (
                        dsp_signature_valid
                        && resultData.chainedResult.securityParameters?.name
                        && (ctx.dsa.accessPoint.ae_title.rdnSequence.length > 0)
                        && !compareDistinguishedName(
                            resultData.chainedResult.securityParameters.name,
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            namingMatcher,
                        )
                    ) {
                        ctx.log.warn(ctx.i18n.t("log:dsp_result_name"), {
                            opid: chainingArgs.operationIdentifier ?? "ABSENT",
                        });
                        dsp_signature_valid = false;
                    }
                    if (
                        dsp_signature_valid
                        && resultData.chainedResult.securityParameters?.operationCode
                        && !compareCode(resultData.chainedResult.securityParameters.operationCode, req.opCode)
                    ) {
                        ctx.log.warn(ctx.i18n.t("log:dsp_result_op_code"), {
                            opid: chainingArgs.operationIdentifier ?? "ABSENT",
                        });
                        dsp_signature_valid = false;
                    }
                    if (dsp_signature_valid && ("signed" in decoded)) {
                        const certPath = resultData.chainedResult.securityParameters?.certification_path;
                        try {
                            await verifySIGNED(
                                ctx,
                                assn,
                                certPath,
                                state.invokeId,
                                state.chainingArguments.aliasDereferenced,
                                decoded.signed,
                                _encode_Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1,
                                signErrors,
                                "result",
                            );
                        } catch (e) {
                            dsp_signature_valid = false;
                            ctx.log.warn(ctx.i18n.t("log:dsp_result_invalid_sig"), {
                                opid: chainingArgs.operationIdentifier ?? "ABSENT",
                                e,
                            });
                        }
                    }
                    const returned_cross_refs = resultData.chainedResult.crossReferences ?? [];
                    // TODO: Validate access points, but this is much lower priority.
                    /* We filter out any cross references that do not lie on the
                    target object's path. This is for security purposes: we do
                    not want other DSAs to be able to construct an entirely
                    fraudulent DIT in our local DSAIT.

                    We also filter out any cross references whose context prefix
                    is superior or equal to any context prefix operated by this
                    DSA, because it could be an attempt by the downstream DSA to
                    hijack the superior naming contexts. This could also happen
                    if alias dereferencing results in a downstream DSA returning
                    cross references from a totally different targetObject. */
                    acceptableCrossReferences = dsp_signature_valid
                        ? returned_cross_refs.filter((xr) => (
                                isPrefix(ctx, xr.contextPrefix, cref.targetObject.rdnSequence)
                                && !ctx.dsa.namingContexts
                                    .some((nc) => (nc.length > 0) && isPrefix(ctx, xr.contextPrefix, nc))
                            ))
                        : [];

                    if (returned_cross_refs.length !== acceptableCrossReferences.length) {
                        ctx.log.warn(ctx.i18n.t("log:filtered_cross_refs", {
                            count: acceptableCrossReferences.length - returned_cross_refs.length,
                            opid: chainingArgs.operationIdentifier ?? "ABSENT",
                        }));
                    }

                    if (
                        i_want_cross_refs
                        && acceptableCrossReferences.length
                        && dsp_signature_valid
                        && (
                            !ctx.config.xr.signingRequiredToTrust
                            || ("signed" in decoded)
                        )
                    ) {
                        // TODO: Index recently added cross references so we're not doing this for every result.
                        bPromise.map(
                            acceptableCrossReferences,
                            (xr) => upsertCrossReferences(ctx, xr),
                            { concurrency: 5 },
                        ) // INTENTIONAL_NO_AWAIT
                        .catch((e) => {
                            ctx.log.warn(ctx.i18n.t("log:failed_to_apply_xr", {
                                opid: chainingArgs.operationIdentifier ?? "ABSENT",
                                e,
                            }));
                        });
                    }
                    // Even if the received signature is invalid, we can apply
                    // our own cross references.
                    acceptableCrossReferences.push(...state.chainingResults.crossReferences ?? []);

                    /* Here is what my research gave me: the directory specs do
                    not seem to say anything on this explicitly. Re-signing
                    would allow trust to be transitive, possibly reducing the
                    total number of keys needed, and it would also provide
                    point-to-point integrity where TLS is not available. The
                    inner response is already signed by the performing DSA, so
                    there's no point in verifying a signature that will be
                    verified later anyway.

                    OTOH, I followed the directions of
                    X.518, and the chaining arguments may still have important
                    information. ~~When I think about it, it actually makes sense
                    for the performing DSA to produce all cross refs. It might
                    have the whole chain up to the root.~~ Nevermind, this is
                    not the correct procedure; each DSA is supposed to contribute.

                    /*
                    Quote:
                    A CrossReference may be added by a DSA when it matches part of the targetObject argument of
                    an operation with one of its context prefixes. The administrative authority of a DSA may have a policy not
                    to return such knowledge, and will, in this case, not add an item to the sequence.

                    This makes it clear that it cannot just be the performing DSA providing cross refs.
                    This also entails that intermediate DSAs need to redact falsehoods.
                    I think I have established that it is okay for an intermediate DSA to resign the DSP result.
                    However, security parameters has a 'name' field, which I think necessitates re-signing.
                    It is more security-paranoid to sign and re-sign, so it might be for the better.
                    If the signature is invalid, return unavailable error or something like that.
                    */
                }
                const chaining_results_unchanged: boolean = !!(
                    !state.chainingResults.crossReferences?.length // If we have cross-refs to add, we need to re-sign.
                    && dsp_signature_valid // If the signature is invalid, we re-sign.
                    && ("signed" in decoded) // If the DSP result was unsigned, we sign it.
                    && !resultData.chainedResult.securityParameters?.name // If the name is present, we need to re-sign.
                    && !resultData.chainedResult.securityParameters?.time // If the time is present, we need to re-sign.
                );
                if (chaining_results_unchanged) {
                    // Under these circumstances, we can just return the chained result completely unchanged.
                    return response;
                }
                const newResultData = {
                    unsigned: new Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1(
                        new ChainingResults(
                            dsp_signature_valid ? resultData.chainedResult.info : undefined,
                            acceptableCrossReferences.length ? acceptableCrossReferences : undefined,
                            createSecurityParameters(
                                ctx,
                                true,
                                assn?.boundNameAndUID?.dn,
                                req.opCode,
                            ),
                            resultData.chainedResult.alreadySearched,
                        ),
                        resultData.result,
                    ),
                };
                if (assn && (assn instanceof DAPAssociation)) {
                    // If there is no prior DSA, there is no point in signing
                    // the DSP result, since it will be immediately discarded.
                    return {
                        result: {
                            code: req.opCode,
                            invoke_id: req.invokeId,
                            parameter: chainedRead.encoderFor["&ResultType"]!(newResultData, DER),
                        },
                    };
                }
                const newResult = signChainedResult(ctx, newResultData);
                return {
                    result: {
                        code: req.opCode,
                        invoke_id: req.invokeId,
                        parameter: chainedRead.encoderFor["&ResultType"]!(newResult, DER),
                    },
                };
            }
            else if ("error" in response) {
                const errcode: Code = response.error.code ?? { local: -1 };
                if (compareCode(errcode, referral["&errorCode"]!)) {
                    /**
                     * Effectively, this means that the local policy is to
                     * always return the referral. I prefer to take this
                     * approach, because using the referral means that the
                     * next step is to empty the NRContinuationList. This is
                     * problematic, because the NRContinuationList is used
                     * by the function that calls this APInfo procedure in
                     * a loop! This sounds like a great way to introduce
                     * impossible-to-diagnose bugs.
                     *
                     * This also means we do not need to pass in the CR, which
                     * has the returnToDUA setting.
                     */
                    return response;
                } else if (compareCode(errcode, serviceError["&errorCode"]!)) {
                    const param = serviceError.decoderFor["&ParameterType"]!(response.error.parameter);
                    const errorData = getOptionallyProtectedValue(param);
                    if (
                        (errorData.problem === ServiceProblem_busy)
                        || (errorData.problem === ServiceProblem_unavailable)
                        || (errorData.problem === ServiceProblem_unwillingToPerform)
                        || (errorData.problem === ServiceProblem_invalidReference)
                    ) {
                        continue; // Always try another.
                    } else {
                        return response;
                    }
                } else {
                    return response;
                }
            }
            else if ("reject" in response) {
                // If it is a mod operation, we do not attempt again,
                // because we do not want to duplicate operations.
                if (isModificationOperation(req.opCode)) {
                    return response;
                }
                continue; // Always try another.
            }
            else if ("abort" in response) {
                // If it is a mod operation, we do not attempt again,
                // because we do not want to duplicate operations.
                if (isModificationOperation(req.opCode)) {
                    return response;
                }
                continue; // Always try another.
            }
            else if ("timeout" in response) {
                // If it is a mod operation, we do not attempt again,
                // because we do not want to duplicate operations.
                if (isModificationOperation(req.opCode)) {
                    return response;
                }
                continue; // Always try another.
            }
        } catch (e) {
            if (!connected) {
                ctx.log.warn(ctx.i18n.t("log:could_not_establish_connection", {
                    context: "with_error",
                    ae: stringifyDN(ctx, ap.ae_title.rdnSequence),
                    iid: "present" in req.invokeId
                        ? req.invokeId.present.toString()
                        : "ABSENT",
                    e,
                }));
            } else {
                ctx.log.warn(ctx.i18n.t("log:could_not_write_operation_to_dsa", {
                    ae: stringifyDN(ctx, api.ae_title.rdnSequence),
                    e,
                }), {
                    remoteFamily: assn?.socket.remoteFamily,
                    remoteAddress: assn?.socket.remoteAddress,
                    remotePort: assn?.socket.remotePort,
                    association_id: assn?.id,
                    invokeID: printInvokeId(state.invokeId),
                });
            }
            continue;
        }
    }
    return null;
}
