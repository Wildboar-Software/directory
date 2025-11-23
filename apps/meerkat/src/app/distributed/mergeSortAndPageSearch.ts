import type {
    Context,
    ClientAssociation,
    SearchResultStatistics,
    PartialOutcomeQualifierStatistics,
    IndexableDN,
} from "@wildboar/meerkat-types";
import { LDAPAssociation } from "../ldap/LDAPConnection";
import {
    ASN1TagClass,
    ASN1Element,
    DERElement,
    TRUE,
    FALSE,
    TRUE_BIT,
    encodeUnsignedBigEndianInteger,
    unpackBits,
    BERElement,
    ASN1Construction,
} from "@wildboar/asn1";
import { DER } from "@wildboar/asn1/functional";
import * as $ from "@wildboar/asn1/functional";
import {
    SearchResult,
    _encode_SearchResult,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SearchResultData_searchInfo,
} from "@wildboar/x500/DirectoryAbstractService";
import type { OperationDispatcherState } from "./OperationDispatcher";
import { strict as assert } from "assert";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import type { SearchState } from "./search_i";
import {
    SearchArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import getDistinguishedName from "../x500/getDistinguishedName";
import {
    PartialOutcomeQualifier,
} from "@wildboar/x500/DirectoryAbstractService";
import createSecurityParameters from "../x500/createSecurityParameters";
import { search } from "@wildboar/x500/DirectoryAbstractService";
import {
    EntryInformation,
    _encode_EntryInformation,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    SortKey,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    EntryInformation_information_Item,
} from "@wildboar/x500/DirectoryAbstractService";
import getOrderingMatcherGetter from "../x500/getOrderingMatcherGetter";
import { MAX_RESULTS, MAX_SORT_KEYS } from "../constants";
import {
    LimitProblem_sizeLimitExceeded,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SearchControlOptions_entryCount as entryCountBit,
} from "@wildboar/x500/DirectoryAbstractService";
import { generateSignature } from "../pki/generateSignature";
import { SIGNED } from "@wildboar/x500/AuthenticationFramework";
import {
    _encode_Name,
} from "@wildboar/x500/InformationFramework";
import {
    _encode_PartialOutcomeQualifier,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    _encode_SecurityParameters,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    _encode_DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import {
    _encode_AlgorithmIdentifier,
} from "@wildboar/x500/AuthenticationFramework";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import getPartialOutcomeQualifierStatistics from "../telemetry/getPartialOutcomeQualifierStatistics";
import { stringifyDN } from "../x500/stringifyDN";
import { distinguishedNameMatch as normalizeDN } from "../matching/normalizers";
import { _encode_Attribute } from "@wildboar/pki-stub";

export
interface MergeSearchResultsReturn {
    readonly encodedSearchResult: ASN1Element;
    readonly resultStats: SearchResultStatistics;
    readonly poqStats?: PartialOutcomeQualifierStatistics;
}

type ISearchInfo = { -readonly [K in keyof SearchResultData_searchInfo]: SearchResultData_searchInfo[K] };

/**
 * @summary Count the number of results in a `SearchResult`
 * @description
 *
 * This function counts the number of results in a `SearchResult`, recursing
 * into uncorrelated result sets, if they are present.
 *
 * @param sr The `SearchResult` whose entries are to be counted
 * @returns The number of entries in the `SearchResult`
 *
 * @function
 */
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

/**
 * @summary Merge two partial outcome qualifiers
 * @description
 *
 * Joins two partial outcome qualifiers to create one `PartialOutcomeQualifier`.
 *
 * NOTE: This differs from the `mergePOQ()` defined in
 * `mergeSortAndPageList.ts`.
 *
 * @param a One `PartialOutcomeQualifier`
 * @param b The other `PartialOutcomeQualifier`
 * @returns A new, merged `PartialOutcomeQualifier`
 *
 * @function
 */
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
        undefined, // entryCount does not matter because we don't even use it from the POQs.
    );
}

/**
 * @summary Merge search result set into another search result set
 * @description
 *
 * This function uses a reducer pattern to merge an incoming search result set
 * into another search result set.
 *
 * @param acc The accumulating result set
 * @param resultSet The new result set to merge into the `acc` result set
 * @returns The `acc` result set, by reference
 *
 * @function
 */
