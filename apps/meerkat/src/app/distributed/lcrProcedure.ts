import type { MeerkatContext } from "../ctx.js";
import type { ClientAssociation } from "@wildboar/meerkat-types";
import { TRUE, TRUE_BIT } from "@wildboar/asn1";
import { DER } from "@wildboar/asn1/functional";
import {
    ListArgument,
    _encode_ListArgument,
    PartialOutcomeQualifier,
    _decode_ListResult,
    ServiceControls_priority_high,
    ServiceControlOptions_chainingProhibited as chainingProhibitedBit,
    ServiceControlOptions_manageDSAIT as manageDSAITBit,
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import { chainedList } from "@wildboar/x500/DistributedOperations";
import { compareAuthenticationLevel, ChainedRequest, getOptionallyProtectedValue, compareCode } from "@wildboar/x500";
import { apinfoProcedure } from "./apinfoProcedure.js";
import type { OperationDispatcherState } from "./OperationDispatcher.js";
import { id_opcode_list } from "@wildboar/x500/CommonProtocolSpecification";
import { OperationProgress } from "@wildboar/x500/DistributedOperations";
import type { DistinguishedName } from "@wildboar/x500/InformationFramework";
import {
    OperationProgress_nameResolutionPhase_completed,
} from "@wildboar/x500/DistributedOperations";
import cloneChainingArgs from "../x500/cloneChainingArguments.js";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import type { ListState } from "./list_i.js";
import {
    ContinuationReference,
} from "@wildboar/x500/DistributedOperations";
import bb from "bluebird";
import printCode from "../utils/printCode.js";
import stringifyDN from "../x500/stringifyDN.js";

const bPromise = bb.Promise;

/**
 * @summary List Continuation Reference Procedure, as defined in ITU Recommendation X.518.
 * @description
 *
 * The List Continuation Reference Procedure, as defined in ITU Recommendation
 * X.518 (2019), Section 20.4.2.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param arg The list argument
 * @param listState The list operation state
 * @param state The operation dispatcher state
 *
 * @function
 * @async
 */
export
async function lcrProcedure (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    arg: ListArgument,
    listState: ListState,
    state: OperationDispatcherState,
): Promise<void> {
    // This function will not get called if a limit has been exceeded, so step #1 is done.
    const data = getOptionallyProtectedValue(arg);
    // Step #2
    const chainingProhibited = (
        (data.serviceControls?.options?.[chainingProhibitedBit] === TRUE_BIT)
        || (data.serviceControls?.options?.[manageDSAITBit] === TRUE_BIT)
    );
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
    const logInfo = {
        remoteFamily: assn.socket.remoteFamily,
        remoteAddress: assn.socket.remoteAddress,
        remotePort: assn.socket.remotePort,
        association_id: assn.id,
        invokeId: ("present" in state.invokeId) ? Number(state.invokeId.present) : undefined,
        opCode: printCode(state.operationCode),
        operationIdentifier: state.chainingArguments.operationIdentifier
            ? Number(state.chainingArguments.operationIdentifier)
            : undefined,
    };
    if (chainingProhibited || insufficientAuthForChaining) {
        ctx.log.debug(ctx.i18n.t("log:lcr_abstained", {
            prohibited: chainingProhibited,
            unauthorized: insufficientAuthForChaining,
        }));
        return;
    }
    const signErrors: boolean = (
        (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed)
        && (assn.authorizedForSignedErrors)
    );
    const requestor: DistinguishedName | undefined = state.chainingArguments.originator
        ?? assn?.boundNameAndUID?.dn;
    const highPriority = (data.serviceControls?.priority === ServiceControls_priority_high);

    // Part of Step #3
    const processContinuationReference = async (cr: ContinuationReference): Promise<void> => {
        let crLeftUnexplored: boolean = false;
        const unexplore = () => {
            if (crLeftUnexplored) {
                return; // We already added this CR back to unexplored.
            }
            crLeftUnexplored = true;
            if (listState.poq) {
                if (listState.poq.unexplored) {
                    listState.poq.unexplored.push(cr);
                } else {
                    listState.poq = new PartialOutcomeQualifier(
                        listState.poq.limitProblem,
                        [ cr ],
                        listState.poq.unavailableCriticalExtensions,
                        listState.poq.unknownErrors,
                        listState.poq.queryReference,
                        listState.poq.overspecFilter,
                        listState.poq.notification,
                        listState.poq.entryCount,
                    );
                }
            } else {
                listState.poq = listState.poq = new PartialOutcomeQualifier(
                    undefined,
                    [ cr ],
                );
            }
        };
        if (cr.accessPoints.length === 0) {
            ctx.log.warn(ctx.i18n.t("log:zero_access_points_in_cr", {
                dn: stringifyDN(ctx, cr.targetObject.rdnSequence).slice(0, 256),
            }), logInfo);
        }
        for (const api of cr.accessPoints) {
            const logMsgInfo = {
                ae: stringifyDN(ctx, api.ae_title.rdnSequence),
                aid: assn.id,
                iid: ("present" in state.invokeId)
                    ? Number(state.invokeId.present)
                    : 0,
            };
            ctx.log.debug(ctx.i18n.t("log:lcr_attempt", logMsgInfo), logInfo);
            const req: ChainedRequest = {
                chaining: cloneChainingArgs(state.chainingArguments, {
                    originator: requestor,
                    targetObject: state.SRcontinuationList[0].targetObject.rdnSequence,
                    operationProgress: new OperationProgress(
                        OperationProgress_nameResolutionPhase_completed,
                        undefined,
                    ),
                    securityParameters: createSecurityParameters(
                        ctx,
                        ctx.config.chaining.signChainedRequests,
                        api.ae_title.rdnSequence,
                        id_opcode_list,
                    ),
                    dspPaging: TRUE,
                }),
                invokeId: state.invokeId,
                opCode: id_opcode_list,
                argument: _encode_ListArgument(arg, DER),
            };
            const response = await apinfoProcedure(ctx, api, req, assn, state, signErrors, chainingProhibited, cr);
            if (!response) {
                ctx.log.debug(ctx.i18n.t("log:lcr_null_response", logMsgInfo), logInfo);
                unexplore();
                continue;
            }
            if ("error" in response) {
                ctx.log.debug(ctx.i18n.t("log:lcr_error_response", {
                    ...logMsgInfo,
                    errcode: response.error.code
                        ? printCode(response.error.code)
                        : undefined,
                    errbytes: Buffer.from(response.error.parameter.toBytes().slice(0, 16)).toString("hex"),
                }), logInfo);
                unexplore();
                continue;
            } else if ("result" in response) {
                if (!response.result) {
                    ctx.log.warn(ctx.i18n.t("log:lcr_undefined_result", logMsgInfo), logInfo);
                    unexplore();
                    continue;
                }
                // TODO: Shouldn't things like this be checked in apinfoProcedure?
                if (!("present" in response.result.invoke_id)) {
                    ctx.log.warn(ctx.i18n.t("log:lcr_invalid_invoke_id_response", logMsgInfo), logInfo);
                    unexplore();
                    continue;
                }
                if (!response.result.code) {
                    ctx.log.warn(ctx.i18n.t("log:lcr_missing_opcode", logMsgInfo), logInfo);
                    unexplore();
                    continue;
                }
                if (!compareCode(response.result.code, id_opcode_list)) {
                    ctx.log.warn(ctx.i18n.t("log:lcr_mismatch_opcode", logMsgInfo), logInfo);
                    unexplore();
                    continue;
                }
                try {
                    // NOTE: You do not need to check signatures. That was
                    // already handled by apInfoProcedure().
                    // TODO: Return the decoded parameter.
                    const chainedResult = chainedList.decoderFor["&ResultType"]!(response.result.parameter);
                    const chainedResultData = getOptionallyProtectedValue(chainedResult);
                    const listResult = _decode_ListResult(chainedResultData.result);
                    // Whether signed or not, we still just add the list result.
                    // This preserves the performer.
                    listState.resultSets.push(listResult);
                } catch (e) {
                    // TODO: Log e
                    ctx.log.warn(e);
                }
            } else {
                // TODO: Log
                continue;
            }
        }
    };

    // Step #3
    // NOTE: all continuation references should have the same targetObject.
    if (
        highPriority
        && Number.isSafeInteger(ctx.config.chaining.lcrParallelism)
        && (ctx.config.chaining.lcrParallelism > 1)
    ) {
        await bPromise.map(state.SRcontinuationList, processContinuationReference, {
            concurrency: ctx.config.chaining.lcrParallelism,
        });
    } else {
        for (const cr of state.SRcontinuationList) {
            await processContinuationReference(cr);
        }
    }

    // Step #4
    return;
}

export default lcrProcedure;
