import type { ClientConnection, Context, Vertex, WithRequestStatistics, WithOutcomeStatistics, RequestStatistics, OPCR } from "@wildboar/meerkat-types";
import type DSPConnection from "../dsp/DSPConnection";
import type { Request } from "@wildboar/x500/src/lib/types/Request";
import {
    ChainingArguments,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import {
    SearchArgument,
    _decode_SearchArgument,
    _encode_SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import {
    SearchResultData_searchInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResultData-searchInfo.ta";
import {
    SearchResult,
    _decode_SearchResult,
    _encode_SearchResult,
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
import {
    ListResult,
    _decode_ListResult,
    _encode_ListResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResult.ta";
import {
    PartialOutcomeQualifier,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PartialOutcomeQualifier.ta";
import { DER } from "asn1-ts/dist/node/functional";
import type { SearchState } from "./search_i";
import { ChainingResults } from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import type { Error_ } from "@wildboar/x500/src/lib/types/Error_";
import type { InvokeId } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import type { Code } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import {
    relatedEntryProcedure,
    RelatedEntryReturn,
} from "./relatedEntryProcedure";
import getDistinguishedName from "../x500/getDistinguishedName";
import createSecurityParameters from "../x500/createSecurityParameters";
import type { OPTIONALLY_PROTECTED } from "@wildboar/x500/src/lib/modules/EnhancedSecurity/OPTIONALLY-PROTECTED.ta";
import type {
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
import getSearchResultStatistics from "../telemetry/getSearchResultStatistics";
import getPartialOutcomeQualifierStatistics from "../telemetry/getPartialOutcomeQualifierStatistics";
import { Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 } from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import ldapRequestToDAPRequest from "../distributed/ldapRequestToDAPRequest";
import { BER } from "asn1-ts/dist/node/functional";
import failover from "../utils/failover";
import emptyChainingResults from "../x500/emptyChainingResults";

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

export
class OperationDispatcher {

    private static async operationEvaluation (
        ctx: Context,
        state: OperationDispatcherState,
        conn: ClientConnection,
        req: Request,
        reqData: Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
        local: boolean = false,
    ): Promise<OperationDispatcherReturn> {
        assert(req.opCode);
        assert(req.argument);
        const foundDN = getDistinguishedName(state.foundDSE);
        if (compareCode(req.opCode, addEntry["&operationCode"]!)) {
            const outcome = await doAddEntry(ctx, conn, state);
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
            const outcome = await doAdministerPassword(ctx, conn, state);
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
            const outcome = await doChangePassword(ctx, conn, state);
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
            const outcome = await doCompare(ctx, conn, state);
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
            const outcome = await doModifyDN(ctx, conn, state);
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
            const outcome = await doModifyEntry(ctx, conn, state);
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
            const dapRequest = ldapRequestToDAPRequest(ctx, conn, data.ldapMessage);
            if (!dapRequest) {
                throw new Error();
            }
            return OperationDispatcher.dispatchDAPRequest(
                ctx,
                conn,
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
            const nameResolutionPhase = reqData.chainedArgument.operationProgress?.nameResolutionPhase
                ?? ChainingArguments._default_value_for_operationProgress.nameResolutionPhase;
            if (nameResolutionPhase === completed) { // List (II)
                const outcome = await list_ii(ctx, conn, state, true);
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
                const response = await list_i(ctx, conn, state);
                const responseData = getOptionallyProtectedValue(response.result);
                const result = _decode_ListResult(responseData.result);
                const data = getOptionallyProtectedValue(result);
                const newData = await resultsMergingProcedureForList(
                    ctx,
                    conn,
                    data,
                    local,
                    state.NRcontinuationList,
                    state.SRcontinuationList,
                );
                const newResult: ListResult = {
                    unsigned: newData,
                };
                return {
                    invokeId: req.invokeId,
                    opCode: req.opCode,
                    result: {
                        unsigned: new Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1(
                            emptyChainingResults(),
                            _encode_ListResult(newResult, DER),
                        ),
                    },
                    request: {
                        ...response.stats.request,
                        operationCode: codeToString(req.opCode),
                    },
                    outcome: {
                        ...response.stats.outcome,
                    },
                    foundDSE: state.foundDSE,
                };
            }
        }
        else if (compareCode(req.opCode, read["&operationCode"]!)) {
            const outcome = await doRead(ctx, conn, state);
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
            const outcome = await doRemoveEntry(ctx, conn, state);
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
                    conn.boundNameAndUID?.dn,
                    search["&operationCode"],
                ),
                undefined,
            );
            const relatedEntryReturn: RelatedEntryReturn = {
                chaining: chainingResults,
                response: [],
                unexplored: [],
            };
            await relatedEntryProcedure(
                ctx,
                conn,
                state,
                relatedEntryReturn,
                argument,
                reqData.chainedArgument,
            );
            const nameResolutionPhase = reqData.chainedArgument.operationProgress?.nameResolutionPhase
                ?? ChainingArguments._default_value_for_operationProgress.nameResolutionPhase;
            if (nameResolutionPhase === completed) { // Search (II)
                const response: SearchState = {
                    results: [],
                    chaining: relatedEntryReturn.chaining,
                    depth: 0,
                };
                await search_ii(
                    ctx,
                    conn,
                    state,
                    argument,
                    response,
                );
                const localResult: SearchResult = {
                    unsigned: {
                        searchInfo: new SearchResultData_searchInfo(
                            {
                                rdnSequence: foundDN,
                            },
                            response.results,
                            (response.poq || relatedEntryReturn.unexplored.length)
                                ? new PartialOutcomeQualifier(
                                    response.poq?.limitProblem,
                                    relatedEntryReturn.unexplored,
                                    response.poq?.unavailableCriticalExtensions,
                                    response.poq?.unknownErrors,
                                    response.paging
                                        ? Buffer.from(response.paging[0], "base64")
                                        : response.poq?.queryReference,
                                    response.poq?.overspecFilter,
                                    response.poq?.notification,
                                    response.poq?.entryCount,
                                )
                                : undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                conn.boundNameAndUID?.dn,
                                search["&operationCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            undefined,
                            undefined,
                        ),
                    },
                };
                const unmergedResult: SearchResult = (relatedEntryReturn.response.length)
                    ? {
                        unsigned: {
                            uncorrelatedSearchInfo: [
                                ...relatedEntryReturn.response,
                                localResult,
                            ],
                        },
                    }
                    : localResult;
                const result = await resultsMergingProcedureForSearch(
                    ctx,
                    unmergedResult,
                    state.NRcontinuationList,
                    state.SRcontinuationList,
                );
                const unprotectedResult = getOptionallyProtectedValue(result);
                return {
                    invokeId: {
                        present: 1,
                    },
                    opCode: search["&operationCode"]!,
                    result: {
                        unsigned: new Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1(
                            emptyChainingResults(),
                            _encode_SearchResult(result, DER),
                        ),
                    },
                    request: requestStats,
                    outcome: {
                        result: failover(() => ({
                            search: getSearchResultStatistics(result),
                            poq: (
                                ("searchInfo" in unprotectedResult)
                                && unprotectedResult.searchInfo.partialOutcomeQualifier
                            )
                                ? getPartialOutcomeQualifierStatistics(unprotectedResult.searchInfo.partialOutcomeQualifier)
                                : undefined,
                        }), undefined),
                    },
                    foundDSE: state.foundDSE,
                };
            } else { // Search (I)
                // Only Search (I) results in results merging.
                const response: SearchState = {
                    results: [],
                    chaining: relatedEntryReturn.chaining,
                    depth: 0,
                };
                await search_i(
                    ctx,
                    conn,
                    state,
                    argument,
                    response,
                );
                const localResult: SearchResult = {
                    unsigned: {
                        searchInfo: new SearchResultData_searchInfo(
                            {
                                rdnSequence: foundDN,
                            },
                            response.results,
                            (response.poq || relatedEntryReturn.unexplored.length)
                                ? new PartialOutcomeQualifier(
                                    response.poq?.limitProblem,
                                    relatedEntryReturn.unexplored,
                                    response.poq?.unavailableCriticalExtensions,
                                    response.poq?.unknownErrors,
                                    response.paging
                                        ? Buffer.from(response.paging[0], "base64")
                                        : response.poq?.queryReference,
                                    response.poq?.overspecFilter,
                                    response.poq?.notification,
                                    response.poq?.entryCount,
                                )
                                : undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                conn.boundNameAndUID?.dn,
                                search["&operationCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            undefined,
                            undefined,
                        ),
                    },
                };
                const unmergedResult: SearchResult = (relatedEntryReturn.response.length)
                    ? {
                        unsigned: {
                            uncorrelatedSearchInfo: [
                                ...relatedEntryReturn.response,
                                localResult,
                            ],
                        },
                    }
                    : localResult;
                const result = await resultsMergingProcedureForSearch(
                    ctx,
                    unmergedResult,
                    state.NRcontinuationList,
                    state.SRcontinuationList,
                );
                const unprotectedResult = getOptionallyProtectedValue(result);
                return {
                    invokeId: {
                        present: 1,
                    },
                    opCode: search["&operationCode"]!,
                    result: {
                        unsigned: new Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1(
                            emptyChainingResults(),
                            _encode_SearchResult(result, DER),
                        ),
                    },
                    request: requestStats,
                    outcome: {
                        result: failover(() => ({
                            search: getSearchResultStatistics(result),
                            poq: (
                                ("searchInfo" in unprotectedResult)
                                && unprotectedResult.searchInfo.partialOutcomeQualifier
                            )
                                ? getPartialOutcomeQualifierStatistics(unprotectedResult.searchInfo.partialOutcomeQualifier)
                                : undefined,
                        }), undefined),
                    },
                    foundDSE: state.foundDSE,
                };
            }
        }
        throw new errors.UnknownOperationError();
    }

    private static async dispatchPreparedDSPRequest (
        ctx: Context,
        conn: ClientConnection,
        req: Request,
        preparedRequest: OPTIONALLY_PROTECTED<Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1>,
        local: boolean,
    ): Promise<OperationDispatcherReturn> {
        assert(req.opCode);
        assert(req.argument);
        const reqData = getOptionallyProtectedValue(preparedRequest);
        if (compareCode(req.opCode, abandon["&operationCode"]!)) {
            const result = await doAbandon(ctx, conn, reqData);
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
        const targetObject = getSoughtObjectFromRequest(req);
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
                        conn.boundNameAndUID?.dn,
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
        };
        await findDSE(
            ctx,
            conn,
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
            const chainingProhibited = (serviceControlOptions?.bitString?.[chainingProhibitedBit] === TRUE_BIT);
            const partialNameResolution = (serviceControlOptions?.bitString?.[partialNameResolutionBit] === TRUE_BIT);
            const nrcrResult = await nrcrProcedure(
                ctx,
                conn,
                state,
                chainingProhibited,
                partialNameResolution,
            );
            if (!nrcrResult) {
                return OperationDispatcher.operationEvaluation(
                    ctx,
                    state,
                    conn,
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
            conn,
            req,
            reqData,
            local,
        );
    }

    public static async dispatchDAPRequest (
        ctx: Context,
        conn: ClientConnection,
        req: Request,
    ): Promise<OperationDispatcherReturn> {
        const preparedRequest = await requestValidationProcedure(
            ctx,
            req,
            false,
            conn.authLevel,
            conn.boundNameAndUID?.uid,
        );
        return this.dispatchPreparedDSPRequest(
            ctx,
            conn,
            req,
            preparedRequest,
            false,
        );
    }

    public static async dispatchDSPRequest (
        ctx: Context,
        conn: DSPConnection,
        req: Request,
    ): Promise<OperationDispatcherReturn> {
        const preparedRequest = await requestValidationProcedure(
            ctx,
            req,
            true,
            conn.authLevel,
            conn.boundNameAndUID?.uid,
        );
        return this.dispatchPreparedDSPRequest(
            ctx,
            conn,
            req,
            preparedRequest,
            false,
        );
    }

    private static async localSearchOperationEvaluation (
        ctx: Context,
        state: OperationDispatcherState,
        conn: ClientConnection,
        invokeId: InvokeId,
        argument: SearchArgument,
        chaining: ChainingArguments,
    ): Promise<SearchResultOrError> {
        const foundDN = getDistinguishedName(state.foundDSE);
        const relatedEntryReturn: RelatedEntryReturn = {
            chaining: state.chainingResults,
            response: [],
            unexplored: [],
        };
        await relatedEntryProcedure(ctx, conn, state, relatedEntryReturn, argument, chaining);
        const nameResolutionPhase = chaining.operationProgress?.nameResolutionPhase
            ?? ChainingArguments._default_value_for_operationProgress.nameResolutionPhase;
        if (nameResolutionPhase === completed) { // Search (II)
            const response: SearchState = {
                results: [],
                chaining: relatedEntryReturn.chaining,
                depth: 0,
            };
            await search_ii(ctx, conn, state, argument, response);
            const localResult: SearchResult = {
                unsigned: {
                    searchInfo: new SearchResultData_searchInfo(
                        {
                            rdnSequence: foundDN,
                        },
                        response.results,
                        (response.poq || relatedEntryReturn.unexplored.length)
                            ? new PartialOutcomeQualifier(
                                response.poq?.limitProblem,
                                relatedEntryReturn.unexplored,
                                response.poq?.unavailableCriticalExtensions,
                                response.poq?.unknownErrors,
                                response.paging
                                    ? Buffer.from(response.paging[0], "base64")
                                    : response.poq?.queryReference,
                                response.poq?.overspecFilter,
                                response.poq?.notification,
                                response.poq?.entryCount,
                            )
                            : undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            search["&operationCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                },
            };
            const unmergedResult: SearchResult = (relatedEntryReturn.response.length)
                ? {
                    unsigned: {
                        uncorrelatedSearchInfo: [
                            ...relatedEntryReturn.response,
                            localResult,
                        ],
                    },
                }
                : localResult;
            const result = await resultsMergingProcedureForSearch(
                ctx,
                unmergedResult,
                state.NRcontinuationList,
                state.SRcontinuationList,
            );
            return {
                invokeId: {
                    present: 1,
                },
                opCode: search["&operationCode"]!,
                chaining: response.chaining,
                result,
            };
        } else { // Search (I)
            // Only Search (I) results in results merging.
            const response: SearchState = {
                results: [],
                chaining: relatedEntryReturn.chaining,
                depth: 0,
            };
            await search_i(ctx, conn, state, argument, response);
            const localResult: SearchResult = {
                unsigned: {
                    searchInfo: new SearchResultData_searchInfo(
                        {
                            rdnSequence: foundDN,
                        },
                        response.results,
                        (response.poq || relatedEntryReturn.unexplored.length)
                            ? new PartialOutcomeQualifier(
                                response.poq?.limitProblem,
                                relatedEntryReturn.unexplored,
                                response.poq?.unavailableCriticalExtensions,
                                response.poq?.unknownErrors,
                                response.paging
                                    ? Buffer.from(response.paging[0], "base64")
                                    : response.poq?.queryReference,
                                response.poq?.overspecFilter,
                                response.poq?.notification,
                                response.poq?.entryCount,
                            )
                            : undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            search["&operationCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                },
            };
            const unmergedResult: SearchResult = (relatedEntryReturn.response.length)
                ? {
                    unsigned: {
                        uncorrelatedSearchInfo: [
                            ...relatedEntryReturn.response,
                            localResult,
                        ],
                    },
                }
                : localResult;
            const result = await resultsMergingProcedureForSearch(
                ctx,
                unmergedResult,
                state.NRcontinuationList,
                state.SRcontinuationList,
            );
            return {
                invokeId: {
                    present: 1,
                },
                opCode: search["&operationCode"]!,
                chaining: response.chaining,
                result,
            };
        }
    }

    public static async dispatchLocalSearchDSPRequest (
        ctx: Context,
        conn: ClientConnection,
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
                        conn.boundNameAndUID?.dn,
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
        };
        await findDSE(
            ctx,
            conn,
            ctx.dit.root,
            targetObject,
            state,
        );
        if (!state.entrySuitable) {
            const serviceControlOptions = data.serviceControls?.options;
            const chainingProhibited = (serviceControlOptions?.[chainingProhibitedBit] === TRUE_BIT);
            const partialNameResolution = (serviceControlOptions?.[partialNameResolutionBit] === TRUE_BIT);
            const nrcrResult = await nrcrProcedure(
                ctx,
                conn,
                state,
                chainingProhibited,
                partialNameResolution,
            );
            if (!nrcrResult) {
                return OperationDispatcher.localSearchOperationEvaluation(
                    ctx,
                    state,
                    conn,
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
                    invokeId: {
                        present: 1,
                    },
                    opCode: search["&operationCode"]!,
                    chaining: unprotectedResult.chainedResult,
                    result: searchResult,
                };
            }
        }
        return OperationDispatcher.localSearchOperationEvaluation(
            ctx,
            state,
            conn,
            invokeId,
            argument,
            chaining,
        );
    }

}

export default OperationDispatcher;
