import type {
    ClientAssociation,
    Vertex,
    WithRequestStatistics,
    WithOutcomeStatistics,
    RequestStatistics,
    OPCR,
} from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import type DSPAssociation from "../dsp/DSPConnection";
import type { Request } from "@wildboar/x500/src/lib/types/Request";
import {
    ChainingArguments,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import {
    _decode_ListArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgument.ta";
import {
    SearchArgument,
    _decode_SearchArgument,
    _encode_SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
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
import { ASN1TagClass, TRUE_BIT, ASN1Element } from "asn1-ts";
import {
    ServiceControlOptions_chainingProhibited as chainingProhibitedBit,
    ServiceControlOptions_partialNameResolution as partialNameResolutionBit,
    ServiceControlOptions_manageDSAIT as manageDSAITBit,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import { compareCode } from "@wildboar/x500/src/lib/utils/compareCode";
import { abandon } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandon.oa";
import { administerPassword } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/administerPassword.oa";
import { addEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa";
import { changePassword } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/changePassword.oa";
import { compare } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/compare.oa";
import { modifyDN } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyDN.oa";
import { modifyEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyEntry.oa";
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
import search_i from "./search_i";
import search_ii from "./search_ii";
import resultsMergingProcedureForList from "./resultsMergingProcedureForList";
import resultsMergingProcedureForSearch from "./resultsMergingProcedureForSearch";
import {
    OperationProgress_nameResolutionPhase_completed as completed,
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
import emptyChainingResults from "../x500/emptyChainingResults";
import mergeSortAndPageSearch from "./mergeSortAndPageSearch";
import mergeSortAndPageList from "./mergeSortAndPageList";
import { SearchResultData_searchInfo } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResultData-searchInfo.ta";
import getDistinguishedName from "../x500/getDistinguishedName";

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
        if (compareCode(req.opCode, addEntry["&operationCode"]!)) {
            const outcome = await doAddEntry(ctx, assn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: outcome.result,
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
                result: outcome.result,
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
                result: outcome.result,
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
                result: outcome.result,
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
                result: outcome.result,
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
            const outcome = await doModifyEntry(ctx, assn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: outcome.result,
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
            // Automatically returns NULL no matter what, because Meerkat DSA
            // will not issue ldapTransport requests. It will just make LDAP
            // requests or the equivalent DAP requests.
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
                    result: outcome.result,
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
                    response,
                    local,
                    state.NRcontinuationList,
                    state.SRcontinuationList,
                );
                const result = await mergeSortAndPageList(ctx, assn, state, data, postMergeState);
                return {
                    invokeId: req.invokeId,
                    opCode: req.opCode,
                    result: {
                        unsigned: new Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1(
                            emptyChainingResults(),
                            result.encodedListResult,
                        ),
                    },
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
            const outcome = await doRead(ctx, assn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: outcome.result,
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
                result: outcome.result,
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
                    assn.boundNameAndUID?.dn,
                    search["&operationCode"],
                ),
                undefined,
            );
            const searchResponse: SearchState = {
                results: [],
                resultSets: [],
                chaining: chainingResults,
                depth: 0,
                alreadyReturnedById: new Set(),
            };
            await relatedEntryProcedure(
                ctx,
                assn,
                state,
                searchResponse,
                argument,
                reqData.chainedArgument,
            );
            const nameResolutionPhase = reqData.chainedArgument.operationProgress?.nameResolutionPhase
                ?? ChainingArguments._default_value_for_operationProgress.nameResolutionPhase;
            if (nameResolutionPhase === completed) { // Search (II)
                await search_ii(
                    ctx,
                    assn,
                    state,
                    argument,
                    searchResponse,
                );
            } else { // Search (I)
                // Only Search (I) results in results merging.
                await search_i(
                    ctx,
                    assn,
                    state,
                    argument,
                    searchResponse,
                );
            }
            const postMergeState = await resultsMergingProcedureForSearch(
                ctx,
                searchResponse,
                state.NRcontinuationList,
                state.SRcontinuationList,
            );
            const result = await mergeSortAndPageSearch(ctx, assn, state, postMergeState, data);
            return {
                invokeId: req.invokeId,
                opCode: search["&operationCode"]!,
                // TODO: Sign, if requested.
                result: {
                    unsigned: new Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1(
                        emptyChainingResults(),
                        result.encodedSearchResult,
                    ),
                },
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
    private static async dispatchPreparedDSPRequest (
        ctx: MeerkatContext,
        assn: ClientAssociation,
        req: Request,
        preparedRequest: OPTIONALLY_PROTECTED<Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1>,
        local: boolean,
    ): Promise<OperationDispatcherReturn> {
        assert(req.opCode);
        assert(req.argument);
        const reqData = getOptionallyProtectedValue(preparedRequest);
        if (compareCode(req.opCode, abandon["&operationCode"]!)) {
            const result = await doAbandon(ctx, assn, reqData);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: {
                    unsigned: new Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1(
                        emptyChainingResults(),
                        result.result,
                    ),
                },
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
                        assn.boundNameAndUID?.dn,
                        undefined,
                        id_errcode_securityError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    reqData.chainedArgument.aliasDereferenced,
                    undefined,
                ),
            );
        }
        const chainingResults = emptyChainingResults();
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
        );
        if (!state.entrySuitable) {
            const serviceControls = reqData.argument.set
                .find((el) => (
                    (el.tagClass === ASN1TagClass.context)
                    && (el.tagNumber === 30)
                ))?.inner;
            const serviceControlOptions = serviceControls?.set
                .find((el) => (
                    (el.tagClass === ASN1TagClass.context)
                    && (el.tagNumber === 0)
                ))?.inner;
            const scoBitField = serviceControlOptions?.bitString;
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
            );
            if (!nrcrResult) {
                return OperationDispatcher.operationEvaluation(
                    ctx,
                    state,
                    assn,
                    req,
                    reqData,
                    local,
                );
            }
            if ("error" in nrcrResult) {
                throw new errors.ChainedError(
                    ctx.i18n.t("err:chained_error"),
                    nrcrResult.error,
                    nrcrResult.errcode,
                );
            }
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                foundDSE: state.foundDSE,
                result: nrcrResult,
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
        const preparedRequest = await requestValidationProcedure(
            ctx,
            assn,
            req,
            false,
            assn.authLevel,
            assn.boundNameAndUID?.uid,
        );
        return this.dispatchPreparedDSPRequest(
            ctx,
            assn,
            req,
            preparedRequest,
            false,
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
        const preparedRequest = await requestValidationProcedure(
            ctx,
            assn,
            req,
            true,
            assn.authLevel,
            assn.boundNameAndUID?.uid,
        );
        return this.dispatchPreparedDSPRequest(
            ctx,
            assn,
            req,
            preparedRequest,
            false,
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
    ): Promise<SearchResultOrError> {
        const data = getOptionallyProtectedValue(argument);
        const searchResponse: SearchState = {
            results: [],
            resultSets: [],
            chaining: state.chainingResults,
            depth: 0,
            alreadyReturnedById: new Set(),
        };
        await relatedEntryProcedure(
            ctx,
            assn,
            state,
            searchResponse,
            argument,
            chaining,
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
            searchResponse,
            state.NRcontinuationList,
            state.SRcontinuationList,
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
        // authLevel: AuthenticationLevel,
        // uniqueIdentifier?: UniqueIdentifier,
    ): Promise<SearchResultOrError> {
        // Request validation not needed.
        const data = getOptionallyProtectedValue(argument);
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
                        assn.boundNameAndUID?.dn,
                        undefined,
                        id_errcode_securityError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    chaining.aliasDereferenced,
                    undefined,
                ),
            );
        }
        const chainingResults = emptyChainingResults();
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
            );
            if (!nrcrResult) {
                return OperationDispatcher.localSearchOperationEvaluation(
                    ctx,
                    state,
                    assn,
                    invokeId,
                    argument,
                    chaining,
                );
            } else if ("error" in nrcrResult) {
                throw new errors.ChainedError(
                    ctx.i18n.t("err:chained_error"),
                    nrcrResult.error,
                    nrcrResult.errcode,
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
        );
    }

}

export default OperationDispatcher;
