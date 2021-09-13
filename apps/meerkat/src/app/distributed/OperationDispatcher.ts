import type { ClientConnection, Context, Vertex } from "../types";
import type DAPConnection from "../dap/DAPConnection";
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
import * as errors from "../errors";
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
import {
    ChainedResultOrError,
} from "@wildboar/x500/src/lib/types/ChainedResultOrError";
import { compareCode } from "@wildboar/x500/src/lib/utils/compareCode";
import { abandon } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandon.oa";
import { administerPassword } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/administerPassword.oa";
import { addEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa";
import { changePassword } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/changePassword.oa";
import { compare } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/compare.oa";
import { modifyDN } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyDN.oa";
import { modifyEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyEntry.oa";
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
import type { SearchIReturn } from "./search_i";
import type { SearchIIReturn } from "./search_ii";
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
class OperationDispatcher {

    private static async dispatchPreparedDSPRequest (
        ctx: Context,
        conn: ClientConnection,
        req: Request,
        preparedRequest: OPTIONALLY_PROTECTED<Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1>,
    ): Promise<ChainedResultOrError> {
        assert(req.opCode);
        assert(req.argument);
        const reqData = getOptionallyProtectedValue(preparedRequest);
        if (compareCode(req.opCode, abandon["&operationCode"]!)) {
            const result = await doAbandon(ctx, conn, reqData);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: result.result,
                chaining: result.chainedResult,
            };
        }
        const targetObject = getSoughtObjectFromRequest(req);
        if (!targetObject) {
            throw errors.invalidRequestError("No discernable targeted object.");
        }
        const chainingResults = new ChainingResults(
            undefined,
            undefined,
            undefined,
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
            if (nrcrResult) {
                return nrcrResult;
            }
        }
        const foundDN = getDistinguishedName(state.foundDSE);
        if (compareCode(req.opCode, addEntry["&operationCode"]!)) {
            const result = await doAddEntry(ctx, conn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: result.result,
                chaining: result.chainedResult,
            };
        }
        else if (compareCode(req.opCode, administerPassword["&operationCode"]!)) {
            const result = await doAdministerPassword(ctx, conn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: result.result,
                chaining: result.chainedResult,
            };
        }
        else if (compareCode(req.opCode, changePassword["&operationCode"]!)) {
            const result = await doChangePassword(ctx, conn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: result.result,
                chaining: result.chainedResult,
            };
        }
        else if (compareCode(req.opCode, compare["&operationCode"]!)) {
            const result = await doCompare(ctx, conn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: result.result,
                chaining: result.chainedResult,
            };
        }
        else if (compareCode(req.opCode, modifyDN["&operationCode"]!)) {
            const result = await doModifyDN(ctx, conn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: result.result,
                chaining: result.chainedResult,
            };
        }
        else if (compareCode(req.opCode, modifyEntry["&operationCode"]!)) {
            const result = await doModifyEntry(ctx, conn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: result.result,
                chaining: result.chainedResult,
            };
        }
        else if (compareCode(req.opCode, list["&operationCode"]!)) {
            const nameResolutionPhase = reqData.chainedArgument.operationProgress?.nameResolutionPhase
                ?? ChainingArguments._default_value_for_operationProgress.nameResolutionPhase;
            if (nameResolutionPhase === completed) { // List (II)
                const result = await list_ii(ctx, conn, state, true);
                return {
                    invokeId: req.invokeId,
                    opCode: req.opCode,
                    result: result.result,
                    chaining: result.chainedResult,
                };
            } else { // List (I)
                // Only List (I) results in results merging.
                const response = await list_i(ctx, conn, state);
                const result = _decode_ListResult(response.result);
                const data = getOptionallyProtectedValue(result);
                const newData = await resultsMergingProcedureForList(
                    ctx,
                    conn,
                    data,
                    false, // FIXME:
                    state.NRcontinuationList,
                    state.SRcontinuationList,
                );
                const newResult: ListResult = {
                    unsigned: newData,
                };
                return {
                    invokeId: req.invokeId,
                    opCode: req.opCode,
                    result: _encode_ListResult(newResult, DER),
                    chaining: response.chainedResult,
                };
            }
        }
        else if (compareCode(req.opCode, read["&operationCode"]!)) {
            const result = await doRead(ctx, conn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: result.result,
                chaining: result.chainedResult,
            };
        }
        else if (compareCode(req.opCode, removeEntry["&operationCode"]!)) {
            const result = await doRemoveEntry(ctx, conn, state);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: result.result,
                chaining: result.chainedResult,
            };
        }
        else if (compareCode(req.opCode, search["&operationCode"]!)) {
            const argument = _decode_SearchArgument(reqData.argument);
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
            await relatedEntryProcedure(ctx, conn, req.invokeId, relatedEntryReturn, argument, reqData.chainedArgument);
            const nameResolutionPhase = reqData.chainedArgument.operationProgress?.nameResolutionPhase
                ?? ChainingArguments._default_value_for_operationProgress.nameResolutionPhase;
            if (nameResolutionPhase === completed) { // Search (II)
                const response: SearchIIReturn = {
                    results: [],
                    chaining: relatedEntryReturn.chaining,
                };
                await search_ii(
                    ctx,
                    conn,
                    state,
                    argument,
                    response,
                );
                // FIXME: Use response.poq!
                const localResult: SearchResult = {
                    unsigned: {
                        searchInfo: new SearchResultData_searchInfo(
                            {
                                rdnSequence: foundDN,
                            },
                            response.results,
                            relatedEntryReturn.unexplored.length
                                ? new PartialOutcomeQualifier(
                                    undefined,
                                    relatedEntryReturn.unexplored,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                )
                                : undefined, // FIXME
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                conn.boundNameAndUID?.dn,
                                search["&operationCode"],
                            ),
                            undefined,
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
                    result: _encode_SearchResult(result, DER),
                };
            } else { // Search (I)
                // Only Search (I) results in results merging.
                const response: SearchIReturn = {
                    results: [],
                    chaining: relatedEntryReturn.chaining,
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
                            relatedEntryReturn.unexplored.length
                                ? new PartialOutcomeQualifier(
                                    undefined,
                                    relatedEntryReturn.unexplored,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                )
                                : undefined, // FIXME
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                conn.boundNameAndUID?.dn,
                                search["&operationCode"],
                            ),
                            undefined,
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
                    result: _encode_SearchResult(result, DER),
                };
            }
        }
        throw new Error();
    }

    public static async dispatchDAPRequest (
        ctx: Context,
        conn: DAPConnection,
        req: Request,
    ): Promise<ChainedResultOrError> {
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
        );
    }

    public static async dispatchDSPRequest (
        ctx: Context,
        conn: DSPConnection,
        req: Request,
    ): Promise<ChainedResultOrError> {
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
        );
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
            ? data.joinArguments?.[chaining.relatedEntry]?.joinBaseObject.rdnSequence
            : chaining.targetObject ?? data.baseObject.rdnSequence;
        if (!targetObject) {
            throw errors.invalidRequestError("No discernable targeted object.");
        }
        const chainingResults = new ChainingResults(
            undefined,
            undefined,
            undefined,
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
            if (nrcrResult) {
                if ("result" in nrcrResult) {
                    if (!nrcrResult.result) {
                        throw new Error(); // FIXME:
                    }
                    return {
                        ...nrcrResult,
                        result: _decode_SearchResult(nrcrResult.result),
                    };
                } else if ("error" in nrcrResult) {
                    return nrcrResult;
                } else {
                    throw new Error(); // FIXME:
                }
            }
        }
        const foundDN = getDistinguishedName(state.foundDSE);
        const relatedEntryReturn: RelatedEntryReturn = {
            chaining: chainingResults,
            response: [],
            unexplored: [],
        };
        await relatedEntryProcedure(ctx, conn, invokeId, relatedEntryReturn, argument, chaining);
        const nameResolutionPhase = chaining.operationProgress?.nameResolutionPhase
            ?? ChainingArguments._default_value_for_operationProgress.nameResolutionPhase;
        if (nameResolutionPhase === completed) { // Search (II)
            const response: SearchIIReturn = {
                results: [],
                chaining: relatedEntryReturn.chaining,
            };
            await search_ii(ctx, conn, state, argument, response);
            const localResult: SearchResult = {
                unsigned: {
                    searchInfo: new SearchResultData_searchInfo(
                        {
                            rdnSequence: foundDN,
                        },
                        response.results,
                        relatedEntryReturn.unexplored.length
                            ? new PartialOutcomeQualifier(
                                undefined,
                                relatedEntryReturn.unexplored,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                            )
                            : undefined, // FIXME
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            search["&operationCode"],
                        ),
                        undefined,
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
        } else { // Search (I)
            // Only Search (I) results in results merging.
            const response: SearchIReturn = {
                results: [],
                chaining: relatedEntryReturn.chaining,
            };
            await search_i(ctx, conn, state, argument, response);
            const localResult: SearchResult = {
                unsigned: {
                    searchInfo: new SearchResultData_searchInfo(
                        {
                            rdnSequence: foundDN,
                        },
                        response.results,
                        relatedEntryReturn.unexplored.length
                            ? new PartialOutcomeQualifier(
                                undefined,
                                relatedEntryReturn.unexplored,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                            )
                            : undefined, // FIXME
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            search["&operationCode"],
                        ),
                        undefined,
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

}

export default OperationDispatcher;
