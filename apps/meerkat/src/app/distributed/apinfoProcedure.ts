import type { ClientAssociation, Vertex, Context } from "../types/index.js";
import * as errors from "../types/index.js";
import type { MeerkatContext } from "../ctx.js";
import { BOOLEAN } from "@wildboar/asn1";
import type {
    Code,
} from "@wildboar/x500/CommonProtocolSpecification";
import {
    serviceError,
    ServiceProblem_busy,
    ServiceProblem_unavailable,
    ServiceProblem_unwillingToPerform,
    ServiceProblem_invalidReference,
    ServiceProblem_loopDetected,
    ServiceProblem_timeLimitExceeded,
    ServiceErrorData,
    AbandonedData,
    abandoned,
    list,
    search,
    _encode_ReferralData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    isModificationOperation,
    compareCode,
    uriFromNSAP,
    getOptionallyProtectedValue,
    type ChainedRequest,
    type Chained,
} from "@wildboar/x500";
import { DER } from "@wildboar/asn1/functional";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1,
    ChainingResults,
    _encode_Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1,
    chainedAbandon,
    chainedRead,
    MasterOrShadowAccessPoint,
    MasterOrShadowAccessPoint_category_shadow,
    OperationProgress_nameResolutionPhase_proceeding as proceeding,
    OperationProgress_nameResolutionPhase_completed as completed,
    ReferenceType_cross,
    ReferenceType_immediateSuperior,
    ReferenceType_nonSpecificSubordinate,
    ReferenceType_subordinate,
    ReferenceType_superior,
    ReferenceType_nonSpecificSubordinate as nssr,
    TraceItem,
    CrossReference,
    type ContinuationReference,
    AccessPointInformation,
    ChainingArguments,
    dsaReferral,
    DsaReferralData,
    _encode_DsaReferralData,
} from "@wildboar/x500/DistributedOperations";
import cloneChainingArguments from "../x500/cloneChainingArguments.js";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import type { OperationDispatcherState } from "./OperationDispatcher.js";
import { printInvokeId } from "../utils/printInvokeId.js";
import { signChainedArgument } from "../pki/signChainedArgument.js";
import { strict as assert } from "node:assert";
import { verifySIGNED } from "../pki/verifySIGNED.js";
import stringifyDN from "../x500/stringifyDN.js";
import { bindForChaining } from "../net/bindToOtherDSA.js";
import { OperationOutcome } from "@wildboar/rose-transport";
import generateUnusedInvokeID from "../net/generateUnusedInvokeID.js";
import { addMilliseconds, differenceInMilliseconds } from "date-fns";
import { upsertCrossReferences } from "../dit/upsertCrossReferences.js";
import { map } from "@tyler/duckhawk";
import isPrefix from "../x500/isPrefix.js";
import { compareDistinguishedName, getDateFromTime } from "@wildboar/x500";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter.js";
import { signChainedResult } from "../pki/signChainedResult.js";
import deleteEntry from "../database/deleteEntry.js";
import DAPAssociation from "../dap/DAPConnection.js";
import isLocalScope from "../x500/isLocalScope.js";
import printCode from "../utils/printCode.js";
import util from "node:util";
import nrcrProcedure from "./nrcrProcedure.js";
import { OPTIONALLY_PROTECTED } from "@wildboar/x500/EnhancedSecurity";
import {
    VCP_RETURN_CRL_UNREACHABLE,
    VCP_RETURN_OCSP_OTHER,
    VCP_RETURN_PROHIBITED_SIG_ALG,
    VCP_RETURN_UNTRUSTED_ANCHOR,
    type VCPReturnCode,
} from "../pki/verifyCertPath.js";
import { isLoopDetected } from "./isLoopDetected.js";

/* These are all the cert path validation error types where they could be
invalid on this DSA, but not to the client verifying the cert path.
In these cases, we are going to return the referral to the DUA, because its
signature might be valid to it. */
const HOST_DEPENDENT_CERT_PATH_ERRORS: VCPReturnCode[] = [
    VCP_RETURN_UNTRUSTED_ANCHOR,
    VCP_RETURN_PROHIBITED_SIG_ALG,
    VCP_RETURN_OCSP_OTHER,
    VCP_RETURN_CRL_UNREACHABLE,
];

