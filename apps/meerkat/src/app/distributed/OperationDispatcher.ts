import {
    ClientAssociation,
    Vertex,
    WithRequestStatistics,
    WithOutcomeStatistics,
    RequestStatistics,
    OPCR,
    UnknownOperationError,
    IndexableOID,
} from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import DSPAssociation from "../dsp/DSPConnection";
import type { Request } from "@wildboar/x500/src/lib/types/Request";
import {
    ChainingArguments,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import {
    _decode_ListArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgument.ta";
import {
    SearchArgument,
    SearchArgumentData,
    _decode_SearchArgument,
    _encode_SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import {
    ReadArgument, _decode_ReadArgument, _encode_ReadArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgument.ta";
import {
    SearchResult,
    _decode_SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
import * as errors from "@wildboar/meerkat-types";
import requestValidationProcedure from "./requestValidationProcedure";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import getSoughtObjectFromRequest from "./getSoughtObjectFromRequest";
import findDSE from "./findDSE";
import {
    ContinuationReference,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import {
    TraceItem,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/TraceItem.ta";
import nrcrProcedure from "./nrcrProcedure";
import { TRUE_BIT, ASN1Element, ObjectIdentifier, OBJECT_IDENTIFIER } from "asn1-ts";
import {
    ServiceControlOptions_chainingProhibited as chainingProhibitedBit,
    ServiceControlOptions_partialNameResolution as partialNameResolutionBit,
    ServiceControlOptions_manageDSAIT as manageDSAITBit,
    ServiceControlOptions,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import { compareCode } from "@wildboar/x500/src/lib/utils/compareCode";
import { abandon } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandon.oa";
import { administerPassword } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/administerPassword.oa";
import { addEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa";
import { changePassword } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/changePassword.oa";
import { compare, CompareArgument, _encode_CompareArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/compare.oa";
import { modifyDN } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyDN.oa";
import { modifyEntry, _decode_ModifyEntryArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyEntry.oa";
import { ldapTransport } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ldapTransport.oa";
import { linkedLDAP } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/linkedLDAP.oa";
import { list } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/list.oa";
import { read } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/read.oa";
import { removeEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/removeEntry.oa";
import { search } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import { strict as assert } from "assert";
import { abandon as doAbandon } from "./abandon";
import { addEntry as doAddEntry } from "./addEntry";
import { administerPassword as doAdministerPassword } from "./administerPassword";
import { changePassword as doChangePassword } from "./changePassword";
import { compare as doCompare } from "./compare";
import { modifyDN as doModifyDN } from "./modifyDN";
import { modifyEntry as doModifyEntry } from "./modifyEntry";
import { read as doRead } from "./read";
import { removeEntry as doRemoveEntry } from "./removeEntry";
import list_i from "./list_i";
import list_ii from "./list_ii";
import search_i, {
    apply_mr_mapping,
    getCurrentNumberOfResults,
    update_search_state_with_search_rule,
    update_operation_dispatcher_state_with_search_rule,
} from "./search_i";
import search_ii from "./search_ii";
import resultsMergingProcedureForList from "./resultsMergingProcedureForList";
import resultsMergingProcedureForSearch from "./resultsMergingProcedureForSearch";
import {
    OperationProgress_nameResolutionPhase,
    OperationProgress_nameResolutionPhase_completed as completed, OperationProgress_nameResolutionPhase_completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import { DER } from "asn1-ts/dist/node/functional";
import type { SearchState } from "./search_i";
import { ChainingResults } from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import type { Error_ } from "@wildboar/x500/src/lib/types/Error_";
import type { InvokeId } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import type { Code } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import relatedEntryProcedure from "./relatedEntryProcedure";
import createSecurityParameters from "../x500/createSecurityParameters";
import type { OPTIONALLY_PROTECTED } from "@wildboar/x500/src/lib/modules/EnhancedSecurity/OPTIONALLY-PROTECTED.ta";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_noInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import {
    id_errcode_securityError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-securityError.va";
import codeToString from "@wildboar/x500/src/lib/stringifiers/codeToString";
import getStatisticsFromCommonArguments from "../telemetry/getStatisticsFromCommonArguments";
import getFilterStatistics from "../telemetry/getFilterStatistics";
import getEntryInformationSelectionStatistics from "../telemetry/getEntryInformationSelectionStatistics";
import getStatisticsFromPagedResultsRequest from "../telemetry/getStatisticsFromPagedResultsRequest";
import getJoinArgumentStatistics from "../telemetry/getJoinArgumentStatistics";
import { Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 } from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import ldapRequestToDAPRequest from "../distributed/ldapRequestToDAPRequest";
import { BER } from "asn1-ts/dist/node/functional";
import failover from "../utils/failover";
import mergeSortAndPageSearch from "./mergeSortAndPageSearch";
import mergeSortAndPageList from "./mergeSortAndPageList";
import { Attribute, SearchResultData_searchInfo } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResultData-searchInfo.ta";
import getDistinguishedName from "../x500/getDistinguishedName";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import { signChainedResult } from "../pki/signChainedResult";
import { addSeconds } from "date-fns";
import { randomInt } from "crypto";
import { CommonArguments } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CommonArguments.ta";
import LDAPAssociation from "../ldap/LDAPConnection";
import stringifyDN from "../x500/stringifyDN";
import { MRMapping } from "@wildboar/x500/src/lib/modules/ServiceAdministration/MRMapping.ta";
import cloneChainingArgs from "../x500/cloneChainingArguments";
import { MRSubstitution } from "@wildboar/x500/src/lib/modules/ServiceAdministration/MRSubstitution.ta";
import {
    SearchControlOptions_includeAllAreas, SearchControlOptions_noSystemRelaxation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchControlOptions.ta";
import normalizeFilter from "../x500/normalizeFilter";
import {
    appliedRelaxation,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/appliedRelaxation.oa";
import { MAX_RESULTS } from "../constants";
import { searchRuleCheckProcedure_i } from "./searchRuleCheckProcedure_i";
import searchRuleCheckProcedure_ii from "./searchRuleCheckProcedure_ii";
import { SearchArgumentData_subset_baseObject } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import { FamilyReturn, ResultAttribute, SearchRule } from "@wildboar/x500/src/lib/modules/ServiceAdministration/SearchRule.ta";

function getPathFromVersion (vertex: Vertex): Vertex[] {
    const ret: Vertex[] = [];
    let v: Vertex | undefined = vertex;
    while (v) {
        ret.push(v);
        v = v.immediateSuperior;
        if (v?.dse.root) {
            break;
        }
    }
    return ret.reverse();
}

export
type SearchResultOrError = {
    invokeId: InvokeId;
    opCode: Code;
    result: SearchResult;
    chaining: ChainingResults;
} | Error_;

export
interface OperationDispatcherState {
    // Variables defined in X.518 (2016), Section 16.1.2.
    NRcontinuationList: ContinuationReference[];
    SRcontinuationList: ContinuationReference[];
    admPoints: Vertex[];
    referralRequests: TraceItem[];
    emptyHierarchySelect: boolean;

    // Procedures need to modify these by reference:
    invokeId: InvokeId;
    operationCode: Code;
    operationArgument: ASN1Element;
    chainingArguments: ChainingArguments;
    chainingResults: ChainingResults;
    foundDSE: Vertex;
    entrySuitable: boolean;
    partialName: boolean;
    rdnsResolved: number;

    // Not explicitly defined in the spec, but needed for preventing alias
    // loops.
    aliasesEncounteredById: Set<number>;

    // These are set by service administration for non-search operations.
    governingSearchRule?: SearchRule;
    outputAttributeTypes?: Map<IndexableOID, ResultAttribute>;
    effectiveServiceControls?: ServiceControlOptions;
    effectiveFamilyReturn?: FamilyReturn;
}

export
interface OperationDispatcherReturn
extends
    Partial<WithRequestStatistics>,
    Partial<WithOutcomeStatistics>
{
    invokeId: InvokeId;
    opCode: Code;
    foundDSE?: Vertex;
    result: OPCR;
}

/**
 * @summary All X.518 search procedures, callable as a unit
 * @description
 *
 * This function combines all of the X.518 search procedures purely for
 * refactoring / code cleanliness purposes. This is used in relaxation or
 * tightening, where, if a search produces an undesirable number of results,
 * the search can be restarted with different matching rules. Each restart of
 * the search must call _all_ of these procedures, hence this function.
 *
 * @param ctx
 * @param assn
 * @param state
 * @param argument
 * @param reqData
 * @param signErrors
 * @param signDSPResult
 * @param nameResolutionPhase
 * @param searchState
 * @returns
 */
async function search_procedures (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    state: OperationDispatcherState,
    argument: SearchArgument,
    reqData: Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
    signErrors: boolean,
    signDSPResult: boolean,
    nameResolutionPhase: OperationProgress_nameResolutionPhase,
    searchState: SearchState,
): Promise<SearchState> {
    const chainingResults = new ChainingResults(
        undefined,
        undefined,
        createSecurityParameters(
            ctx,
            signDSPResult,
            assn.boundNameAndUID?.dn,
            search["&operationCode"],
        ),
        undefined,
    );
    const searchResponse: SearchState = searchState ?? {
        results: [],
        resultSets: [],
        chaining: chainingResults,
        depth: 0,
        excludedById: new Set(),
        matching_rule_substitutions: new Map(),
    };

    const use_search_ii: boolean = (
        (nameResolutionPhase === completed)
        /**
         * The Java Naming and Directory Interface (JNDI) library
         * automatically inserts the `ManageDSAIT` control into search
         * requests in most cases. In LDAP, it is expected that the use
         * of this control causes searches to return entries as usual,
         * but in X.500 directories, the use of this control causes the
         * Search (II) procedure to be used, which only delves into
         * context prefixes. I think this (meaning that the
         * `ManageDSAIT` control causing the Search (II) and List (II)
         * procedures to be used) is actually a mistake on the
         * part of the X.500 directory specifications, but it might not
         * be, so I will not deviate from the specified behavior here,
         * except for LDAP requests only.
         *
         * With this line added, LDAP requests will always use
         * Search (I), even if the `ManageDSAIT` control is used.
         */
        && !(assn instanceof LDAPAssociation)
    );

    await relatedEntryProcedure(
        ctx,
        assn,
        state,
        searchResponse,
        argument,
        reqData.chainedArgument,
        signErrors,
    );

    if (use_search_ii) {
        await search_ii(
            ctx,
            assn,
            state,
            argument,
            searchResponse,
        );
    } else {
        // Only Search (I) results in results merging.
        await search_i(
            ctx,
            assn,
            state,
            argument,
            searchResponse,
        );
    }
    return resultsMergingProcedureForSearch(
        ctx,
        assn,
        argument,
        searchResponse,
        state,
    );
}

/**
 * @summary The operation dispatcher described in ITU Recommendation X.518.
 * @description
 *
 * This is a model of the Operation Dispatcher defined in ITU Recommendation
 * X.518 (2016), Section 16.
 *
 * @class
 */
export
class OperationDispatcher {

    /**
     * @summary Evaluate an operation
     * @description
     *
     * This function does little more than route an operation to a function that
     * performs it.
     *
     * @param ctx The context object
     * @param state The operation dispatcher state
     * @param assn The client association
     * @param req The request
     * @param reqData The chaining arguments and original argument
     * @param local Whether this request was generated internally by Meerkat DSA
     *
     * @public
     * @static
     * @function
     * @async
     * @memberof OperationDispatcher
     */
    public static async operationEvaluation (
        ctx: MeerkatContext,
        state: OperationDispatcherState,
        assn: ClientAssociation,
        req: Request,
        reqData: Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
        local: boolean = false,
    ): Promise<OperationDispatcherReturn> {
        assert(req.opCode);
        assert(req.argument);
        const signDSPResult: boolean = (
            (assn instanceof DSPAssociation) // The outer signature will only be used for DSP, not DAP.
            && (state.chainingArguments.securityParameters?.target === ProtectionRequest_signed)
            && assn.authorizedForSignedResults
        );
        if (compareCode(req.opCode, addEntry["&operationCode"]!)) {
            const outcome = await doAddEntry(ctx, assn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: signDSPResult
                    ? signChainedResult(ctx, outcome.result)
                    : outcome.result,
                request: ctx.config.bulkInsertMode
                    ? undefined
                    : {
                        ...outcome.stats.request,
                        operationCode: codeToString(req.opCode),
                    },
                outcome: ctx.config.bulkInsertMode
                    ? undefined
                    : {
                        ...outcome.stats.outcome,
                    },
                foundDSE: state.foundDSE,
            };
        }
        else if (compareCode(req.opCode, administerPassword["&operationCode"]!)) {
            const outcome = await doAdministerPassword(ctx, assn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: signDSPResult
                    ? signChainedResult(ctx, outcome.result)
                    : outcome.result,
                request: {
                    // ...outcome.stats.request,
                    operationCode: codeToString(req.opCode),
                },
                outcome: {
                    // ...outcome.stats.outcome,
                },
                foundDSE: state.foundDSE,
            };
        }
        else if (compareCode(req.opCode, changePassword["&operationCode"]!)) {
            const outcome = await doChangePassword(ctx, assn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: signDSPResult
                    ? signChainedResult(ctx, outcome.result)
                    : outcome.result,
                request: {
                    // ...outcome.stats.request,
                    operationCode: codeToString(req.opCode),
                },
                outcome: {
                    // ...outcome.stats.outcome,
                },
                foundDSE: state.foundDSE,
            };
        }
        else if (compareCode(req.opCode, compare["&operationCode"]!)) {
            const outcome = await doCompare(ctx, assn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: signDSPResult
                    ? signChainedResult(ctx, outcome.result)
                    : outcome.result,
                request: {
                    ...outcome.stats.request,
                    operationCode: codeToString(req.opCode),
                },
                outcome: {
                    ...outcome.stats.outcome,
                },
                foundDSE: state.foundDSE,
            };
        }
        else if (compareCode(req.opCode, modifyDN["&operationCode"]!)) {
            const outcome = await doModifyDN(ctx, assn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: signDSPResult
                    ? signChainedResult(ctx, outcome.result)
                    : outcome.result,
                request: {
                    ...outcome.stats.request,
                    operationCode: codeToString(req.opCode),
                },
                outcome: {
                    ...outcome.stats.outcome,
                },
                foundDSE: state.foundDSE,
            };
        }
        else if (compareCode(req.opCode, modifyEntry["&operationCode"]!)) {
            // #region service-admin
            {
                const argument = _decode_ModifyEntryArgument(reqData.argument);
                const data = getOptionallyProtectedValue(argument);
                state.effectiveFamilyReturn = data.selection?.familyReturn;
                state.effectiveServiceControls = data.serviceControls?.options;
                const equivalent_search_data = new SearchArgumentData(
                    data.object,
                    SearchArgumentData_subset_baseObject,
                    undefined,
                    undefined,
                    data.selection,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    data.serviceControls,
                    data.securityParameters, // NOTE: This will have the wrong opcode...
                    data.requestor,
                    data.operationProgress,
                    data.aliasedRDNs,
                    data.criticalExtensions,
                    data.referenceType,
                    data.entryOnly,
                    data.exclusions,
                    data.nameResolveOnMaster,
                    data.operationContexts,
                    data.familyGrouping,
                );
                const signErrors: boolean = (
                    (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed)
                    && (assn.authorizedForSignedErrors)
                );
                const search_rule = await searchRuleCheckProcedure_i(
                    ctx,
                    assn,
                    state,
                    state.foundDSE,
                    equivalent_search_data,
                    signErrors,
                );
                if (search_rule) {
                    update_operation_dispatcher_state_with_search_rule(equivalent_search_data, state, search_rule);
                }
            }
            // #endregion service-admin
            const outcome = await doModifyEntry(ctx, assn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: signDSPResult
                    ? signChainedResult(ctx, outcome.result)
                    : outcome.result,
                request: {
                    ...outcome.stats.request,
                    operationCode: codeToString(req.opCode),
                },
                outcome: {
                    ...outcome.stats.outcome,
                },
                foundDSE: state.foundDSE,
            };
        }
        else if (compareCode(req.opCode, ldapTransport["&operationCode"]!)) {
            const arg = ldapTransport.decoderFor["&ArgumentType"]!(state.operationArgument);
            const data = getOptionallyProtectedValue(arg);
            const dapRequest = ldapRequestToDAPRequest(ctx, assn, data.ldapMessage);
            if (!dapRequest) {
                throw new Error("8b7e20f2-16b7-496f-b800-5a7a1e0b9db1");
            }
            return OperationDispatcher.dispatchDAPRequest(
                ctx,
                assn,
                {
                    invokeId: req.invokeId,
                    opCode: req.opCode,
                    argument: dapRequest.argument,
                },
            );
        }
        else if (compareCode(req.opCode, linkedLDAP["&operationCode"]!)) {
            /**
             * Automatically returns NULL no matter what, because Meerkat DSA
             * will not issue ldapTransport requests. It will just make LDAP
             * requests for the equivalent DAP requests.
             *
             * We also will not sign this response since it is not important and
             * its simplicity might lend itself to key oracle attacks.
             */
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: {
                    unsigned: new Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1(
                        state.chainingResults,
                        linkedLDAP.encoderFor["&ResultType"]!(null, BER),
                    ),
                },
            };
        }
        else if (compareCode(req.opCode, list["&operationCode"]!)) {
            const argument = _decode_ListArgument(reqData.argument);
            const data = getOptionallyProtectedValue(argument);
            const nameResolutionPhase = reqData.chainedArgument.operationProgress?.nameResolutionPhase
                ?? ChainingArguments._default_value_for_operationProgress.nameResolutionPhase;
            if (nameResolutionPhase === completed) { // List (II)
                const outcome = await list_ii(ctx, assn, state, true);
                return {
                    invokeId: req.invokeId,
                    opCode: req.opCode,
                    result: signDSPResult
                        ? signChainedResult(ctx, outcome.result)
                        : outcome.result,
                    request: {
                        ...outcome.stats.request,
                        operationCode: codeToString(req.opCode),
                    },
                    outcome: {
                        ...outcome.stats.outcome,
                    },
                    foundDSE: state.foundDSE,
                };
            } else { // List (I)
                // Only List (I) results in results merging.
                const response = await list_i(ctx, assn, state);
                const postMergeState = await resultsMergingProcedureForList(
                    ctx,
                    assn,
                    argument,
                    response,
                    local,
                    state,
                );
                const result = await mergeSortAndPageList(ctx, assn, state, data, postMergeState);
                const opcr: OPCR = {
                    unsigned: new Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1(
                        new ChainingResults(
                            undefined,
                            undefined,
                            createSecurityParameters(
                                ctx,
                                signDSPResult,
                                assn.boundNameAndUID?.dn,
                                list["&operationCode"],
                            ),
                            undefined,
                        ),
                        result.encodedListResult,
                    ),
                };
                return {
                    invokeId: req.invokeId,
                    opCode: req.opCode,
                    result: signDSPResult
                        ? signChainedResult(ctx, opcr)
                        : opcr,
                    request: failover(() => ({
                        operationCode: codeToString(req.opCode!),
                        ...getStatisticsFromCommonArguments(data),
                        targetNameLength: data.object.rdnSequence.length,
                        listFamily: data.listFamily,
                        prr: data.pagedResults
                            ? getStatisticsFromPagedResultsRequest(data.pagedResults)
                            : undefined,
                    }), undefined),
                    outcome: {
                        result: {
                            list: result.resultStats,
                            poq: result.poqStats,
                        },
                    },
                    foundDSE: state.foundDSE,
                };
            }
        }
        else if (compareCode(req.opCode, read["&operationCode"]!)) {
            // #region service-admin
            {
                const argument = _decode_ReadArgument(reqData.argument);
                const data = getOptionallyProtectedValue(argument);
                state.effectiveFamilyReturn = data.selection?.familyReturn;
                state.effectiveServiceControls = data.serviceControls?.options;
                const equivalent_search_data = new SearchArgumentData(
                    data.object,
                    SearchArgumentData_subset_baseObject,
                    undefined,
                    undefined,
                    data.selection,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    data.serviceControls,
                    data.securityParameters, // NOTE: This will have the wrong opcode...
                    data.requestor,
                    data.operationProgress,
                    data.aliasedRDNs,
                    data.criticalExtensions,
                    data.referenceType,
                    data.entryOnly,
                    data.exclusions,
                    data.nameResolveOnMaster,
                    data.operationContexts,
                    data.familyGrouping,
                );
                const signErrors: boolean = (
                    (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed)
                    && (assn.authorizedForSignedErrors)
                );
                const search_rule = await searchRuleCheckProcedure_i(
                    ctx,
                    assn,
                    state,
                    state.foundDSE,
                    equivalent_search_data,
                    signErrors,
                );
                if (search_rule) {
                    update_operation_dispatcher_state_with_search_rule(equivalent_search_data, state, search_rule);
                }
            }
            // #endregion service-admin
            const outcome = await doRead(ctx, assn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: signDSPResult
                    ? signChainedResult(ctx, outcome.result)
                    : outcome.result,
                request: {
                    ...outcome.stats.request,
                    operationCode: codeToString(req.opCode),
                },
                outcome: {
                    ...outcome.stats.outcome,
                },
                foundDSE: state.foundDSE,
            };
        }
        else if (compareCode(req.opCode, removeEntry["&operationCode"]!)) {
            const outcome = await doRemoveEntry(ctx, assn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: signDSPResult
                    ? signChainedResult(ctx, outcome.result)
                    : outcome.result,
                request: {
                    ...outcome.stats.request,
                    operationCode: codeToString(req.opCode),
                },
                outcome: {
                    ...outcome.stats.outcome,
                },
                foundDSE: state.foundDSE,
            };
        }
        else if (compareCode(req.opCode, search["&operationCode"]!)) {
            const argument = _decode_SearchArgument(reqData.argument);
            const data = getOptionallyProtectedValue(argument);
            const signErrors: boolean = (
                (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed)
                && (assn.authorizedForSignedErrors)
            );
            const target = state.chainingArguments.targetObject ?? data.baseObject.rdnSequence;
            const nameResolutionPhase = reqData.chainedArgument.operationProgress?.nameResolutionPhase
                ?? ChainingArguments._default_value_for_operationProgress.nameResolutionPhase;
            const requestStats: RequestStatistics | undefined = failover(() => ({
                operationCode: codeToString(req.opCode!),
                ...getStatisticsFromCommonArguments(data),
                targetNameLength: data.baseObject.rdnSequence.length,
                subset: (data.subset !== undefined)
                    ? Number(data.subset)
                    : undefined,
                filter: data.filter
                    ? getFilterStatistics(data.filter)
                    : undefined,
                searchAliases: data.searchAliases,
                eis: data.selection
                    ? getEntryInformationSelectionStatistics(data.selection)
                    : undefined,
                prr: data.pagedResults
                    ? getStatisticsFromPagedResultsRequest(data.pagedResults)
                    : undefined,
                matchedValuesOnly: data.matchedValuesOnly,
                extendedFilter: data.extendedFilter
                    ? getFilterStatistics(data.extendedFilter)
                    : undefined,
                checkOverspecified: data.checkOverspecified,
                // relaxation
                extendedArea: (data.extendedArea !== undefined)
                    ? Number(data.extendedArea)
                    : undefined,
                hierarchySelections: data.hierarchySelections
                    ? Array.from(data.hierarchySelections)
                    : undefined,
                searchControlOptions: data.searchControlOptions
                    ? Array.from(data.searchControlOptions)
                    : undefined,
                joinArguments: data.joinArguments
                    ? data.joinArguments.map(getJoinArgumentStatistics)
                    : undefined,
                joinType: data.joinType,
            }), undefined);

            const chainingResults = new ChainingResults(
                undefined,
                undefined,
                createSecurityParameters(
                    ctx,
                    signDSPResult,
                    assn.boundNameAndUID?.dn,
                    search["&operationCode"],
                ),
                undefined,
            );
            const initialSearchState: SearchState = {
                results: [],
                resultSets: [],
                chaining: chainingResults,
                depth: 0,
                excludedById: new Set(),
                matching_rule_substitutions: new Map(),
                effectiveFilter: data.extendedFilter ?? data.filter,
                notification: [],
                effectiveEntryLimit: MAX_RESULTS,
            };

            const use_search_rule_check_ii: boolean = (nameResolutionPhase === completed);
            if (use_search_rule_check_ii) {
                await searchRuleCheckProcedure_ii(ctx, assn, state, state.foundDSE, data, signErrors);
            } else {
                const search_rule = await searchRuleCheckProcedure_i(
                    ctx,
                    assn,
                    state,
                    state.foundDSE,
                    data,
                    signErrors,
                );
                if (search_rule) {
                    update_search_state_with_search_rule(data, initialSearchState, search_rule);
                }
            }
            const noSystemRelaxation: boolean = (data.searchControlOptions?.[SearchControlOptions_noSystemRelaxation] === TRUE_BIT);
            const user_rp = data.relaxation;
            const dsa_rp = initialSearchState.governingSearchRule?.relaxation;
            const rp = noSystemRelaxation
                ? user_rp
                : (user_rp ?? dsa_rp);
            if (rp && initialSearchState.effectiveFilter) {
                initialSearchState.effectiveFilter = normalizeFilter(initialSearchState.effectiveFilter);
            }

            const includeAllAreas: boolean = Boolean(data.searchControlOptions?.[SearchControlOptions_includeAllAreas]);
            if (state.chainingArguments.chainedRelaxation) {
                await apply_mr_mapping(
                    ctx,
                    assn,
                    initialSearchState,
                    target,
                    state.chainingArguments.chainedRelaxation,
                    true,
                    signErrors,
                    state.chainingArguments.aliasDereferenced ?? ChainingArguments._default_value_for_aliasDereferenced,
                    data.extendedArea,
                    includeAllAreas,
                    new Set(),
                );
            }
            else if (user_rp?.basic) {
                let pretendMatchingRuleMapping: Map<IndexableOID, OBJECT_IDENTIFIER> = new Map();
                if (dsa_rp?.basic && !noSystemRelaxation) {
                    const [, new_mr_to_old] = await apply_mr_mapping(
                        ctx,
                        assn,
                        initialSearchState,
                        target,
                        dsa_rp.basic,
                        true,
                        signErrors,
                        state.chainingArguments.aliasDereferenced
                            ?? ChainingArguments._default_value_for_aliasDereferenced,
                        data.extendedArea,
                        includeAllAreas,
                        new Set(),
                    );
                    pretendMatchingRuleMapping = new_mr_to_old;
                }
                await apply_mr_mapping(
                    ctx,
                    assn,
                    initialSearchState,
                    target,
                    user_rp.basic,
                    true,
                    signErrors,
                    state.chainingArguments.aliasDereferenced
                        ?? ChainingArguments._default_value_for_aliasDereferenced,
                    data.extendedArea,
                    includeAllAreas,
                    new Set(),
                    pretendMatchingRuleMapping,
                );
            } else if (dsa_rp?.basic) {
                await apply_mr_mapping(
                    ctx,
                    assn,
                    initialSearchState,
                    target,
                    dsa_rp.basic,
                    true,
                    signErrors,
                    state.chainingArguments.aliasDereferenced ?? ChainingArguments._default_value_for_aliasDereferenced,
                    data.extendedArea,
                    includeAllAreas,
                    new Set(),
                );
            }
            let searchState = await search_procedures(
                ctx,
                assn,
                state,
                argument,
                reqData,
                signErrors,
                signDSPResult,
                nameResolutionPhase,
                initialSearchState,
            );

            /**
             * We only provide relaxation or tightening if this DSA is the
             * performing DSA for the base object of the search request, which
             * means that the `nameResolutionPhase` will not be `completed`.
             * (It gets set only prior to chaining or if manageDSAIT is set.)
             *
             * I don't think the specifications mention it, but Meerkat DSA does
             * this because each DSA servicing part of a search request may
             * themselves generate multiple subrequests as a result of
             * relaxation, which could balloon into a nearly infinite number of
             * subrequests as each participating DSA individually attempts to
             * fulfill the relaxation policy's `minimum`.
             *
             * As such, we determine if this search operation is for the base
             * object or not based on the `nameResolutionPhase`.
             */
            const provide_relaxation_or_tightening: boolean = (nameResolutionPhase !== completed);
            let results_count = getCurrentNumberOfResults(searchState);
            let needs_relaxation: boolean = !!(rp && (results_count < (rp.minimum ?? 1)));
            let needs_tightening: boolean = !!(rp?.maximum && (results_count > rp.maximum));
            if (needs_relaxation && needs_tightening) {
                throw new errors.MistypedArgumentError(
                    ctx.i18n.t("err:relaxation_max_lt_min", {
                        min: rp?.minimum ?? 1,
                        max: rp?.maximum ?? Infinity,
                    }),
                );
            }
            if (provide_relaxation_or_tightening && needs_relaxation && rp?.relaxations?.length) {
                for (const [i, relaxation] of rp.relaxations.slice(0, ctx.config.maxRelaxationsOrTightenings).entries()) {
                    const [mapped_attrs] = await apply_mr_mapping(
                        ctx,
                        assn,
                        searchState,
                        target,
                        relaxation,
                        true,
                        signErrors,
                        state.chainingArguments.aliasDereferenced ?? ChainingArguments._default_value_for_aliasDereferenced,
                        data.extendedArea,
                        includeAllAreas,
                        new Set(),
                    );
                    const search_rule_relaxation = searchState.governingSearchRule?.relaxation?.relaxations?.[i];
                    if (search_rule_relaxation && data.relaxation) { // If !data.relaxation, the relaxation was already applied.
                        await apply_mr_mapping(
                            ctx,
                            assn,
                            searchState,
                            target,
                            search_rule_relaxation,
                            true,
                            signErrors,
                            state.chainingArguments.aliasDereferenced ?? ChainingArguments._default_value_for_aliasDereferenced,
                            data.extendedArea,
                            includeAllAreas,
                            mapped_attrs,
                        );
                    }
                    // Reset some aspects of the search state, while leaving others.
                    searchState.depth = 0;
                    searchState.poq = undefined;
                    searchState.paging = undefined;
                    state.SRcontinuationList.length = 0; // The only aspect of ODS that gets modified by search.
                    searchState.results.length = 0;
                    searchState.resultSets.length = 0;
                    searchState.excludedById.clear();

                    // In this block, we update the chaining args so subrequests relax correctly.
                    { // We do not have to do this for tightening, since the solution is to just not chain at all.
                        const mr_substitutions: MRSubstitution[] = [];
                        for (const [attr_oid, mr_oid] of searchState.matching_rule_substitutions.entries()) {
                            mr_substitutions.push(new MRSubstitution(
                                ObjectIdentifier.fromString(attr_oid),
                                undefined,
                                mr_oid,
                            ));
                        }
                        state.chainingArguments = cloneChainingArgs(state.chainingArguments, {
                            chainedRelaxation: new MRMapping(
                                undefined,
                                mr_substitutions,
                            ),
                        });
                    }

                    searchState = await search_procedures(
                        ctx,
                        assn,
                        state,
                        argument,
                        reqData,
                        signErrors,
                        signDSPResult,
                        nameResolutionPhase,
                        searchState,
                    );
                    results_count = getCurrentNumberOfResults(searchState);
                    needs_relaxation = !!(rp && (results_count < (rp.minimum ?? 1)));
                    if (!needs_relaxation) {
                        // If we have already returned a satisfactory number of results, return.
                        break;
                    }
                }
            }
            else if (provide_relaxation_or_tightening && needs_tightening && rp?.tightenings?.length) {
                for (const [i, tightening] of rp.tightenings.slice(0, ctx.config.maxRelaxationsOrTightenings).entries()) {
                    const [mapped_attrs] = await apply_mr_mapping(
                        ctx,
                        assn,
                        searchState,
                        target,
                        tightening,
                        false,
                        signErrors,
                        state.chainingArguments.aliasDereferenced ?? ChainingArguments._default_value_for_aliasDereferenced,
                        data.extendedArea,
                        includeAllAreas,
                        new Set(),
                    );
                    const search_rule_relaxation = searchState.governingSearchRule?.relaxation?.tightenings?.[i];
                    if (search_rule_relaxation && data.relaxation) {  // If !data.relaxation, the relaxation was already applied.
                        await apply_mr_mapping(
                            ctx,
                            assn,
                            searchState,
                            target,
                            search_rule_relaxation,
                            true,
                            signErrors,
                            state.chainingArguments.aliasDereferenced ?? ChainingArguments._default_value_for_aliasDereferenced,
                            data.extendedArea,
                            includeAllAreas,
                            mapped_attrs,
                        );
                    }
                    // Reset some aspects of the search state, while leaving others.
                    searchState.results.length = 0;
                    searchState.resultSets.length = 0;
                    searchState.depth = 0;
                    searchState.poq = undefined;
                    searchState.paging = undefined;
                    state.SRcontinuationList.length = 0; // The only aspect of ODS that gets modified by search.
                    searchState.excludedById.clear(); // Only for tightening do you clear this.
                    searchState = await search_procedures(
                        ctx,
                        assn,
                        state,
                        argument,
                        reqData,
                        signErrors,
                        signDSPResult,
                        nameResolutionPhase,
                        searchState,
                    );
                    results_count = getCurrentNumberOfResults(searchState);
                    needs_tightening = !!(rp?.maximum && (results_count > rp.maximum));
                    if (!needs_tightening) {
                        // If we have already returned a satisfactory number of results, return.
                        break;
                    }
                }
            }

            if (searchState.matching_rule_substitutions.size > 0) {
                searchState.notification.push(new Attribute(
                    appliedRelaxation["&id"],
                    Array.from(searchState.matching_rule_substitutions.keys())
                        .map((oid) => appliedRelaxation.encoderFor["&Type"]!(ObjectIdentifier.fromString(oid), DER)),
                ));
            }

            const result = await mergeSortAndPageSearch(ctx, assn, state, searchState, data);
            const opcr: OPCR = {
                unsigned: new Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1(
                    new ChainingResults(
                        undefined,
                        undefined,
                        createSecurityParameters(
                            ctx,
                            signDSPResult,
                            assn.boundNameAndUID?.dn,
                            search["&operationCode"],
                        ),
                        undefined,
                    ),
                    result.encodedSearchResult,
                ),
            };
            return {
                invokeId: req.invokeId,
                opCode: search["&operationCode"]!,
                result: signDSPResult
                    ? signChainedResult(ctx, opcr)
                    : opcr,
                request: requestStats,
                outcome: {
                    result: {
                        search: result.resultStats,
                        poq: result.poqStats
                    },
                },
                foundDSE: state.foundDSE,
            };
        }
        throw new errors.UnknownOperationError();
    }

    /**
     * @summary Dispatch a Directory System Protocol (DSP) request internally
     * @description
     *
     * This function calls the Find DSE procedure defined in ITU Recommendation
     * X.518 (2016), Section 18.3.1. If the target entry is not found, this
     * function calls the Name Resolution Continuation Reference procedure
     * defined in ITU Recommendation X.518 (2016), Section 20.4.1 to attempt to
     * continue the request in other DSAs. If the request is chained to another
     * DSA, this DSA simply returns the chained result. If a suitable DSE can be
     * found locally, this DSA will begin operation evaluation against that DSE.
     * If the target object cannot be found, an error is thrown accordingly.
     *
     * @param ctx The context object
     * @param assn The client association
     * @param req The request
     * @param preparedRequest The chaining arguments and original argument
     * @param local Whether this request was generated internally by Meerkat DSA
     * @param signDSPResult Whether the DSP result should be signed
     * @param signErrors Whether to cryptographically sign errors
     * @param commonArgs CommonArguments, if applicable to the DAP operation.
     *
     * @public
     * @static
     * @function
     * @async
     * @memberof OperationDispatcher
     */
    private static async dispatchPreparedDSPRequest (
        ctx: MeerkatContext,
        assn: ClientAssociation,
        req: Request,
        preparedRequest: OPTIONALLY_PROTECTED<Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1>,
        local: boolean,
        signDSPResult: boolean,
        signErrors: boolean,
        commonArgs?: CommonArguments,
    ): Promise<OperationDispatcherReturn> {
        assert(req.opCode);
        assert(req.argument);
        const reqData = getOptionallyProtectedValue(preparedRequest);
        const nrp = reqData.chainedArgument.operationProgress?.nameResolutionPhase;
        if ((assn instanceof DSPAssociation) && (nrp !== OperationProgress_nameResolutionPhase_completed)) {
            ctx.log.debug(ctx.i18n.t("log:resolving_name", {
                opid: reqData.chainedArgument.operationIdentifier ?? "ABSENT",
                dn: stringifyDN(ctx, reqData.chainedArgument.targetObject ?? []).slice(0, 256),
            }));
        }
        if (compareCode(req.opCode, abandon["&operationCode"]!)) {
            const result = await doAbandon(ctx, assn, reqData);
            const opcr: OPCR = {
                unsigned: new Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1(
                    new ChainingResults(
                        undefined,
                        undefined,
                        createSecurityParameters(
                            ctx,
                            signDSPResult,
                            assn.boundNameAndUID?.dn,
                            abandon["&operationCode"],
                        ),
                        undefined,
                    ),
                    result.result,
                ),
            };
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: signDSPResult
                    ? signChainedResult(ctx, opcr)
                    : opcr,
                request: {
                    operationCode: codeToString(req.opCode),
                },
                outcome: {
                    result: {},
                },
            };
        }
        const targetObject = getSoughtObjectFromRequest({
            ...req,
            argument: reqData.argument,
        }, reqData.chainedArgument);
        if (!targetObject) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:no_discernable_target_object"),
                new SecurityErrorData(
                    SecurityProblem_noInformation,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        id_errcode_securityError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    reqData.chainedArgument.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        const chainingResults = new ChainingResults(
            undefined,
            undefined,
            createSecurityParameters(
                ctx,
                signDSPResult,
                assn.boundNameAndUID?.dn,
                req.opCode,
            ),
            undefined,
        );
        const state: OperationDispatcherState = {
            NRcontinuationList: [],
            SRcontinuationList: [],
            admPoints: [],
            referralRequests: [],
            emptyHierarchySelect: false,
            invokeId: req.invokeId,
            operationCode: req.opCode,
            operationArgument: reqData.argument,
            chainingArguments: reqData.chainedArgument,
            chainingResults,
            foundDSE: ctx.dit.root,
            entrySuitable: false,
            partialName: false,
            rdnsResolved: 0,
            aliasesEncounteredById: new Set(),
        };
        await findDSE(
            ctx,
            assn,
            ctx.dit.root,
            targetObject,
            state,
            commonArgs,
        );
        if (!state.entrySuitable) {
            const scoBitField = commonArgs?.serviceControls?.options;
            const chainingProhibited = (
                (scoBitField?.[chainingProhibitedBit] === TRUE_BIT)
                || (scoBitField?.[manageDSAITBit] === TRUE_BIT)
            );
            const partialNameResolution = (scoBitField?.[partialNameResolutionBit] === TRUE_BIT);
            const nrcrResult = await nrcrProcedure(
                ctx,
                assn,
                reqData,
                state,
                chainingProhibited,
                partialNameResolution,
                signErrors,
            );
            if ("invoke_id" in nrcrResult) {
                throw new errors.ChainedError(
                    ctx.i18n.t("err:chained_error"),
                    nrcrResult.parameter,
                    nrcrResult.code,
                );
            }
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                foundDSE: state.foundDSE,
                result: nrcrResult,
            };
        }
        if (
            state.entrySuitable
            && (targetObject.length > 0)
            // If we are performing an operation that could invalidate the
            // MRU vertex cache, we cannot save the MRU vertex.
            // This is critical if you delete an entry, then recreate it.
            // The cached one will have the database ID of the old one.
            && !compareCode(state.operationCode, removeEntry["&operationCode"]!)
            && !compareCode(state.operationCode, modifyDN["&operationCode"]!)
        ) {
            assn.mostRecentVertex = {
                since: new Date(),
                path: getPathFromVersion(state.foundDSE),
            };
        }
        return OperationDispatcher.operationEvaluation(
            ctx,
            state,
            assn,
            req,
            reqData,
            local,
        );
    }

    /**
     * @summary Dispatch a Directory Access Protocol (DAP) request internally
     * @description
     *
     * This function validates a Directory Access Protocol (DAP) request,
     * "hydrates" it with chaining arguments per ITU Recommendation X.518
     * (2016), Section 17.3.3.1, to make it as though it were a Directory System
     * Protocol (DSP) request, and then internally dispatches it as though
     * this DSA had received the Directory System Protocol (DSP) request in the
     * first place.
     *
     * @param ctx The context object
     * @param assn The client association
     * @param req The request
     *
     * @public
     * @static
     * @function
     * @async
     * @memberof OperationDispatcher
     */
    public static async dispatchDAPRequest (
        ctx: MeerkatContext,
        assn: ClientAssociation,
        req: Request,
    ): Promise<OperationDispatcherReturn> {
        const [ preparedRequest, commonArgs ] = await requestValidationProcedure(
            ctx,
            assn,
            req,
            false,
            assn.authLevel,
            assn.boundNameAndUID?.uid,
        );
        const reqData = getOptionallyProtectedValue(preparedRequest);
        /**
         * The DSP result should not be signed because only the contained DAP
         * result will be used by the DAP association handler; the signature
         * would not be useful.
         */
        const signDSPResult: boolean = false;
        const signErrors: boolean = (reqData.chainedArgument.securityParameters?.errorProtection === ErrorProtectionRequest_signed);
        return this.dispatchPreparedDSPRequest(
            ctx,
            assn,
            req,
            preparedRequest,
            false,
            signDSPResult,
            signErrors,
            commonArgs,
        );
    }

    /**
     * @summary Dispatch a Directory System Protocol (DAP) request internally
     * @description
     *
     * This function validates a Directory Access Protocol (DAP) request,
     * validates it, then internally dispatches it.
     *
     * @param ctx The context object
     * @param assn The client association
     * @param req The request
     *
     * @public
     * @static
     * @function
     * @async
     * @memberof OperationDispatcher
     */
    public static async dispatchDSPRequest (
        ctx: MeerkatContext,
        assn: DSPAssociation,
        req: Request,
    ): Promise<OperationDispatcherReturn> {
        assert(req.opCode);
        if (!("local" in req.opCode)) {
            throw new UnknownOperationError();
        }
        assert("local" in abandon["&operationCode"]!);
        /**
         * `chainedAbandon` is the one DSP operation that is not wrapped in DSP
         * parameters.
         */
        const alreadyChained: boolean = (req.opCode.local !== abandon["&operationCode"].local);
        const [ preparedRequest, commonArgs ] = await requestValidationProcedure(
            ctx,
            assn,
            req,
            alreadyChained,
            assn.authLevel,
            assn.boundNameAndUID?.uid,
        );
        const reqData = getOptionallyProtectedValue(preparedRequest);
        const signDSPResult: boolean = (
            (reqData.chainedArgument.securityParameters?.target === ProtectionRequest_signed)
            && assn.authorizedForSignedResults
        );
        const signErrors: boolean = (
            (reqData.chainedArgument.securityParameters?.errorProtection === ErrorProtectionRequest_signed)
            && assn.authorizedForSignedErrors
        );
        return this.dispatchPreparedDSPRequest(
            ctx,
            assn,
            req,
            preparedRequest,
            false,
            signDSPResult,
            signErrors,
            commonArgs,
        );
    }

    /**
     * @summary Dispatch a local search operation
     * @description
     *
     * This function exists essentially to cut down on encoding and decoding
     * search arguments repeatedly, and to bypass validation, since calls to
     * this function will be assumed to have originated internally.
     *
     * @param ctx The context object
     * @param state The operation dispatcher state
     * @param assn The client association
     * @param invokeId The invoke ID of the operation
     * @param argument The search operation argument
     * @param chaining The chaining arguments
     * @param signErrors Whether to cryptographically sign errors
     *
     * @private
     * @static
     * @function
     * @async
     */
    private static async localSearchOperationEvaluation (
        ctx: MeerkatContext,
        state: OperationDispatcherState,
        assn: ClientAssociation,
        invokeId: InvokeId,
        argument: SearchArgument,
        chaining: ChainingArguments,
        signErrors: boolean,
    ): Promise<SearchResultOrError> {
        const data = getOptionallyProtectedValue(argument);
        const searchResponse: SearchState = {
            results: [],
            resultSets: [],
            chaining: state.chainingResults,
            depth: 0,
            excludedById: new Set(),
            matching_rule_substitutions: new Map(),
            notification: [],
            effectiveEntryLimit: MAX_RESULTS,
        };
        await relatedEntryProcedure(
            ctx,
            assn,
            state,
            searchResponse,
            argument,
            chaining,
            signErrors,
        );
        const nameResolutionPhase = chaining.operationProgress?.nameResolutionPhase
            ?? ChainingArguments._default_value_for_operationProgress.nameResolutionPhase;
        if (nameResolutionPhase === completed) { // Search (II)
            await search_ii(ctx, assn, state, argument, searchResponse);
        } else { // Search (I)
            // Only Search (I) results in results merging.
            await search_i(ctx, assn, state, argument, searchResponse);
        }
        const postMergeState = await resultsMergingProcedureForSearch(
            ctx,
            assn,
            argument,
            searchResponse,
            state,
        );
        const result: SearchResult = (nameResolutionPhase === completed)
            ? { // Only Search (I) results in results merging.
                unsigned: {
                    uncorrelatedSearchInfo: [
                        {
                            unsigned: {
                                searchInfo: new SearchResultData_searchInfo(
                                    {
                                        rdnSequence: getDistinguishedName(state.foundDSE),
                                    },
                                    searchResponse.results,
                                    searchResponse.poq,
                                    undefined,
                                    [],
                                    createSecurityParameters(
                                        ctx,
                                        false,
                                        assn.boundNameAndUID?.dn,
                                        search["&operationCode"],
                                    ),
                                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                                    state.chainingArguments.aliasDereferenced,
                                    undefined,
                                ),
                            },
                        },
                        ...searchResponse.resultSets,
                    ],
                },
            }
            : _decode_SearchResult(
                (await mergeSortAndPageSearch(ctx, assn, state, postMergeState, data)).encodedSearchResult);
        return {
            invokeId,
            opCode: search["&operationCode"]!,
            chaining: searchResponse.chaining,
            result,
        };
    }

    /**
     * @summary Dispatch a local search operation
     * @description
     *
     * This function exists essentially to cut down on encoding and decoding
     * search arguments repeatedly, and to bypass validation, since calls to
     * this function will be assumed to have originated internally.
     *
     * @param ctx The context object
     * @param assn The client association
     * @param invokeId The invoke ID of the operation
     * @param argument The search argument
     * @param chaining The chaining arguments
     *
     * @public
     * @static
     * @function
     * @async
     */
    public static async dispatchLocalSearchDSPRequest (
        ctx: MeerkatContext,
        assn: ClientAssociation,
        invokeId: InvokeId,
        argument: SearchArgument,
        chaining: ChainingArguments,
    ): Promise<SearchResultOrError> {
        // Request validation not needed.
        const data = getOptionallyProtectedValue(argument);
        const signErrors: boolean = (
            (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed)
            && (assn.authorizedForSignedErrors)
        );
        const encodedArgument = _encode_SearchArgument(argument, DER);
        const targetObject = chaining.relatedEntry // The specification is not clear of what to do for targetObject.
            ? data.joinArguments?.[Number(chaining.relatedEntry)]?.joinBaseObject.rdnSequence
            : chaining.targetObject ?? data.baseObject.rdnSequence;
        if (!targetObject) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:no_discernable_target_object"),
                new SecurityErrorData(
                    SecurityProblem_noInformation,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        id_errcode_securityError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    chaining.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        const chainingResults = new ChainingResults(
            undefined,
            undefined,
            createSecurityParameters(
                ctx,
                false, // Not to be signed, since this is a local DSP request.
                assn.boundNameAndUID?.dn,
                search["&operationCode"],
            ),
            undefined,
        );
        const state: OperationDispatcherState = {
            NRcontinuationList: [],
            SRcontinuationList: [],
            admPoints: [],
            referralRequests: [],
            emptyHierarchySelect: false,
            invokeId: invokeId,
            operationCode: search["&operationCode"]!,
            operationArgument: encodedArgument,
            chainingArguments: chaining,
            chainingResults,
            foundDSE: ctx.dit.root,
            entrySuitable: false,
            partialName: false,
            rdnsResolved: 0,
            aliasesEncounteredById: new Set(),
        };
        await findDSE(
            ctx,
            assn,
            ctx.dit.root,
            targetObject,
            state,
            data,
        );
        if (!state.entrySuitable) {
            const serviceControlOptions = data.serviceControls?.options;
            const chainingProhibited = (
                (serviceControlOptions?.[chainingProhibitedBit] === TRUE_BIT)
                || (serviceControlOptions?.[manageDSAITBit] === TRUE_BIT)
            );
            const partialNameResolution = (serviceControlOptions?.[partialNameResolutionBit] === TRUE_BIT);
            const nrcrResult = await nrcrProcedure(
                ctx,
                assn,
                new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                    state.chainingArguments,
                    encodedArgument,
                ),
                state,
                chainingProhibited,
                partialNameResolution,
                signErrors,
            );
            if ("invoke_id" in nrcrResult) {
                throw new errors.ChainedError(
                    ctx.i18n.t("err:chained_error"),
                    nrcrResult.parameter,
                    nrcrResult.code,
                );
            } else {
                const unprotectedResult = getOptionallyProtectedValue(nrcrResult);
                const searchResult = _decode_SearchResult(unprotectedResult.result);
                return {
                    invokeId,
                    opCode: search["&operationCode"]!,
                    chaining: unprotectedResult.chainedResult,
                    result: searchResult,
                };
            }
        }
        return OperationDispatcher.localSearchOperationEvaluation(
            ctx,
            state,
            assn,
            invokeId,
            argument,
            chaining,
            signErrors,
        );
    }

    /**
     * @summary Dispatch a local read operation
     * @description
     *
     * This function exists for the DSA to universally find an entry--when
     * merely searching for a local DSE would be insufficient.
     *
     * @param ctx The context object
     * @param argument The read argument
     * @param timeLimit The number of seconds the request is permitted to take.
     *
     * @public
     * @static
     * @function
     * @async
     */
     public static async dispatchLocalReadRequest (
        ctx: MeerkatContext,
        argument: ReadArgument,
    ): ReturnType<typeof doRead> {
        const invokeId: InvokeId = { // TODO: Refactor.
            present: randomInt(1, 10_000_000),
        };
        // Request validation not needed.
        const data = getOptionallyProtectedValue(argument);
        const signErrors: boolean = (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed);
        const encodedArgument = _encode_ReadArgument(argument, BER);
        const targetObject = data.object.rdnSequence;
        const timeLimitDate = addSeconds(new Date(), data.serviceControls?.timeLimit
            ? Number(data.serviceControls.timeLimit)
            : 5000);
        // TODO: Log iid, target, timeLimit
        const chainingResults = new ChainingResults(
            undefined,
            undefined,
            createSecurityParameters(
                ctx,
                false, // Not to be signed, since this is a locally-issued request.
                undefined,
                read["&operationCode"],
            ),
            undefined,
        );
        const state: OperationDispatcherState = {
            NRcontinuationList: [],
            SRcontinuationList: [],
            admPoints: [],
            referralRequests: [],
            emptyHierarchySelect: false,
            invokeId: invokeId,
            operationCode: read["&operationCode"]!,
            operationArgument: encodedArgument, // Why is this needed?
            chainingArguments: new ChainingArguments(
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                data.object.rdnSequence,
                undefined,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                {
                    generalizedTime: timeLimitDate,
                },
            ),
            chainingResults,
            foundDSE: ctx.dit.root,
            entrySuitable: false,
            partialName: false,
            rdnsResolved: 0,
            aliasesEncounteredById: new Set(),
        };
        await findDSE(
            ctx,
            undefined,
            ctx.dit.root,
            targetObject,
            state,
            data,
        );
        if (!state.entrySuitable) {
            const serviceControlOptions = data.serviceControls?.options;
            const chainingProhibited = (
                (serviceControlOptions?.[chainingProhibitedBit] === TRUE_BIT)
                || (serviceControlOptions?.[manageDSAITBit] === TRUE_BIT)
            );
            const partialNameResolution = (serviceControlOptions?.[partialNameResolutionBit] === TRUE_BIT);
            const nrcrResult = await nrcrProcedure(
                ctx,
                undefined,
                new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                    state.chainingArguments,
                    encodedArgument,
                ),
                state,
                chainingProhibited,
                partialNameResolution,
                signErrors,
            );
            if ("invoke_id" in nrcrResult) {
                throw new errors.ChainedError(
                    ctx.i18n.t("err:chained_error"),
                    nrcrResult.parameter,
                    nrcrResult.code,
                );
            } else {
                return {
                    result: nrcrResult,
                    stats: {},
                };
            }
        }
        return doRead(ctx, undefined, state);
    }


/**
     * @summary Dispatch a local read operation
     * @description
     *
     * This function exists for the DSA to compare passwords per the
     *
     * @param ctx The context object
     * @param argument The read argument
     * @param timeLimit The number of seconds the request is permitted to take.
     *
     * @public
     * @static
     * @function
     * @async
     */
    public static async dispatchLocalCompareRequest (
        ctx: MeerkatContext,
        argument: CompareArgument,
    ): ReturnType<typeof doCompare> {
        const invokeId: InvokeId = { // TODO: Refactor.
            present: randomInt(1, 10_000_000),
        };
        // Request validation not needed.
        const data = getOptionallyProtectedValue(argument);
        const signErrors: boolean = (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed);
        const encodedArgument = _encode_CompareArgument(argument, BER);
        const targetObject = data.object.rdnSequence;
        const timeLimitDate = addSeconds(new Date(), data.serviceControls?.timeLimit
            ? Number(data.serviceControls.timeLimit)
            : 5000);
        // TODO: Log iid, target, timeLimit
        const chainingResults = new ChainingResults(
            undefined,
            undefined,
            createSecurityParameters(
                ctx,
                false, // Not to be signed, since this is a locally-issued request.
                undefined,
                compare["&operationCode"],
            ),
            undefined,
        );
        const state: OperationDispatcherState = {
            NRcontinuationList: [],
            SRcontinuationList: [],
            admPoints: [],
            referralRequests: [],
            emptyHierarchySelect: false,
            invokeId: invokeId,
            operationCode: compare["&operationCode"]!,
            operationArgument: encodedArgument, // Why is this needed?
            chainingArguments: new ChainingArguments(
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                data.object.rdnSequence,
                undefined,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                {
                    generalizedTime: timeLimitDate,
                },
            ),
            chainingResults,
            foundDSE: ctx.dit.root,
            entrySuitable: false,
            partialName: false,
            rdnsResolved: 0,
            aliasesEncounteredById: new Set(),
        };
        await findDSE(
            ctx,
            undefined,
            ctx.dit.root,
            targetObject,
            state,
            data,
        );
        if (!state.entrySuitable) {
            const serviceControlOptions = data.serviceControls?.options;
            const chainingProhibited = (
                (serviceControlOptions?.[chainingProhibitedBit] === TRUE_BIT)
                || (serviceControlOptions?.[manageDSAITBit] === TRUE_BIT)
            );
            const partialNameResolution = (serviceControlOptions?.[partialNameResolutionBit] === TRUE_BIT);
            const nrcrResult = await nrcrProcedure(
                ctx,
                undefined,
                new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                    state.chainingArguments,
                    encodedArgument,
                ),
                state,
                chainingProhibited,
                partialNameResolution,
                signErrors,
            );
            if ("invoke_id" in nrcrResult) {
                throw new errors.ChainedError(
                    ctx.i18n.t("err:chained_error"),
                    nrcrResult.parameter,
                    nrcrResult.code,
                );
            } else {
                return {
                    result: nrcrResult,
                    stats: {},
                };
            }
        }
        return doCompare(ctx, undefined, state);
    }

}

export default OperationDispatcher;