function mergeResultSet (
    acc: ISearchInfo,
    resultSet: SearchResult,
): ISearchInfo {
    const data = getOptionallyProtectedValue(resultSet);
    if ("searchInfo" in data) {
        acc.entries.push(...data.searchInfo.entries);
        acc.partialOutcomeQualifier = (
            acc.partialOutcomeQualifier
            && data.searchInfo.partialOutcomeQualifier
        )
            ? mergePOQ(acc.partialOutcomeQualifier, data.searchInfo.partialOutcomeQualifier)
            : (acc.partialOutcomeQualifier ?? data.searchInfo.partialOutcomeQualifier);
        acc.altMatching ||= data.searchInfo.altMatching;
        acc.aliasDereferenced ||= data.searchInfo.aliasDereferenced;
        if (!acc.notification) {
            acc.notification = [];
        }
        acc.notification.push(...data.searchInfo.notification ?? []);
    } else if ("uncorrelatedSearchInfo" in data) {
        data.uncorrelatedSearchInfo
            .forEach((usi) => mergeResultSet(acc, usi));
    }
    return acc;
}

function flattenResultSet (resultSet: SearchResult): SearchResultData_searchInfo[] {
    const data = getOptionallyProtectedValue(resultSet);
    if ("searchInfo" in data) {
        return [ data.searchInfo ];
    } else if ("uncorrelatedSearchInfo" in data) {
        return data.uncorrelatedSearchInfo.flatMap(flattenResultSet);
    } else {
        return [];
    }
}

const A_COMES_FIRST: number = -1;
const B_COMES_FIRST: number = 1;
const A_AND_B_EQUAL: number = 0;

/**
 * @summary Sorts two search results
 * @description
 *
 * This function orders two `search` operation result entries by returning
 * an integer that indicates which is "greater," if they are unequal, or `0` if
 * they are equal. This logic was purposefully chosen so that this function
 * could be used as a predicate in the `Array.sort()` method.
 *
 * @param ctx The context object
 * @param a One entry
 * @param b The other entry
 * @param sortKeys The sort keys from the paging request
 * @param reverse Whether the search should be reversed
 * @returns A number indicating whether `a` should appear before, `b`, or vice
 *  versa, or `0` if they are equal, according to the semantics of the predicate
 *  used in `Array.sort()`.
 *
 * @function
 */
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
        return compareEntries(ctx, a, b, sortKeys.slice(1, MAX_SORT_KEYS), reverse, isLDAP);
    }
    if (aValue) {
        return A_COMES_FIRST * ((reverse && isLDAP) ? -1 : 1);
    }
    assert(bValue);
    return B_COMES_FIRST * ((reverse && isLDAP) ? -1 : 1);
}

function chooseEntry (a: EntryInformation, b: EntryInformation): EntryInformation {
    if ((a.fromEntry ?? TRUE) && !(b.fromEntry ?? TRUE)) {
        return a;
    }
    if ((b.fromEntry ?? TRUE) && !(a.fromEntry ?? TRUE)) {
        return b;
    }
    if (a.information?.length && !(b.information?.length)) {
        return a;
    }
    if (b.information?.length && !(a.information?.length)) {
        return b;
    }
    return ((a.information?.length ?? 0) > (b.information?.length ?? 0)) ? a : b;
}

function dedupeEntries (ctx: Context, entries: EntryInformation[]): EntryInformation[] {
    const map: Map<IndexableDN, EntryInformation> = new Map();
    for (const entry of entries) {
        const dn = normalizeDN(ctx, _encode_DistinguishedName(entry.name.rdnSequence, DER))
            ?? stringifyDN(ctx, entry.name.rdnSequence);
        const incumbent = map.get(dn);
        if (incumbent) {
            map.set(dn, chooseEntry(incumbent, entry));
        } else {
            map.set(dn, entry);
        }
    }
    return Array.from(map.values());
}

