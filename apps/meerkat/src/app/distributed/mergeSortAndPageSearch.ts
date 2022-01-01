import type { Context, ClientConnection } from "@wildboar/meerkat-types";
import { LDAPConnection } from "../ldap/LDAPConnection";
import { ASN1Element, DERElement, TRUE } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import type {
    SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
import {
    SearchResultData_searchInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResultData-searchInfo.ta";
import type { OperationDispatcherState } from "./OperationDispatcher";
import { strict as assert } from "assert";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import type { SearchState } from "./search_i";
import {
    SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import getDistinguishedName from "../x500/getDistinguishedName";
import {
    PartialOutcomeQualifier,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PartialOutcomeQualifier.ta";
import createSecurityParameters from "../x500/createSecurityParameters";
import { search } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import {
    EntryInformation,
    _decode_EntryInformation,
    _encode_EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import type {
    SortKey,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SortKey.ta";
import type {
    EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import getOrderingMatcherGetter from "../x500/getOrderingMatcherGetter";
import { MAX_RESULTS } from "../constants";
import {
    LimitProblem_sizeLimitExceeded,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/LimitProblem.ta";

type ISearchInfo = { -readonly [K in keyof SearchResultData_searchInfo]: SearchResultData_searchInfo[K] };

function getEntryCount (sr: SearchResult): number {
    const data = getOptionallyProtectedValue(sr);
    if ("searchInfo" in data) {
        return data.searchInfo.entries.length;
    } else if ("uncorrelatedSearchInfo" in data) {
        return data.uncorrelatedSearchInfo
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
        // REVIEW: I am not sure this is how you should do this. You might need
        // to add these together. The reason I don't is the specification says
        // that hierarchy selections should not count when merging these.
        a.entryCount ?? b.entryCount,
    );
}

function mergeResultSet (
    acc: ISearchInfo,
    resultSet: SearchResult,
): void {
    const data = getOptionallyProtectedValue(resultSet);
    if ("searchInfo" in data) {
        acc.entries.push(...data.searchInfo.entries);
        acc.partialOutcomeQualifier = (
            acc.partialOutcomeQualifier
            && data.searchInfo.partialOutcomeQualifier
        )
            ? mergePOQ(acc.partialOutcomeQualifier, data.searchInfo.partialOutcomeQualifier)
            : (acc.partialOutcomeQualifier ?? data.searchInfo.partialOutcomeQualifier);
        if (acc.altMatching) {
            acc.altMatching = TRUE;
        }
    } else if ("uncorrelatedSearchInfo" in data) {
        data.uncorrelatedSearchInfo
            .forEach((usi) => mergeResultSet(acc, usi));
    }
}

const A_COMES_FIRST: number = -1;
const B_COMES_FIRST: number = 1;
const A_AND_B_EQUAL: number = 0;

function compareEntries (
    ctx: Context,
    a: EntryInformation,
    b: EntryInformation,
    sortKeys: SortKey[],
    reverse: boolean = false,
    isLDAP: boolean = false,
): number {
    const sortKey: SortKey | undefined = sortKeys[0];
    if (!sortKey) {
        return A_AND_B_EQUAL;
    }
    const getApplicableValues = (info: EntryInformation_information_Item): ASN1Element[] => {
        return (("attribute" in info) && info.attribute.type_.isEqualTo(sortKey.type_))
            ? [
                ...info.attribute.values,
                ...(info.attribute.valuesWithContext?.map((vwc) => vwc.value) ?? []),
            ]
            : [];
    };
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
    const sortValues = (a: ASN1Element, b: ASN1Element): number => {
        try {
            return matcher(a, b) * (reverse ? -1 : 1);
        } catch {
            return A_AND_B_EQUAL;
        }
    };
    const aValue: ASN1Element | undefined = a.information
        ?.flatMap(getApplicableValues)
        .sort(sortValues)?.[0];
    const bValue: ASN1Element | undefined = b.information
        ?.flatMap(getApplicableValues)
        .sort(sortValues)?.[0];
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
        return compareEntries(ctx, a, b, sortKeys.slice(1), reverse, isLDAP);
    }
    if (aValue) {
        return A_COMES_FIRST * ((reverse && isLDAP) ? -1 : 1);
    }
    assert(bValue);
    return B_COMES_FIRST * ((reverse && isLDAP) ? -1 : 1);
}

export
async function mergeSortAndPageSearch(
    ctx: Context,
    conn: ClientConnection,
    state: OperationDispatcherState,
    searchState: SearchState,
    searchArgument: SearchArgumentData,
): Promise<SearchResult> {
    const resultSetsToReturn: SearchResult[] = [];
    let resultsToReturn: EntryInformation[] = [];
    const foundDN = getDistinguishedName(state.foundDSE);
    // If there is no paging, we just return an arbitrary selection of the results that is less than the sizeLimit.
    if(!searchState.paging?.[1]) {
        const sizeLimit: number = searchArgument.serviceControls?.sizeLimit
            ? Math.max(Number(searchArgument.serviceControls.sizeLimit), 1)
            : MAX_RESULTS;
        resultsToReturn = [ ...searchState.results.slice(0, sizeLimit) ];
        let sizeLimitRemaining: number = (sizeLimit - searchState.results.length);
        let i = 0;
        while ((sizeLimitRemaining > 0) && (i < searchState.resultSets.length)) {
            i++;
            const resultSet: SearchResult = searchState.resultSets[i];
            const entriesInResultSet: number = getEntryCount(resultSet);
            if (entriesInResultSet > sizeLimitRemaining) {
                continue;
            }
            resultSetsToReturn.push(resultSet);
            sizeLimitRemaining -= entriesInResultSet;
        }
        const localResult: SearchResult = {
            unsigned: {
                searchInfo: new SearchResultData_searchInfo(
                    {
                        rdnSequence: foundDN,
                    },
                    resultsToReturn,
                    searchState.poq,
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
        const totalResult: SearchResult = resultSetsToReturn.length
            ? {
                unsigned: {
                    uncorrelatedSearchInfo: [
                        ...resultSetsToReturn,
                        localResult,
                    ],
                },
            }
            : localResult;
        return totalResult;
    }
    assert(searchState.paging);
    // FIXME: Meerkat could still chain via relatedEntryProcedure and searchAliases!
    // Otherwise, assume every result from here on came from within this DSA.
    // Therefore, signatures may be stripped. All result sets may be joined.
    // Then you can sort, store, and paginate.

    const prr = searchState.paging[1].request;
    const localSearchInfo = new SearchResultData_searchInfo(
        {
            rdnSequence: foundDN,
        },
        [
            ...searchState.results,
            ...(searchState.paging?.[1].nextEntriesStack.reverse() ?? []),
        ],
        searchState.poq,
        undefined, // TODO:
        [],
        createSecurityParameters(
            ctx,
            conn.boundNameAndUID?.dn,
            search["&operationCode"],
        ),
        ctx.dsa.accessPoint.ae_title.rdnSequence,
        state.chainingArguments.aliasDereferenced,
        undefined,
    );
    let mergedResult: ISearchInfo = { ...localSearchInfo };
    let pageNumberSkips: number = 0;
    // These steps are only necessary for the first page.
    if (searchArgument.pagedResults && "newRequest" in searchArgument.pagedResults) {
        const pageNumber: number = (
            Number.isSafeInteger(searchArgument.pagedResults.newRequest.pageNumber)
            && searchArgument.pagedResults.newRequest.sortKeys?.length // pageNumber is only observed if sorting is used.
        )
            ? Number(searchArgument.pagedResults.newRequest.pageNumber ?? 0)
            : 0;
        pageNumberSkips = Math.max(0, pageNumber * Number(searchArgument.pagedResults.newRequest.pageSize));
        mergedResult = searchState.resultSets.reduce((acc, rs) => {
            mergeResultSet(acc, rs);
            return acc;
        }, mergedResult);

        if (prr.sortKeys?.length) { // TODO: Try to multi-thread this, if possible.
            mergedResult.entries.sort((a, b) => compareEntries(
                ctx,
                a,
                b,
                prr.sortKeys!,
                prr.reverse,
                (conn instanceof LDAPConnection),
            ));
        }
        const nonSkippedResults = mergedResult.entries.slice(pageNumberSkips);
        await ctx.db.enqueuedSearchResult.createMany({
            data: nonSkippedResults.map((entry, i) => ({
                connection_uuid: conn.id,
                query_ref: searchState.paging![0],
                result_index: i,
                entry_info: Buffer.from(_encode_EntryInformation(entry, DER).toBytes()),
                // TODO: Supply entry ID too.
            })),
        });
        searchState.paging[1].totalResults = nonSkippedResults.length;
        mergedResult.entries.length = 0;
    }

    // We are done with these, so we can relinquish these references.
    searchState.paging[1].nextEntriesStack.length = 0;
    searchState.results.length = 0;
    const results = await ctx.db.enqueuedSearchResult.findMany({
        take: Math.max(Number(prr.pageSize), 1),
        skip: (searchState.paging[1].cursorId === undefined) ? 0 : 1,
        where: {
            connection_uuid: conn.id,
            query_ref: searchState.paging![0],
        },
        select: {
            // id: true,
            entry_info: true,
            result_index: true,
        },
        orderBy: {
            result_index: "asc",
        },
        cursor: {
            connection_uuid_query_ref_result_index: {
                connection_uuid: conn.id,
                query_ref: searchState.paging![0],
                result_index: searchState.paging[1].cursorId ?? 0,
            },
        },
    });
    // REVIEW: Will this get stuck in a loop if there are NO results?
    const cursorId: number = results[results.length - 1]?.result_index ?? 0;
    searchState.paging[1].cursorId = cursorId;
    const done: boolean = (
        (results.length === 0) // There are no more results, or
        || ((cursorId + 1) >= (searchState.paging[1].totalResults ?? -1)) // The cursor is greater than count
    );
    if (cursorId) {
        // We dispose of results as soon as have returned them.
        await ctx.db.enqueuedSearchResult.deleteMany({
            where: {
                connection_uuid: conn.id,
                query_ref: searchState.paging![0],
                result_index: {
                    lt: cursorId,
                },
            },
        });
    }
    if (done) {
        conn.pagedResultsRequests.delete(searchState.paging[0]);
        // These should already be gone, but this is just to make sure.
        await ctx.db.enqueuedSearchResult.deleteMany({
            where: {
                connection_uuid: conn.id,
                query_ref: searchState.paging![0],
            },
        });
    }
    /* TODO: Because this could potentially decode thousands of entries just to
     * eventually re-encode this result, you should manually encode a
     * searchInfo and just concatenate all BER-encoded EntryInformation's as
     * the `entries` field. This could potentially save a lot of computing
     * power.
     */
    return {
        unsigned: {
            searchInfo: new SearchResultData_searchInfo(
                state.chainingArguments.aliasDereferenced
                    ? mergedResult.name
                    : undefined,
                results.map((result) => {
                    const el = new DERElement();
                    el.fromBytes(result.entry_info);
                    return _decode_EntryInformation(el);
                }),
                done
                    ? mergedResult.partialOutcomeQualifier
                    : new PartialOutcomeQualifier(
                        LimitProblem_sizeLimitExceeded,
                        mergedResult.partialOutcomeQualifier?.unexplored,
                        mergedResult.partialOutcomeQualifier?.unavailableCriticalExtensions,
                        mergedResult.partialOutcomeQualifier?.unknownErrors,
                        Buffer.from(searchState.paging[0], "base64"),
                        mergedResult.partialOutcomeQualifier?.overspecFilter,
                        mergedResult.partialOutcomeQualifier?.notification,
                        mergedResult.partialOutcomeQualifier?.entryCount,
                    ),
                mergedResult.altMatching,
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
}

export default mergeSortAndPageSearch;
