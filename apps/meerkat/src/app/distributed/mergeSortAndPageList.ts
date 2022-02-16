import type { Context, ClientAssociation } from "@wildboar/meerkat-types";
import { ASN1Element, DERElement } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import type { OperationDispatcherState } from "./OperationDispatcher";
import { strict as assert } from "assert";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    ListArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgumentData.ta";
import type {
    ListResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResult.ta";
import getDistinguishedName from "../x500/getDistinguishedName";
import {
    PartialOutcomeQualifier,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PartialOutcomeQualifier.ta";
import createSecurityParameters from "../x500/createSecurityParameters";
import { list } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/list.oa";
import type {
    SortKey,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SortKey.ta";
import getOrderingMatcherGetter from "../x500/getOrderingMatcherGetter";
import { MAX_RESULTS } from "../constants";
import {
    LimitProblem_sizeLimitExceeded,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/LimitProblem.ta";
import type { ListState } from "./list_i";
import {
    ListResultData_listInfo_subordinates_Item as ListItem,
    _decode_ListResultData_listInfo_subordinates_Item,
    _encode_ListResultData_listInfo_subordinates_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData-listInfo-subordinates-Item.ta";
import { ListResultData_listInfo } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData-listInfo.ta";

type IListInfo = { -readonly [K in keyof ListResultData_listInfo]: ListResultData_listInfo[K] };

function getEntryCount (sr: ListResult): number {
    const data = getOptionallyProtectedValue(sr);
    if ("listInfo" in data) {
        return data.listInfo.subordinates.length;
    } else if ("uncorrelatedListInfo" in data) {
        return data.uncorrelatedListInfo
            .map(getEntryCount)
            .reduce((a, c) => (a + c), 0);
    } else {
        return 0;
    }
}

function mergePOQ (a: PartialOutcomeQualifier, b: PartialOutcomeQualifier): PartialOutcomeQualifier {
    return new PartialOutcomeQualifier(
        a.limitProblem ?? b.limitProblem,
        (a.unexplored?.length || b.unexplored?.length)
            ? [
                ...(a.unexplored ?? []),
                ...(b.unexplored ?? []),
            ]
            : undefined,
        (a.unavailableCriticalExtensions || b.unavailableCriticalExtensions),
        (a.unknownErrors?.length || b.unknownErrors?.length)
            ? [
                ...(a.unknownErrors ?? []),
                ...(b.unknownErrors ?? []),
            ]
            : undefined,
        a.queryReference ?? b.queryReference,
        a.overspecFilter ?? b.overspecFilter,
        (a.notification?.length || b.notification?.length)
            ? [
                ...(a.notification ?? []),
                ...(b.notification ?? []),
            ]
            : undefined,
        // NOTE: entryCount is only for `search` operations.
        undefined,
    );
}

function mergeResultSet (
    acc: IListInfo,
    resultSet: ListResult,
): IListInfo {
    const data = getOptionallyProtectedValue(resultSet);
    if ("listInfo" in data) {
        acc.subordinates.push(...data.listInfo.subordinates);
        acc.partialOutcomeQualifier = (
            acc.partialOutcomeQualifier
            && data.listInfo.partialOutcomeQualifier
        )
            ? mergePOQ(acc.partialOutcomeQualifier, data.listInfo.partialOutcomeQualifier)
            : (acc.partialOutcomeQualifier ?? data.listInfo.partialOutcomeQualifier);
    } else if ("uncorrelatedListInfo" in data) {
        data.uncorrelatedListInfo
            .forEach((usi) => mergeResultSet(acc, usi));
    }
    return acc;
}

const A_COMES_FIRST: number = -1;
const B_COMES_FIRST: number = 1;
const A_AND_B_EQUAL: number = 0;

function compareSubordinates (
    ctx: Context,
    a: ListItem,
    b: ListItem,
    sortKeys: SortKey[],
    reverse: boolean = false,
): number {
    const sortKey: SortKey | undefined = sortKeys[0];
    if (!sortKey) {
        return A_AND_B_EQUAL;
    }
    const matcher = sortKey.orderingRule
        ? ctx.orderingMatchingRules.get(sortKey.orderingRule.toString())?.matcher
        : getOrderingMatcherGetter(ctx)(sortKey.type_);
    if (!matcher) {
        /**
         * In X.500 directories, supporting sorting is entirely optional. There
         * is not even an error / problem defined to indicate that the ordering
         * did not work. So for now, we will just silently return the unsorted
         * results.
         */
        return A_AND_B_EQUAL;
    }
    const aValue: ASN1Element | undefined = a.rdn.find((atav) => atav.type_.isEqualTo(sortKey.type_))?.value;
    const bValue: ASN1Element | undefined = b.rdn.find((atav) => atav.type_.isEqualTo(sortKey.type_))?.value;
    if (!aValue && !bValue) {
        return A_AND_B_EQUAL;
    }
    if (aValue && bValue) {
        try {
            const result: number = matcher(aValue, bValue) * (reverse ? -1 : 1);
            if (result !== 0) {
                return result;
            }
        } catch {
            return A_AND_B_EQUAL;
        }
        return compareSubordinates(ctx, a, b, sortKeys.slice(1), reverse);
    }
    if (aValue) {
        return A_COMES_FIRST * (reverse ? -1 : 1);
    }
    assert(bValue);
    return B_COMES_FIRST * (reverse ? -1 : 1);
}

/**
 * @summary A procedure that merges, sorts, and pages list results.
 * @description
 *
 * This procedure is not defined in any of the X.500 specifications, yet it
 * appears to be needed implicitly.
 *
 * This procedure takes local list results, as well as result sets obtained from
 * chaining, and merges them, sorts them, and paginates over them as the user
 * requests.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param state The operation dispatcher state
 * @param listArgument The list argument data
 * @param listState The list operation state
 * @returns A ListResult
 *
 * @function
 * @async
 */
export
async function mergeSortAndPageList(
    ctx: Context,
    assn: ClientAssociation,
    state: OperationDispatcherState,
    listArgument: ListArgumentData,
    listState: ListState,
): Promise<ListResult> {
    const resultSetsToReturn: ListResult[] = [];
    let resultsToReturn: ListItem[] = [];
    const foundDN = getDistinguishedName(state.foundDSE);
    const queryReference: string | undefined = (
        listArgument.pagedResults
        && ("queryReference" in listArgument.pagedResults)
    )
        ? Buffer.from(listArgument.pagedResults.queryReference).toString("base64")
        : listState.queryReference;
    const paging = queryReference
        ? assn.pagedResultsRequests.get(queryReference)
        : undefined;
    // If there is no paging, we just return an arbitrary selection of the results that is less than the sizeLimit.
    if(!paging) {
        const sizeLimit: number = listArgument.serviceControls?.sizeLimit
            ? Math.max(Number(listArgument.serviceControls.sizeLimit), 1)
            : MAX_RESULTS;
        resultsToReturn = [ ...listState.results.slice(0, sizeLimit) ];
        let sizeLimitRemaining: number = (sizeLimit - listState.results.length);
        let i = 0;
        while ((sizeLimitRemaining > 0) && (i < listState.resultSets.length)) {
            i++;
            const resultSet: ListResult = listState.resultSets[i];
            const entriesInResultSet: number = getEntryCount(resultSet);
            if (entriesInResultSet > sizeLimitRemaining) {
                continue;
            }
            resultSetsToReturn.push(resultSet);
            sizeLimitRemaining -= entriesInResultSet;
        }
        const localResult: ListResult = {
            unsigned: {
                listInfo: new ListResultData_listInfo(
                    {
                        rdnSequence: foundDN,
                    },
                    resultsToReturn,
                    listState.poq,
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        list["&operationCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            },
        };
        const totalResult: ListResult = resultSetsToReturn.length
            ? {
                unsigned: {
                    uncorrelatedListInfo: [
                        ...resultSetsToReturn,
                        localResult,
                    ],
                },
            }
            : localResult;
        return totalResult;
    }
    assert(paging);
    // Otherwise, assume every result from here on came from within this DSA.
    // Therefore, signatures may be stripped. All result sets may be joined.
    // Then you can sort, store, and paginate.

    const prr = paging.request;
    const localListInfo = new ListResultData_listInfo(
        {
            rdnSequence: foundDN,
        },
        [
            ...listState.results,
            // Array.reverse() works in-place, so we create a new array.
        ],
        listState.poq,
        [],
        createSecurityParameters(
            ctx,
            assn.boundNameAndUID?.dn,
            list["&operationCode"],
        ),
        ctx.dsa.accessPoint.ae_title.rdnSequence,
        state.chainingArguments.aliasDereferenced,
        undefined,
    );
    let mergedResult: IListInfo = { ...localListInfo };
    let pageNumberSkips: number = 0;
    // These steps are only necessary for the first page.
    if (listArgument.pagedResults && "newRequest" in listArgument.pagedResults) {
        const pageNumber: number = (
            Number.isSafeInteger(listArgument.pagedResults.newRequest.pageNumber)
            && listArgument.pagedResults.newRequest.sortKeys?.length // pageNumber is only observed if sorting is used.
        )
            ? Number(listArgument.pagedResults.newRequest.pageNumber ?? 0)
            : 0;
        pageNumberSkips = Math.max(0, pageNumber * Number(listArgument.pagedResults.newRequest.pageSize));
        mergedResult = listState.resultSets.reduce(mergeResultSet, mergedResult);
        if (prr.sortKeys?.length) { // TODO: Try to multi-thread this, if possible.
            mergedResult.subordinates.sort((a, b) => compareSubordinates(
                ctx,
                a,
                b,
                prr.sortKeys!,
                prr.reverse,
            ));
        }
        const nonSkippedResults = mergedResult.subordinates.slice(pageNumberSkips);
        await ctx.db.enqueuedListResult.createMany({
            data: nonSkippedResults.map((sub, i) => ({
                connection_uuid: assn.id,
                query_ref: queryReference!,
                result_index: i,
                subordinate_info: Buffer.from(_encode_ListResultData_listInfo_subordinates_Item(sub, DER).toBytes()),
                // TODO: Supply entry ID too.
            })),
        });
        paging.totalResults = nonSkippedResults.length;
        mergedResult.subordinates.length = 0;
    }

    // We are done with these, so we can relinquish these references.
    listState.results.length = 0;
    const results = await ctx.db.enqueuedListResult.findMany({
        take: Math.max(Number(prr.pageSize), 1),
        skip: (paging.cursorId === undefined) ? 0 : 1,
        where: {
            connection_uuid: assn.id,
            query_ref: queryReference!,
        },
        select: {
            // id: true,
            subordinate_info: true,
            result_index: true,
        },
        orderBy: {
            result_index: "asc",
        },
        cursor: {
            connection_uuid_query_ref_result_index: {
                connection_uuid: assn.id,
                query_ref: queryReference!,
                result_index: paging.cursorId ?? 0,
            },
        },
    });
    // REVIEW: Will this get stuck in a loop if there are NO results?
    const cursorId: number = results[results.length - 1]?.result_index ?? 0;
    paging.cursorId = cursorId;
    const done: boolean = (
        (results.length === 0) // There are no more results, or
        || ((cursorId + 1) >= (paging.totalResults ?? -1)) // The cursor is greater than count
    );
    if (cursorId) {
        /**
         * We dispose of results as soon as have returned them.
         *
         * NOTE: The same cannot be done for `search` operations, because they
         * may use the `entryCount` control, which must return the same value
         * between pages. With `list`, on the other hand, there is no problem
         * in discarding results after they have been returned.
         */
        await ctx.db.enqueuedListResult.deleteMany({
            where: {
                connection_uuid: assn.id,
                query_ref: queryReference,
                result_index: {
                    lt: cursorId,
                },
            },
        });
    }
    if (done && queryReference) {
        assn.pagedResultsRequests.delete(queryReference);
        // These should already be gone, but this is just to make sure.
        await ctx.db.enqueuedListResult.deleteMany({
            where: {
                connection_uuid: assn.id,
                query_ref: queryReference,
            },
        });
    }
    /* TODO: Because this could potentially decode thousands of results just to
     * eventually re-encode this result, you should manually encode a
     * listInfo and just concatenate all BER-encoded ListItem's as
     * the `subordinates` field. This could potentially save a lot of computing
     * power.
     */
    return {
        unsigned: {
            listInfo: new ListResultData_listInfo(
                state.chainingArguments.aliasDereferenced
                    ? mergedResult.name
                    : undefined,
                results.map((result) => {
                    const el = new DERElement();
                    el.fromBytes(result.subordinate_info);
                    return _decode_ListResultData_listInfo_subordinates_Item(el);
                }),
                done
                    ? mergedResult.partialOutcomeQualifier
                    : new PartialOutcomeQualifier(
                        LimitProblem_sizeLimitExceeded,
                        mergedResult.partialOutcomeQualifier?.unexplored,
                        mergedResult.partialOutcomeQualifier?.unavailableCriticalExtensions,
                        mergedResult.partialOutcomeQualifier?.unknownErrors,
                        Buffer.from(queryReference!, "base64"),
                        mergedResult.partialOutcomeQualifier?.overspecFilter,
                        mergedResult.partialOutcomeQualifier?.notification,
                        // NOTE: entryCount is only for the `search` operation.
                        undefined,
                    ),
                [],
                createSecurityParameters(
                    ctx,
                    assn.boundNameAndUID?.dn,
                    list["&operationCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        },
    };
}

export default mergeSortAndPageList;