function isAcceptableAccessPoint (ap: AccessPointInformation): boolean {
    const psel = ap.address.pSelector;
    const ssel = ap.address.sSelector;
    const tsel = ap.address.tSelector;
    const naddrs = ap.address.nAddresses;
    if (psel && (!ssel || !tsel)) {
        return false;
    }
    if (ssel && !tsel) {
        return false;
    }
    /* We only validate the URL-formatted network addresses. This is meant to
    be "quick and dirty" validation. */
    const has_invalid_naddr = naddrs
        .some((naddr) => (
            naddr.length < 3
            || naddr[0] == 0xFF && URL.parse(uriFromNSAP(naddr)[1])
        ));
    const has_too_many_naddrs = naddrs.length > 10;
    const has_empty_dn = ap.ae_title.rdnSequence.length === 0;
    const has_empty_rdn = ap.ae_title.rdnSequence.some((rdn) => rdn.length === 0);
    return (
        !has_invalid_naddr
        && !has_empty_dn
        && !has_empty_rdn
        && !has_too_many_naddrs
        && naddrs.length > 0
    );
}

function isAcceptableCrossReference (
    ctx: Context,
    cref: ContinuationReference,
    xr: CrossReference,
): boolean {
    return (
        isPrefix(ctx, xr.contextPrefix, cref.targetObject.rdnSequence)
        && !ctx.dsa.namingContexts
            .some((nc) => (nc.length > 0) && isPrefix(ctx, xr.contextPrefix, nc))
        && isAcceptableAccessPoint(xr.accessPoint)
    );
}

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
 * @param deadline The deadline for the APInfo procedure to return
 * @param localScope Whether to restrict chaining to a local scope
 * @param partialNameResolution Whether to use partial name resolution
 * @param followReferralTTL The number of times this procedure may recurse
 *  as a result of following a referral. Needed because this calls NRCR
 *  procedure, which can call this again.
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
    deadline: Date,
    localScope: boolean,
    partialNameResolution: boolean,
    followReferralTTL: number,
): Promise<OperationOutcome | null> {
    const op = ("present" in state.invokeId)
        ? assn?.invocations.get(Number(state.invokeId.present))
        : undefined;
    if (chainingProhibited) {
        return null;
    }
    const logInfo = {
        clientFamily: assn?.socket.remoteFamily,
        clientAddress: assn?.socket.remoteAddress,
        clientPort: assn?.socket.remotePort,
        association_id: assn?.id,
        opid: req.chaining.operationIdentifier,
        iid: printInvokeId(req.invokeId),
        opcode: printCode(req.opCode),
        signErrors,
        chainingProhibited,
        deadline,
        localScope,
    };
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
    const isSearchOrList: boolean = (
        compareCode(req.opCode, list["&operationCode"]!)
        || compareCode(req.opCode, search["&operationCode"]!)
    );
    const isNameResolved: boolean = cref.operationProgress.nameResolutionPhase === completed;
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
        const isInStatefulSet: boolean = ctx
            .config
            .shadowing
            .replicateEverythingFrom
            ?.protocol
            .toLowerCase()
            .startsWith("statefulset+") ?? false;
        const nextHopIsMe: boolean = compareDistinguishedName(
            ap.ae_title.rdnSequence,
            ctx.dsa.accessPoint.ae_title.rdnSequence,
            namingMatcher,
        );
        const ignoreLoopCheck: boolean = (isInStatefulSet && nextHopIsMe);
        if (!ignoreLoopCheck && isLoopDetected(ctx, tenativeTrace)) {
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
        if (localScope) {
            /* This is chosen to be "local" relative to the current DSA, rather
            than the requester / originator. The rationale for this is that the
            requester has already sent this request to this DSA, so the
            presumption is that the requester is accepts data transfer to and
            from this DSA's country. It also makes the DSA more "deterministic"
            from the perspective of the user: two users will get treated the
            same by this DSA, even if they are from two different countries. */
            if (!isLocalScope(ctx, ctx.dsa.accessPoint.ae_title, ap.ae_title)) {
                ctx.log.trace(ctx.i18n.t("log:not_chaining_out_of_local_scope", {
                    opid: req.chaining.operationIdentifier,
                    aet: stringifyDN(ctx, ap.ae_title.rdnSequence),
                }), logInfo);
                continue;
            }
            // TODO: if configured, perform IP lookup to ascertain no further propagation.
            // Using country.is seems viable.
            // But ChatGPT recommends just using the MaxMind DB
            // There's a good package for it: https://jsr.io/@josh-hemphill/maxminddb-wasm
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
                }), logInfo);
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

            // Step 8.a.
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
                        ctx.log.warn(ctx.i18n.t("log:dsp_result_error_code", logInfo), logInfo);
                        dsp_signature_valid = false;
                    }
                    if (dsp_signature_valid && resultData.chainedResult.securityParameters?.time) {
                        const secureTime = getDateFromTime(resultData.chainedResult.securityParameters.time);
                        const now = new Date();
                        if (now > secureTime) {
                            ctx.log.warn(ctx.i18n.t("log:dsp_result_time", logInfo), logInfo);
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
                        ctx.log.warn(ctx.i18n.t("log:dsp_result_name", logInfo), logInfo);
                        dsp_signature_valid = false;
                    }
                    if (
                        dsp_signature_valid
                        && resultData.chainedResult.securityParameters?.operationCode
                        && !compareCode(resultData.chainedResult.securityParameters.operationCode, req.opCode)
                    ) {
                        ctx.log.warn(ctx.i18n.t("log:dsp_result_op_code", logInfo), logInfo);
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
                            if (process.env.MEERKAT_LOG_JSON !== "1") {
                                ctx.log.error(util.inspect(e));
                            }
                            dsp_signature_valid = false;
                            ctx.log.warn(ctx.i18n.t("log:dsp_result_invalid_sig", {
                                ...logInfo,
                                e,
                            }), logInfo);
                        }
                    }
                    const returned_cross_refs = resultData.chainedResult.crossReferences ?? [];
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
                        ? returned_cross_refs.filter((xr) => isAcceptableCrossReference(ctx, cref, xr))
                        : [];

                    if (returned_cross_refs.length !== acceptableCrossReferences.length) {
                        ctx.log.warn(ctx.i18n.t("log:filtered_cross_refs", {
                            ...logInfo,
                            count: acceptableCrossReferences.length - returned_cross_refs.length,
                        }), logInfo);
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
                        map(
                            acceptableCrossReferences,
                            (xr) => upsertCrossReferences(ctx, xr),
                            { concurrency: ctx.config.xr.upsertConcurrency },
                        ) // INTENTIONAL_NO_AWAIT
                        .catch((e) => {
                            ctx.log.warn(ctx.i18n.t("log:failed_to_apply_xr", {
                                ...logInfo,
                                e,
                            }), logInfo);
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
                // Step 8.c / 8.d
                if (compareCode(errcode, dsaReferral["&errorCode"]!)) {
                    /*
                    A well-functioning DSA is not supposed to return a
                    referral for a search or list operation if the name
                    resolution is completed. ITU-T Rec. X.518's description of
                    the List Continuation Reference Procedure and the Search
                    Continuation Reference Procedure describe this scenario as
                    "implausible", saying: "It is not plausible to get a
                    referral back from APInfo. Any "referral" should come in
                    the form of "unexplored" in partialOutcomeQualifier." I
                    would like to clarify that the use of the word
                    "implausible" is misleading: a DSA could maliciously or
                    accidentally do this. We do have to handle this scenario.

                    In fact, I don't really think it is valid to get a referral
                    when name resolution is completed at all.
                    */
                    const isInappropriateReferral: boolean = (isSearchOrList || isNameResolved);
                    if (isInappropriateReferral) {
                        ctx.log.warn(ctx.i18n.t("log:inappropriate_referral", {
                            ...logInfo,
                            opid: req.invokeId,
                            dn: stringifyDN(ctx, ap.ae_title.rdnSequence),
                        }));
                        continue;
                    }
                    const followReferrals = followReferralTTL > 0;
                    if (cref.returnToDUA || !followReferrals) {
                        /**
                         * Effectively, this means that the local policy is to
                         * always return the referral. I prefer to take this
                         * approach, because using the referral means that the
                         * next step is to empty the NRContinuationList. This is
                         * problematic, because the NRContinuationList is used
                         * by the function that calls this APInfo procedure in
                         * a loop! This sounds like a great way to introduce
                         * impossible-to-diagnose bugs.
                         */
                        return response;
                    }
                    let referralParam: OPTIONALLY_PROTECTED<DsaReferralData>;
                    try {
                        referralParam = dsaReferral.decoderFor["&ResultType"]!(response.error.parameter);
                    } catch (e) {
                        const aet = stringifyDN(ctx, ap.ae_title.rdnSequence);
                        ctx.log.warn(ctx.i18n.t("log:referral_parameter_malformed", {
                            ...logInfo,
                            aet,
                            e,
                        }), {
                            ...logInfo,
                            aet,
                        });
                        continue;
                    }
                    const referralData = getOptionallyProtectedValue(referralParam);
                    if (referralData.reference.accessPoints.length === 0) {
                        const aet = stringifyDN(ctx, ap.ae_title.rdnSequence);
                        ctx.log.warn(ctx.i18n.t("log:referral_no_access_points", {
                            ...logInfo,
                            aet,
                        }), {
                            ...logInfo,
                            aet,
                        });
                        continue;
                    }
                    /* I think referralRequests exists so that you don't make
                    repeated requests to a DSA that refers you to another DSA
                    over and over again. */
                    // referralData.candidate.accessPoints can contain
                    // multiple access points only if traversing an NSSR.
                    // And each of those should have a unique AE-title each.
                    const tenativeTrace: TraceItem[] = [
                        ...state.referralRequests,
                        // ...that means that these trace items should not
                        // produce loops, even if multiple.
                        ...referralData.reference.accessPoints.map((ap) => new TraceItem(
                            {
                                rdnSequence: ap.ae_title.rdnSequence,
                            },
                            referralData.reference.targetObject,
                            referralData.reference.operationProgress,
                        )),
                    ];
                    // TODO: Deprecate this loop detection function.
                    if (isLoopDetected(ctx, tenativeTrace)) {
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
                    state.referralRequests = tenativeTrace;
                    const onlyFollowSignedReferrals: boolean = ctx.config.chaining.onlyFollowSignedReferrals;
                    if ("signed" in referralParam) {
                        try {
                            const sigVerifyResult = await verifySIGNED(
                                ctx,
                                assn,
                                referralParam.signed.toBeSigned.securityParameters?.certification_path,
                                state.invokeId,
                                state.chainingArguments.aliasDereferenced,
                                referralParam.signed,
                                _encode_DsaReferralData,
                                signErrors,
                                "referral",
                                dsp_client.peer_ae_title?.rdnSequence
                                    ?? ap.ae_title.rdnSequence,
                                HOST_DEPENDENT_CERT_PATH_ERRORS,
                            );
                            if (sigVerifyResult) {
                                assert(HOST_DEPENDENT_CERT_PATH_ERRORS.includes(sigVerifyResult.returnCode));
                                return response;
                            }
                        } catch (e) {
                            if (process.env.MEERKAT_LOG_JSON !== "1") {
                                ctx.log.error(util.inspect(e));
                            }
                            if (onlyFollowSignedReferrals) {
                                // Ignore the referral because it has an invalid
                                // signature or certification path.
                                continue;
                            }
                        }
                    } else if (onlyFollowSignedReferrals) {
                        // Ignore the referral because it is not signed when we require that.
                        continue;
                    }
                    return nrcrProcedure(
                        ctx,
                        assn,
                        getOptionallyProtectedValue(argument),
                        {
                            ...state,
                            NRcontinuationList: [referralData.reference],
                        },
                        chainingProhibited,
                        partialNameResolution,
                        signErrors,
                        localScope ?? false,
                        true,
                        followReferralTTL - 1,
                    );
                // Step 8.b
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
                    // Step 8.e.
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
            if (process.env.MEERKAT_LOG_JSON !== "1") {
                ctx.log.error(util.inspect(e));
            }
            if (!connected) {
                ctx.log.warn(ctx.i18n.t("log:could_not_establish_connection", {
                    ...logInfo,
                    context: "with_error",
                    ae: stringifyDN(ctx, ap.ae_title.rdnSequence),
                    e,
                }));
            } else {
                ctx.log.warn(ctx.i18n.t("log:could_not_write_operation_to_dsa", {
                    ae: stringifyDN(ctx, api.ae_title.rdnSequence),
                    e,
                }), logInfo);
            }
            continue;
        }
    }
    return null;
}
