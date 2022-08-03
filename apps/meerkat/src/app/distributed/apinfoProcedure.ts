import type { ClientAssociation } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import { BOOLEAN } from "asn1-ts";
import { AccessPointInformation } from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPointInformation.ta";
import { ChainingArguments } from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import connect from "../net/connect";
import { dsp_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dsp-ip.oa";
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
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError";
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
): Promise<ResultOrError | null> {
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
            const connection = await connect(ctx, ap, dsp_ip["&id"]!, {
                tlsOptional: ctx.config.chaining.tlsOptional,
                signErrors,
            });
            if (!connection) {
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
            const signArguments: boolean = true; // TODO: Make configurable.
            const payload: Chained = signArguments
                ? signChainedArgument(ctx, argument)
                : argument;
            const result = await connection.writeOperation({
                opCode: req.opCode,
                argument: chainedRead.encoderFor["&ArgumentType"]!(payload, DER),
            });
            if ("error" in result) {
                const errcode: Code = result.errcode ?? { local: -1 };
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
                    return result;
                } else if (compareCode(errcode, serviceError["&errorCode"]!)) {
                    const param = serviceError.decoderFor["&ParameterType"]!(result.error!);
                    const errorData = getOptionallyProtectedValue(param);
                    if (
                        (errorData.problem === ServiceProblem_busy)
                        || (errorData.problem === ServiceProblem_unavailable)
                        || (errorData.problem === ServiceProblem_unwillingToPerform)
                        || (errorData.problem === ServiceProblem_invalidReference)
                    ) {
                        continue; // Always try another.
                    } else {
                        return result;
                    }
                } else {
                    return result;
                }
            } else {
                if (!result.opCode) {
                    ctx.log.warn(ctx.i18n.t("log:dsa_returned_no_opcode", {
                        ae: stringifyDN(ctx, api.ae_title.rdnSequence),
                    }), {
                        remoteFamily: assn?.socket.remoteFamily,
                        remoteAddress: assn?.socket.remoteAddress,
                        remotePort: assn?.socket.remotePort,
                        association_id: assn?.id,
                        invokeID: printInvokeId(state.invokeId),
                    });
                    continue;
                }
                const checkChainedResultSignature: boolean = true; // TODO: Make configurable.
                assert(chainedAbandon["&operationCode"]);
                assert("local" in chainedAbandon["&operationCode"]);
                if (
                    checkChainedResultSignature
                    && ("local" in result.opCode)
                    && (result.opCode.local !== chainedAbandon["&operationCode"]!.local)
                    && result.result
                ) {
                    const decoded = chainedRead.decoderFor["&ResultType"]!(result.result);
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
                return {
                    invokeId: result.invokeId,
                    opCode: result.opCode,
                    result: result.result,
                };
            }
        } catch (e) {
            if (connected) {
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
