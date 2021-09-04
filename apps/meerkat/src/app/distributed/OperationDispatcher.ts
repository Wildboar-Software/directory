import type { Context, Vertex } from "../types";
import type { Request } from "@wildboar/x500/src/lib/types/Request";
import type {
    AuthenticationLevel,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta";
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
import type {
    UniqueIdentifier,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UniqueIdentifier.ta";
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
import { ASN1TagClass, TRUE_BIT } from "asn1-ts";
import {
    ServiceControlOptions_chainingProhibited as chainingProhibitedBit,
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
import { addEntry as doAddEntry } from "./addEntry";
import { compare as doCompare } from "./compare";
import { read as doRead } from "./read";
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

export
type SearchResultOrError = {
    invokeId: InvokeId;
    opCode: Code;
    result: SearchResult;
    chaining: ChainingResults;
} | Error_;

interface OperationDispatcherState {
    NRcontinuationList: ContinuationReference[];
    SRcontinuationList: ContinuationReference[];
    admPoints: Vertex[];
    referralRequests: TraceItem[];
    emptyHierarchySelect: boolean;
}

export
class OperationDispatcher {

    public static async dispatchDAPRequest (
        ctx: Context,
        req: Request,
        authLevel: AuthenticationLevel,
        uniqueIdentifier?: UniqueIdentifier,
    ): Promise<ChainedResultOrError> {
        assert(req.opCode);
        assert(req.argument);
        const preparedRequest = await requestValidationProcedure(
            ctx,
            req,
            false,
            authLevel,
            uniqueIdentifier,
        );
        const reqData = getOptionallyProtectedValue(preparedRequest);
        const targetObject = getSoughtObjectFromRequest(req);
        if (!targetObject) {
            throw errors.invalidRequestError("No discernable targeted object.");
        }
        const state: OperationDispatcherState = {
            NRcontinuationList: [],
            SRcontinuationList: [],
            admPoints: [],
            referralRequests: [],
            emptyHierarchySelect: false,
        };
        const foundDSE: Vertex | undefined = await findDSE(
            ctx,
            ctx.dit.root,
            targetObject,
            reqData.chainedArgument,
            reqData.argument,
            req.opCode!,
            state.NRcontinuationList,
            state.admPoints,
        );
        if (!foundDSE) {
            const serviceControls = reqData.argument.set
                .find((el) => (
                    (el.tagClass === ASN1TagClass.context)
                    && (el.tagNumber === 30)
                ));
            const serviceControlOptions = serviceControls?.set
                .find((el) => (
                    (el.tagClass === ASN1TagClass.context)
                    && (el.tagNumber === 0)
                ));
            const chainingProhibited = (serviceControlOptions?.bitString?.[chainingProhibitedBit] === TRUE_BIT);
            const nrcrResult = await nrcrProcedure(
                ctx,
                state.NRcontinuationList,
                {
                    ...req,
                    opCode: req.opCode!,
                    chaining: reqData.chainedArgument,
                },
                chainingProhibited,
            );
            // This will need to change if parallel requests are implemented,
            // because only one response can be returned when the strategy is serial.
            return nrcrResult.responses[0];
        }
        const foundDN = getDistinguishedName(foundDSE);
        if (compareCode(req.opCode, abandon["&operationCode"]!)) {
            throw new errors.UnknownOperationError();
        }
        else if (compareCode(req.opCode, administerPassword["&operationCode"]!)) {
            throw new errors.UnknownOperationError();
        }
        else if (compareCode(req.opCode, addEntry["&operationCode"]!)) {
            const result = await doAddEntry(ctx, foundDSE, state.admPoints, reqData);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: result.result,
                chaining: result.chainedResult,
            };
        }
        else if (compareCode(req.opCode, changePassword["&operationCode"]!)) {
            throw new errors.UnknownOperationError();
        }
        else if (compareCode(req.opCode, compare["&operationCode"]!)) {
            const result = await doCompare(ctx, foundDSE, state.admPoints, reqData);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: result.result,
                chaining: result.chainedResult,
            };
        }
        else if (compareCode(req.opCode, modifyDN["&operationCode"]!)) {
            throw new errors.UnknownOperationError();
        }
        else if (compareCode(req.opCode, modifyEntry["&operationCode"]!)) {
            throw new errors.UnknownOperationError();
        }
        else if (compareCode(req.opCode, list["&operationCode"]!)) {
            const nameResolutionPhase = reqData.chainedArgument.operationProgress?.nameResolutionPhase
                ?? ChainingArguments._default_value_for_operationProgress.nameResolutionPhase;
            if (nameResolutionPhase === completed) { // List (II)
                const result = await list_ii(ctx, state.admPoints, foundDSE, reqData, true);
                return {
                    invokeId: req.invokeId,
                    opCode: req.opCode,
                    result: result.result,
                    chaining: result.chainedResult,
                };
            } else { // List (I)
                // Only List (I) results in results merging.
                const response = await list_i(ctx, state.admPoints, foundDSE, reqData);
                const result = _decode_ListResult(response.result);
                const data = getOptionallyProtectedValue(result);
                const newData = await resultsMergingProcedureForList(
                    ctx,
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
            const result = await doRead(ctx, foundDSE, state.admPoints, reqData);
            return {
                invokeId: req.invokeId,
                opCode: req.opCode,
                result: result.result,
                chaining: result.chainedResult,
            };
        }
        else if (compareCode(req.opCode, removeEntry["&operationCode"]!)) {
            throw new errors.UnknownOperationError();
        }
        else if (compareCode(req.opCode, search["&operationCode"]!)) {
            const argument = _decode_SearchArgument(reqData.argument);
            const chainingResults = new ChainingResults(
                undefined,
                undefined,
                undefined,
                undefined,
            );
            const relatedEntryReturn: RelatedEntryReturn = {
                chaining: chainingResults,
                response: [],
                unexplored: [],
            };
            await relatedEntryProcedure(ctx, relatedEntryReturn, argument, reqData.chainedArgument);
            const nameResolutionPhase = reqData.chainedArgument.operationProgress?.nameResolutionPhase
                ?? ChainingArguments._default_value_for_operationProgress.nameResolutionPhase;
            if (nameResolutionPhase === completed) { // Search (II)
                const response: SearchIIReturn = {
                    results: [],
                    chaining: relatedEntryReturn.chaining,
                };
                await search_ii(
                    ctx,
                    foundDSE,
                    state.admPoints,
                    argument,
                    reqData.chainedArgument,
                    state.SRcontinuationList,
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
                            undefined,
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
                    foundDSE,
                    state.admPoints,
                    argument,
                    reqData.chainedArgument,
                    state.SRcontinuationList,
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
                            undefined,
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

    public static async dispatchLocalSearchDSPRequest (
        ctx: Context,
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
        const state: OperationDispatcherState = {
            NRcontinuationList: [],
            SRcontinuationList: [],
            admPoints: [],
            referralRequests: [],
            emptyHierarchySelect: false,
        };
        const foundDSE: Vertex | undefined = await findDSE(
            ctx,
            ctx.dit.root,
            targetObject,
            chaining,
            encodedArgument,
            search["&operationCode"]!,
            state.NRcontinuationList,
            state.admPoints,
        );
        if (!foundDSE) {
            const serviceControlOptions = data.serviceControls?.options;
            const chainingProhibited = (serviceControlOptions?.[chainingProhibitedBit] === TRUE_BIT);
            const nrcrResult = await nrcrProcedure(
                ctx,
                state.NRcontinuationList,
                {
                    invokeId: {
                        present: 1,
                    },
                    opCode: search["&operationCode"]!,
                    chaining,
                },
                chainingProhibited,
            );
            // This will need to change if parallel requests are implemented,
            // because only one response can be returned when the strategy is serial.
            const response =  nrcrResult.responses[0];
            if ("result" in response) {
                if (!response.result) {
                    throw new Error(); // FIXME:
                }
                return {
                    ...response,
                    result: _decode_SearchResult(response.result),
                };
            } else if ("error" in response) {
                return response;
            } else {
                throw new Error(); // FIXME:
            }
        }
        const foundDN = getDistinguishedName(foundDSE);
        const chainingResults = new ChainingResults(
            undefined,
            undefined,
            undefined,
            undefined,
        );
        const relatedEntryReturn: RelatedEntryReturn = {
            chaining: chainingResults,
            response: [],
            unexplored: [],
        };
        await relatedEntryProcedure(ctx, relatedEntryReturn, argument, chaining);
        const nameResolutionPhase = chaining.operationProgress?.nameResolutionPhase
            ?? ChainingArguments._default_value_for_operationProgress.nameResolutionPhase;
        if (nameResolutionPhase === completed) { // Search (II)
            const response: SearchIIReturn = {
                results: [],
                chaining: relatedEntryReturn.chaining,
            };
            await search_ii(ctx, foundDSE, state.admPoints, argument, chaining, state.SRcontinuationList, response);
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
                        undefined,
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
            await search_i(ctx, foundDSE, state.admPoints, argument, chaining, state.SRcontinuationList, response);
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
                        undefined,
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
