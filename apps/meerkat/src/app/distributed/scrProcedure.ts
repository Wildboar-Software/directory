import type { MeerkatContext } from "../ctx";
import type { ClientAssociation, IndexableDN } from "@wildboar/meerkat-types";
import {
    ContinuationReference, ReferenceType_ditBridge,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import { SearchArgument, _encode_SearchArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import { SearchState } from "./search_i";
import { OperationDispatcherState } from "./OperationDispatcher";
import { TRUE, TRUE_BIT } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import {
    ServiceControlOptions_chainingProhibited as chainingProhibitedBit,
    ServiceControlOptions_manageDSAIT as manageDSAITBit,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import { compareAuthenticationLevel, ChainedRequest, getOptionallyProtectedValue, compareCode } from "@wildboar/x500";
import { apinfoProcedure } from "./apinfoProcedure";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import { OperationProgress } from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress.ta";
import {
    DistinguishedName,
    _encode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    OperationProgress_nameResolutionPhase_completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import cloneChainingArgs from "../x500/cloneChainingArguments";
import createSecurityParameters from "../x500/createSecurityParameters";
import { Promise as bPromise } from "bluebird";
import {
    ServiceControls_priority_high,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls-priority.ta";
import printCode from "../utils/printCode";
import stringifyDN from "../x500/stringifyDN";
import { distinguishedNameMatch as normalizeDN } from "../matching/normalizers";
import { id_opcode_search } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-search.va";
import { _decode_SearchResult } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
import { strict as assert } from "node:assert";
import { chainedSearch } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedSearch.oa";

/**
 * @summary Search Continuation Reference Procedure, as defined in ITU Recommendation X.518.
 * @description
 *
 * The Search Continuation Reference Procedure, as defined in ITU Recommendation
 * X.518 (2016), Section 20.4.3.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param arg The search argument
 * @param listState The search operation state
 * @param state The operation dispatcher state
 *
 * @function
 * @async
 */
export
async function scrProcedure (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    arg: SearchArgument,
    searchState: SearchState,
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
        ctx.log.debug(ctx.i18n.t("log:scr_abstained", {
            prohibited: chainingProhibited,
            unauthorized: insufficientAuthForChaining,
        }), logInfo);
        return;
    }
    const signErrors: boolean = (
        (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed)
        && (assn.authorizedForSignedErrors)
    );
    const requestor: DistinguishedName | undefined = state.chainingArguments.originator
        ?? assn?.boundNameAndUID?.dn;
    const highPriority = (data.serviceControls?.priority === ServiceControls_priority_high);

    const processContinuationReference = async (cr: ContinuationReference): Promise<void> => {
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
            ctx.log.debug(ctx.i18n.t("log:scr_attempt", logMsgInfo), logInfo);
            const req: ChainedRequest = {
                chaining: cloneChainingArgs(state.chainingArguments, {
                    originator: requestor,
                    targetObject: cr.targetObject.rdnSequence,
                    operationProgress: new OperationProgress(
                        OperationProgress_nameResolutionPhase_completed,
                        undefined,
                    ),
                    securityParameters: createSecurityParameters(
                        ctx,
                        ctx.config.chaining.signChainedRequests,
                        api.ae_title.rdnSequence,
                        id_opcode_search,
                    ),
                    dspPaging: TRUE,
                }),
                invokeId: state.invokeId,
                opCode: id_opcode_search,
                argument: _encode_SearchArgument(arg, DER),
            };
            const response = await apinfoProcedure(ctx, api, req, assn, state, signErrors, chainingProhibited);
            if (!response) {
                ctx.log.debug(ctx.i18n.t("log:scr_null_response", logMsgInfo), logInfo);
                continue;
            }
            if ("error" in response) {
                ctx.log.debug(ctx.i18n.t("log:scr_error_response", {
                    ...logMsgInfo,
                    errcode: response.error.code
                        ? printCode(response.error.code)
                        : undefined,
                    errbytes: Buffer.from(response.error.parameter.toBytes().slice(0, 16)).toString("hex"),
                }), logInfo);
                continue;
            } else if ("result" in response) {
                if (!response.result) {
                    ctx.log.warn(ctx.i18n.t("log:scr_undefined_result", logMsgInfo), logInfo);
                    continue;
                }
                // TODO: Shouldn't things like this be checked in apinfoProcedure?
                if (!("present" in response.result.invoke_id)) {
                    ctx.log.warn(ctx.i18n.t("log:scr_invalid_invoke_id_response", logMsgInfo), logInfo);
                    continue;
                }
                if (!response.result.code) {
                    ctx.log.warn(ctx.i18n.t("log:scr_missing_opcode", logMsgInfo), logInfo);
                    continue;
                }
                if (!compareCode(response.result.code, id_opcode_search)) {
                    ctx.log.warn(ctx.i18n.t("log:scr_mismatch_opcode", logMsgInfo), logInfo);
                    continue;
                }
                try {
                    // NOTE: You do not need to check signatures. That was
                    // already handled by apInfoProcedure().
                    const chainedResult = chainedSearch.decoderFor["&ResultType"]!(response.result.parameter);
                    const chainedResultData = getOptionallyProtectedValue(chainedResult);
                    const searchResult = _decode_SearchResult(chainedResultData.result);
                    // Whether signed or not, we still just add the search result.
                    // This preserves the performer.
                    searchState.resultSets.push(searchResult);
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
    // Sort the continuation references in SRcontinuationList into sets that have
    // the same targetObject. Continuation references of type ditBridge are not
    // included in such sets, but each such continuation reference constitutes a
    // set of its own. Within each set, remove any duplicates.
    const continuationReferencesByTargetObject: Map<IndexableDN, ContinuationReference[]> = new Map();
    for (const cr of state.SRcontinuationList) {
        if (cr.referenceType === ReferenceType_ditBridge) {
            continue;
        }
        const dn = normalizeDN(ctx, _encode_DistinguishedName(cr.targetObject.rdnSequence, DER));
        if (!dn) {
            // It's a little sloppy, but if we cannot normalize a DN, we just ignore it.
            ctx.log.debug(ctx.i18n.t("log:failed_to_normalize_dn", {
                dn: stringifyDN(ctx, cr.targetObject.rdnSequence).slice(0, 256),
            }), logInfo);
            continue;
        }
        const crs = continuationReferencesByTargetObject.get(dn);
        if (crs) {
            crs.push(cr);
        } else {
            continuationReferencesByTargetObject.set(dn, [ cr ]);
        }
    }

    assert(continuationReferencesByTargetObject.size > 0);

    for (const crlist of continuationReferencesByTargetObject.values()) {
        if (
            highPriority
            && Number.isSafeInteger(ctx.config.chaining.scrParallelism)
            && (ctx.config.chaining.scrParallelism > 1)
        ) {
            await bPromise.map(crlist, processContinuationReference, {
                concurrency: ctx.config.chaining.scrParallelism,
            });
        } else {
            for (const cr of crlist) {
                await processContinuationReference(cr);
            }
        }
    }
}

export default scrProcedure;