/**
 * @summary A procedure that merges, sorts, and pages search results.
 * @description
 *
 * This procedure is not defined in any of the X.500 specifications, yet it
 * appears to be needed implicitly.
 *
 * This procedure takes local search results, as well as result sets obtained
 * from chaining, and merges them, sorts them, and paginates over them as the
 * user requests.
 *
 * ### Implementation
 *
 * When pagination is used, results get encoded and stored in the database as
 * BER encodings of `EntryInformation`. Since there could potentially be
 * millions of entries in a page, it could be catastrophic on performance if
 * every one were to be decoded just to be re-encoded to send to the user. To
 * avoid this, this implementation _manually_ crafts a `SearchResult` from raw
 * BER encodings concatenated together, including the BER-encoded entries.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param state The operation dispatcher state
 * @param searchState The search operation state
 * @param searchArgument The search argument data
 * @returns An encoded SearchResult and related statistics.
 *
 * @function
 * @async
 */
export
async function mergeSortAndPageSearch(
    ctx: Context,
    assn: ClientAssociation,
    state: OperationDispatcherState,
    searchState: SearchState,
    searchArgument: SearchArgumentData,
): Promise<MergeSearchResultsReturn> {
    const resultSetsToReturn: SearchResult[] = [];
    let resultsToReturn: EntryInformation[] = [];
    const foundDN = getDistinguishedName(state.foundDSE);
    const signResults: boolean = (
        (searchArgument.securityParameters?.target === ProtectionRequest_signed)
        && assn.authorizedForSignedResults
    );
    // If there is no paging, we just return an arbitrary selection of the results that is less than the sizeLimit.
    if (!searchState.paging?.[1]) {
        const sizeLimit: number = searchArgument.serviceControls?.sizeLimit
            ? Math.max(Number(searchArgument.serviceControls.sizeLimit), 1)
            : MAX_RESULTS;
        resultsToReturn = [ ...searchState.results.slice(0, sizeLimit) ];
        let sizeLimitRemaining: number = (sizeLimit - searchState.results.length);
        let i = 0;
        while ((sizeLimitRemaining > 0) && (i < searchState.resultSets.length)) {
            const resultSet: SearchResult = searchState.resultSets[i];
            i++;
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
                        signResults,
                        assn.boundNameAndUID?.dn,
                        search["&operationCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    searchState.notification.length > 0
                        ? searchState.notification
                        : undefined,
                ),
            },
        };
        const poqStats = searchState.poq
            ? getPartialOutcomeQualifierStatistics(searchState.poq)
            : undefined;
        const totalResult: SearchResult = resultSetsToReturn.length
            ? {
                unsigned: {
                    uncorrelatedSearchInfo: [
                        ...resultSetsToReturn,
                        /**
                         * This will be unsigned, but that's acceptable, because
                         * the uncorrelatedSearchInfo as a whole will get signed.
                         */
                        localResult,
                    ],
                },
            }
            : localResult;
        const resultStats: SearchResultStatistics = {
            altMatching: undefined,
            numberOfResults: getEntryCount(totalResult),
            uncorrelatedSearchInfo: [],
        };

        /**
         * Using DER encoding will NOT actually recursively DER-encode this element.
         * This is a bug in my ASN.1 compiler, where the selected codec does not
         * recurse completely. Fortunately, this is actually good, because it means
         * that the entries will not get re-ordered.
         */
        const unsignedReturnValue: MergeSearchResultsReturn = {
            encodedSearchResult: _encode_SearchResult(totalResult, DER),
            resultStats,
            poqStats,
        };

        // if (signing not requested) return unsigned;
        if (!signResults) {
            return unsignedReturnValue;
        }

        const signableBytes = _encode_SearchResult(totalResult, DER).toBytes();
        const key = ctx.config.signing?.key;
        if (!key) { // Signing is permitted to fail, per ITU Recommendation X.511 (2019), Section 7.10.
            return unsignedReturnValue;
        }
        const signingResult = generateSignature(key, signableBytes);
        if (!signingResult) {
            return unsignedReturnValue;
        }
        const [ sigAlg, sigValue ] = signingResult;
        const unsigned = getOptionallyProtectedValue(totalResult);
        return {
            encodedSearchResult: _encode_SearchResult({
                signed: new SIGNED(
                    unsigned,
                    sigAlg,
                    unpackBits(sigValue),
                    undefined,
                    undefined,
                ),
            }, DER),
            resultStats,
            poqStats,
        };
    } // End of no paging
    assert(searchState.paging);
    const entryCount: boolean = (searchArgument.searchControlOptions?.[entryCountBit] === TRUE_BIT);
    const prr = searchState.paging[1].request;
    const localSearchInfo = new SearchResultData_searchInfo(
        {
            rdnSequence: foundDN,
        },
        [
            ...searchState.results,
        ],
        searchState.poq,
        FALSE, // altMatching will always be FALSE from local results, becase we don't do alternative matching 'round here.
        [],
        createSecurityParameters(
            ctx,
            signResults,
            assn.boundNameAndUID?.dn,
            search["&operationCode"],
        ),
        ctx.dsa.accessPoint.ae_title.rdnSequence,
        state.chainingArguments.aliasDereferenced,
        searchState.notification.length > 0
            ? searchState.notification
            : undefined,
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
        const unmerged: boolean = (searchArgument.pagedResults.newRequest.unmerged === TRUE);
        if (unmerged && prr.sortKeys?.length) { // Unmerged is to be ignored if there are no sort keys specified.
            mergedResult.entries.sort((a, b) => compareEntries(
                ctx,
                a,
                b,
                prr.sortKeys!,
                prr.reverse,
                (assn instanceof LDAPAssociation),
            ));
            const infos = searchState.resultSets.flatMap(flattenResultSet);
            for (const info of infos) {
                const entries = [ ...info.entries ];
                entries.sort((a, b) => compareEntries(
                    ctx,
                    a,
                    b,
                    prr.sortKeys!,
                    prr.reverse,
                    (assn instanceof LDAPAssociation),
                ));
                mergedResult.entries.push(...entries);
                mergedResult.altMatching ||= info.altMatching;
                mergedResult.aliasDereferenced ||= info.aliasDereferenced;
                if (!mergedResult.notification) {
                    mergedResult.notification = [];
                }
                mergedResult.notification.push(...info.notification ?? []);
            }
        } else {
            mergedResult = searchState.resultSets.reduce(mergeResultSet, mergedResult);
            mergedResult.entries = dedupeEntries(ctx, mergedResult.entries);
            if (prr.sortKeys?.length) { // TODO: Try to multi-thread this, if possible.
                mergedResult.entries.sort((a, b) => compareEntries(
                    ctx,
                    a,
                    b,
                    prr.sortKeys!,
                    prr.reverse,
                    (assn instanceof LDAPAssociation),
                ));
            }
        }

        const nonSkippedResults = mergedResult.entries.slice(pageNumberSkips);
        await ctx.db.enqueuedSearchResult.createMany({
            data: nonSkippedResults.map((entry, i) => ({
                connection_uuid: assn.id,
                query_ref: searchState.paging![0],
                result_index: i,
                entry_info: _encode_EntryInformation(entry, DER).toBytes(),
                // TODO: Supply entry ID too.
            })),
        });
        searchState.paging[1].totalResults = nonSkippedResults.length;
        mergedResult.entries.length = 0;
    }

    // We are done with these, so we can relinquish these references.
    searchState.results.length = 0;
    const results = await ctx.db.enqueuedSearchResult.findMany({
        take: Math.max(Number(prr.pageSize), 1),
        skip: (searchState.paging[1].cursorId === undefined) ? 0 : 1,
        where: {
            connection_uuid: assn.id,
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
                connection_uuid: assn.id,
                query_ref: searchState.paging![0],
                result_index: searchState.paging[1].cursorId ?? 0,
            },
        },
    });
    const cursorId: number = results[results.length - 1]?.result_index ?? 0;
    searchState.paging[1].cursorId = cursorId;
    const done: boolean = (
        (results.length === 0) // There are no more results, or
        || ((cursorId + 1) >= (searchState.paging[1].totalResults ?? -1)) // The cursor is greater than count
    );
    // This cannot be done, because entryCount must be remain between
    // pages.
    // if (cursorId) {
    //     // We dispose of results as soon as have returned them.
    //     await ctx.db.enqueuedSearchResult.deleteMany({
    //         where: {
    //             connection_uuid: conn.id,
    //             query_ref: searchState.paging![0],
    //             result_index: {
    //                 lt: cursorId,
    //             },
    //         },
    //     });
    // }
    if (done) {
        assn.pagedResultsRequests.delete(searchState.paging[0]);
        // These should already be gone, but this is just to make sure.
        await ctx.db.enqueuedSearchResult.deleteMany({
            where: {
                connection_uuid: assn.id,
                query_ref: searchState.paging![0],
            },
        });
    }

    const poq = done
        ? mergedResult.partialOutcomeQualifier
        : new PartialOutcomeQualifier(
            LimitProblem_sizeLimitExceeded,
            mergedResult.partialOutcomeQualifier?.unexplored,
            mergedResult.partialOutcomeQualifier?.unavailableCriticalExtensions,
            mergedResult.partialOutcomeQualifier?.unknownErrors,
            Buffer.from(searchState.paging[0], "base64"),
            mergedResult.partialOutcomeQualifier?.overspecFilter,
            mergedResult.partialOutcomeQualifier?.notification,
            entryCount
                ? {
                    exact: await ctx.db.enqueuedSearchResult.count({
                        where: {
                            connection_uuid: assn.id,
                            query_ref: searchState.paging![0],
                        },
                    }),
                }
                : undefined,
        );
    const sp = createSecurityParameters(
        ctx,
        signResults,
        assn.boundNameAndUID?.dn,
        search["&operationCode"],
    );

    // #region Less-decoding optimization.
    /*
        When you perform a search that is paginated, a page could be several
        megabytes in size and/or contain millions of results. Repeatedly
        encoding and decoding these results could be catastrophic to DSA
        performance. Fortunately, we can manually construct a SearchResult
        from concatenated buffers to avoid decoding the `entries` just to
        re-encode them. This is pretty complicated, though.
    */

    const nameBuffer = (state.chainingArguments.aliasDereferenced && mergedResult.name)
        ? _encode_Name(mergedResult.name, DER).toBytes()
        : Buffer.allocUnsafe(0);
    const poqBuffer = poq
        ? $._encode_explicit(ASN1TagClass.context, 2, () => _encode_PartialOutcomeQualifier, DER)(poq, DER).toBytes()
        : Buffer.allocUnsafe(0);
    const altMatchingBuffer = (mergedResult.altMatching !== undefined)
        ? Buffer.from([ 0xA3, 0x03, 0x01, 0x01, 0xFF ]) // [3] TRUE
        : Buffer.allocUnsafe(0);
    const spBuffer = sp
        ? $._encode_explicit(ASN1TagClass.context, 30, () => _encode_SecurityParameters, DER)(sp, DER).toBytes()
        : Buffer.allocUnsafe(0);
    const performerBuffer = $._encode_explicit(
        ASN1TagClass.context,
        29,
        () => _encode_DistinguishedName,
        DER,
    )(ctx.dsa.accessPoint.ae_title.rdnSequence, DER).toBytes();
    const adBuffer = state.chainingArguments.aliasDereferenced
        ? Buffer.from([ 0xBD, 0x03, 0x01, 0x01, 0xFF ]) // [29] TRUE
        : Buffer.allocUnsafe(0);
    const notificationBuffer = (searchState.notification.length > 0)
        ? (() => {
            const seq = BERElement.fromSequence(searchState.notification.map((n) => _encode_Attribute(n)));
            const outer = new BERElement();
            outer.tagClass = ASN1TagClass.context;
            outer.construction = ASN1Construction.constructed;
            outer.tagNumber = 27;
            outer.value = seq.toBytes();
            return outer.toBytes();
        })()
        : Buffer.allocUnsafe(0);
    let searchInfoLength: number = (
        nameBuffer.length
        + poqBuffer.length
        + altMatchingBuffer.length
        + spBuffer.length
        + performerBuffer.length
        + adBuffer.length
        + notificationBuffer.length
    );
    let resultsByteLength = 0;
    for (const r of results) {
        resultsByteLength += r.entry_info.length;
    }
    searchInfoLength += resultsByteLength;

    const resultsInnerTagAndLengthBytes = (resultsByteLength >= 128)
        ? (() => {
            const lengthBytes = encodeUnsignedBigEndianInteger(resultsByteLength);
            return Buffer.from([
                0x31, // SET
                0b1000_0000 | lengthBytes.length, // Definite long-form length
                ...lengthBytes, // length
            ]);
        })()
        : Buffer.from([ 0x31, resultsByteLength ]); // SET + Length;
    const resultsInnerLength = (resultsByteLength + resultsInnerTagAndLengthBytes.length);
    const resultsOuterTagAndLengthBytes = (resultsInnerLength >= 128)
        ? (() => {
            const lengthBytes = encodeUnsignedBigEndianInteger(resultsInnerLength);
            return Buffer.from([
                0xA0, // [0]
                0b1000_0000 | lengthBytes.length, // Definite long-form length
                ...lengthBytes, // length
            ]);
        })()
        : Buffer.from([ 0xA0, resultsInnerLength ]); // [0] + Length;

    searchInfoLength += resultsInnerTagAndLengthBytes.length;
    searchInfoLength += resultsOuterTagAndLengthBytes.length;

    const searchInfoTLBytes = (searchInfoLength >= 128)
        ? (() => {
            const lengthBytes = encodeUnsignedBigEndianInteger(searchInfoLength);
            return Buffer.from([
                0x31, // SET
                0b1000_0000 | lengthBytes.length, // Definite long-form length
                ...lengthBytes, // length
            ]);
        })()
        : Buffer.from([ 0x31, searchInfoLength ]); // SET + Length

    // This is a SET type, so the components MUST be re-ordered for DER-encoding.

    const searchInfoBuffer = Buffer.concat([
        searchInfoTLBytes,
        nameBuffer,
        resultsOuterTagAndLengthBytes,
        resultsInnerTagAndLengthBytes,
        ...results.map((r) => r.entry_info),
        poqBuffer,
        altMatchingBuffer,
        notificationBuffer,
        adBuffer,
        performerBuffer,
        spBuffer,
    ]);

    // #endregion Less-decoding optimization.

    const resultStats: SearchResultStatistics = {
        altMatching: mergedResult.altMatching,
        numberOfResults: results.length,
        uncorrelatedSearchInfo: [],
    };

    const poqStats = poq
        ? getPartialOutcomeQualifierStatistics(poq)
        : undefined;

    const unsignedReturnValue: MergeSearchResultsReturn = {
        encodedSearchResult: (() => {
            const el = new DERElement();
            el.fromBytes(searchInfoBuffer);
            return el;
        })(),
        resultStats,
        poqStats,
    };

    if (!signResults) {
        return unsignedReturnValue;
    }

    const key = ctx.config.signing?.key;
    if (!key) { // Signing is permitted to fail, per ITU Recommendation X.511 (2019), Section 7.10.
        return unsignedReturnValue;
    }
    const signingResult = generateSignature(key, searchInfoBuffer);
    if (!signingResult) {
        return unsignedReturnValue;
    }
    const [ sigAlg, sigValue ] = signingResult;
    const algIdBuffer = _encode_AlgorithmIdentifier(sigAlg, DER).toBytes();
    const sigValueTagAndLengthBytes = (sigValue.length + 1) >= 128
        ? (() => {
            const lengthBytes = encodeUnsignedBigEndianInteger(sigValue.length + 1);
            return Buffer.from([
                0x03, // BIT STRING
                0b1000_0000 | lengthBytes.length, // Definite long-form length
                ...lengthBytes, // length
                0x00, // trailing bits determinant
            ]);
        })()
        : Buffer.from([ 0x03, sigValue.length + 1, 0x00 ]); // BIT STRING + length + trailing bits determinant

    searchInfoLength += (
        searchInfoTLBytes.length
        + algIdBuffer.length
        + sigValueTagAndLengthBytes.length
        + sigValue.length
    );

    const signedBuffer = Buffer.concat([
        (searchInfoLength >= 128)
            ? (() => {
                const lengthBytes = encodeUnsignedBigEndianInteger(searchInfoLength);
                return Buffer.from([
                    0x30, // SEQUENCE
                    0b1000_0000 | lengthBytes.length, // Definite long-form length
                    ...lengthBytes, // length
                ]);
            })()
            : Buffer.from([ 0x30, searchInfoLength ]), // SEQUENCE + length
        searchInfoBuffer,
        algIdBuffer,
        sigValueTagAndLengthBytes, // ... and trailing bits determinant.
        sigValue,
    ]);
    /**
     * Getting to this code path with the CLI is possible like so:
     *
     * x500 dap search '' one --pageSize=10 --chainingProhibited
     *
     * ^Except you'll have to request target === signed, which currently means
     * modifying the X.500 CLI.
     */
    return {
        encodedSearchResult: (() => {
            const el = new DERElement();
            el.fromBytes(signedBuffer);
            return el;
        })(),
        resultStats,
        poqStats,
    };
}

export default mergeSortAndPageSearch;
