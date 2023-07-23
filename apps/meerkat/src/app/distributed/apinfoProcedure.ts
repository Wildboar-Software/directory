import type { ClientAssociation } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import { BOOLEAN } from "asn1-ts";
import { AccessPointInformation } from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPointInformation.ta";
import { ChainingArguments } from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import {
    chainedAbandon,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedAbandon.oa";
import {
    referral,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/referral.oa";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import {
    ServiceProblem_busy,
    ServiceProblem_unavailable,
    ServiceProblem_unwillingToPerform,
    ServiceProblem_invalidReference,
    ServiceProblem_loopDetected,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import type { ChainedRequest } from "@wildboar/x500/src/lib/types/ChainedRequest";
import type { Chained } from "@wildboar/x500/src/lib/types/Chained";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    _encode_Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import { chainedRead } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedRead.oa";
import { DER } from "asn1-ts/dist/node/functional";
import {
    MasterOrShadowAccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";
import {
    MasterOrShadowAccessPoint_category_shadow,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint-category.ta";
import isModificationOperation from "@wildboar/x500/src/lib/utils/isModificationOperation";
import {
    OperationProgress_nameResolutionPhase_proceeding as proceeding,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import {
    ReferenceType_nonSpecificSubordinate as nssr,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ReferenceType.ta";
import cloneChainingArguments from "../x500/cloneChainingArguments";
import {
    TraceItem,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/TraceItem.ta";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import { loopDetected } from "@wildboar/x500/src/lib/distributed/loopDetected";
import createSecurityParameters from "../x500/createSecurityParameters";
import type { OperationDispatcherState } from "./OperationDispatcher";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import { printInvokeId } from "../utils/printInvokeId";
import { signChainedArgument } from "../pki/signChainedArgument";
import { strict as assert } from "assert";
import { verifySIGNED } from "../pki/verifySIGNED";
import stringifyDN from "../x500/stringifyDN";
import { bindForChaining } from "../net/bindToOtherDSA";
import { OperationOutcome } from "@wildboar/rose-transport";
import generateUnusedInvokeID from "../net/generateUnusedInvokeID";
import { ContinuationReference } from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";

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
 * @returns A result or error
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
): Promise<OperationOutcome | null> {
    const op = ("present" in state.invokeId)
        ? assn?.invocations.get(Number(state.invokeId.present))
        : undefined;
    if (chainingProhibited) {
        return null;
    }
    const excludeShadows: BOOLEAN = req.chaining.excludeShadows ?? ChainingArguments._default_value_for_excludeShadows;
    const nameResolveOnMaster: BOOLEAN = req.chaining.nameResolveOnMaster
        ?? ChainingArguments._default_value_for_nameResolveOnMaster;
    const nameResolutionIsProceeding: boolean = (req.chaining.operationProgress?.nameResolutionPhase === proceeding);

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
            )
        ) {
            continue;
        }
        let connected: boolean = false;
        try {
            const dsp_client = await bindForChaining(ctx, assn, op, ap, false, signErrors);
            if (!dsp_client) {
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
            const response = await dsp_client.rose.request({
                invoke_id: {
                    present: generateUnusedInvokeID(ctx),
                },
                code: req.opCode,
                parameter: chainedRead.encoderFor["&ArgumentType"]!(payload, DER),
            });
            dsp_client.unbind().then().catch();
            if (dsp_client.rose.socket?.writable) {
                dsp_client.rose.socket?.end(); // Unbind does not necessarily close the socket.
            }

            if ("error" in response) {
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
            } else if ("result" in response) {
                assert(chainedAbandon["&operationCode"]);
                assert("local" in chainedAbandon["&operationCode"]);
                if (
                    ctx.config.chaining.checkSignaturesOnResponses
                    && ("local" in response.result.code)
                    && (response.result.code.local !== chainedAbandon["&operationCode"]!.local)
                ) {
                    const decoded = chainedRead.decoderFor["&ResultType"]!(response.result.parameter);
                    const resultData = getOptionallyProtectedValue(decoded);
                    if ("signed" in decoded) {
                        const certPath = resultData.chainedResult.securityParameters?.certification_path;
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
                    }
                }
                return response;
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
