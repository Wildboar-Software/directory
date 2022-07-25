import type {
    Context,
    ClientAssociation,
    ListResultStatistics,
    PartialOutcomeQualifierStatistics,
} from "@wildboar/meerkat-types";
import {
    ASN1Element,
    DERElement,
    ASN1TagClass,
    encodeUnsignedBigEndianInteger,
    unpackBits,
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { DER } from "asn1-ts/dist/node/functional";
import type { OperationDispatcherState } from "./OperationDispatcher";
import { strict as assert } from "assert";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    ListArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgumentData.ta";
import {
    ListResult, _encode_ListResult,
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
import { MAX_RESULTS, MAX_SORT_KEYS } from "../constants";
import {
    LimitProblem_sizeLimitExceeded,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/LimitProblem.ta";
import type { ListState } from "./list_i";
import {
    ListResultData_listInfo_subordinates_Item as ListItem,
    _encode_ListResultData_listInfo_subordinates_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData-listInfo-subordinates-Item.ta";
import {
    ListResultData_listInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData-listInfo.ta";
import { generateSignature } from "../pki/generateSignature";
import { SIGNED } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SIGNED.ta";
import {
    _encode_Name,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Name.ta";
import {
    _encode_PartialOutcomeQualifier,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PartialOutcomeQualifier.ta";
import {
    _encode_SecurityParameters,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityParameters.ta";
import {
    _encode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    _encode_AlgorithmIdentifier,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import getPartialOutcomeQualifierStatistics from "../telemetry/getPartialOutcomeQualifierStatistics";

export
interface MergeListResultsReturn {
    readonly encodedListResult: ASN1Element;
    readonly resultStats: ListResultStatistics;
    readonly poqStats?: PartialOutcomeQualifierStatistics;
}

type IListInfo = { -readonly [K in keyof ListResultData_listInfo]: ListResultData_listInfo[K] };

/**
 * @summary Count the number of results in a `ListResult`
 * @description
 *
 * This function counts the number of results in a `ListResult`, recursing into
 * uncorrelated result sets, if they are present.
 *
 * @param lr The `ListResult` whose entries are to be counted
 * @returns The number of entries in the `ListResult`
 *
 * @function
 */
function getEntryCount (lr: ListResult): number {
    const data = getOptionallyProtectedValue(lr);
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

/**
 * @summary Merge two partial outcome qualifiers
 * @description
 *
 * Joins two partial outcome qualifiers to create one `PartialOutcomeQualifier`.
 *
 * NOTE: This differs from the `mergePOQ()` defined in
 * `mergeSortAndPageSearch.ts`.
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
        // NOTE: entryCount is only for `search` operations.
        undefined,
    );
}

/**
 * @summary Merge list result set into another list result set
 * @description
 *
 * This function uses a reducer pattern to merge an incoming list result set
 * into another list result set.
 *
 * @param acc The accumulating result set
 * @param resultSet The new result set to merge into the `acc` result set
 * @returns The `acc` result set, by reference
 *
 * @function
 */
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

/**
 * @summary Sorts two list subordinates
 * @description
 *
 * This function orders two `list` operation subordinates / results by returning
 * an integer that indicates which is "greater," if they are unequal, or `0` if
 * they are equal. This logic was purposefully chosen so that this function
 * could be used as a predicate in the `Array.sort()` method.
 *
 * @param ctx The context object
 * @param a One subordinate
 * @param b The other subordinate
 * @param sortKeys The sort keys from the paging request
 * @param reverse Whether the search should be reversed
 * @returns A number indicating whether `a` should appear before, `b`, or vice
 *  versa, or `0` if they are equal, according to the semantics of the predicate
 *  used in `Array.sort()`.
 *
 * @function
 */
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
        return compareSubordinates(ctx, a, b, sortKeys.slice(1, MAX_SORT_KEYS), reverse);
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
): Promise<MergeListResultsReturn> {
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
    const signResults: boolean = (
        (listArgument.securityParameters?.target === ProtectionRequest_signed)
        && assn.authorizedForSignedResults
    );
    // If there is no paging, we just return an arbitrary selection of the results that is less than the sizeLimit.
    if (!paging) {
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
                        signResults,
                        assn.boundNameAndUID?.dn,
                        list["&operationCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            },
        };
        const poqStats = listState.poq
            ? getPartialOutcomeQualifierStatistics(listState.poq)
            : undefined;
        const totalResult: ListResult = resultSetsToReturn.length
            ? {
                unsigned: {
                    uncorrelatedListInfo: [
                        ...resultSetsToReturn,
                        /**
                         * This will be unsigned, but that's acceptable, because
                         * the uncorrelatedListInfo as a whole will get signed.
                         */
                        localResult,
                    ],
                },
            }
            : localResult;

        const resultStats: ListResultStatistics = {
            numberOfSubordinates: getEntryCount(totalResult),
        };

        const unsignedReturnValue: MergeListResultsReturn = {
            encodedListResult: _encode_ListResult(totalResult, DER),
            resultStats,
            poqStats,
        };

        if (!signResults) {
            return unsignedReturnValue;
        }

        const signableBytes = Buffer.from(_encode_ListResult(totalResult, DER).toBytes().buffer);
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
            encodedListResult: _encode_ListResult({
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
            signResults,
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

    const poq = done
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
        );
    const sp = createSecurityParameters(
        ctx,
        signResults,
        assn.boundNameAndUID?.dn,
        list["&operationCode"],
    );

    // #region Less-decoding optimization.
    /*
        When you perform a list that is paginated, a page could be several
        megabytes in size and/or contain millions of results. Repeatedly
        encoding and decoding these results could be catastrophic to DSA
        performance. Fortunately, we can manually construct a ListResult
        from concatenated buffers to avoid decoding the `subordinates` just to
        re-encode them. This is pretty complicated, though.
    */
    const nameBuffer = (state.chainingArguments.aliasDereferenced && mergedResult.name)
        ? Buffer.from(_encode_Name(mergedResult.name, DER).toBytes().buffer)
        : Buffer.allocUnsafe(0);
    const poqBuffer = poq
        ? Buffer.from(
            $._encode_explicit(ASN1TagClass.context, 2, () => _encode_PartialOutcomeQualifier, DER)(poq, DER)
            .toBytes().buffer)
        : Buffer.allocUnsafe(0);
    const spBuffer = sp
        ? Buffer.from(
            $._encode_explicit(ASN1TagClass.context, 30, () => _encode_SecurityParameters, DER)(sp, DER)
                .toBytes().buffer
        )
        : Buffer.allocUnsafe(0);
    const performerBuffer = Buffer.from(
        $._encode_explicit(ASN1TagClass.context, 29, () => _encode_DistinguishedName, DER)
        (ctx.dsa.accessPoint.ae_title.rdnSequence, DER).toBytes().buffer);
    const adBuffer = state.chainingArguments.aliasDereferenced
        ? Buffer.from([ 0xBD, 0x03, 0x01, 0x01, 0xFF ]) // [29] TRUE
        : Buffer.allocUnsafe(0);
    let listInfoLength: number = (
        nameBuffer.length
        + poqBuffer.length
        + spBuffer.length
        + performerBuffer.length
        + adBuffer.length
    );
    let resultsByteLength = 0;
    for (const r of results) {
        resultsByteLength += r.subordinate_info.length;
    }
    listInfoLength += resultsByteLength;

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
                0xA1, // [1]
                0b1000_0000 | lengthBytes.length, // Definite long-form length
                ...lengthBytes, // length
            ]);
        })()
        : Buffer.from([ 0xA1, resultsInnerLength ]); // [1] + Length;

    listInfoLength += resultsInnerTagAndLengthBytes.length;
    listInfoLength += resultsOuterTagAndLengthBytes.length;

    // This is a SET type, so the components MUST be re-ordered for DER-encoding.

    const listInfoTLBytes = (listInfoLength >= 128)
        ? (() => {
            const lengthBytes = encodeUnsignedBigEndianInteger(listInfoLength);
            return Buffer.from([
                0x31, // SET
                0b1000_0000 | lengthBytes.length, // Definite long-form length
                ...lengthBytes, // length
            ]);
        })()
        : Buffer.from([ 0x31, listInfoLength ]); // SET + Length

    const listInfoBuffer = Buffer.concat([
        listInfoTLBytes,
        nameBuffer,
        resultsOuterTagAndLengthBytes,
        resultsInnerTagAndLengthBytes,
        ...results.map((r) => r.subordinate_info),
        poqBuffer,
        adBuffer,
        performerBuffer,
        spBuffer,
    ]);
    // #endregion Less-decoding optimization.

    const resultStats: ListResultStatistics = {
        numberOfSubordinates: results.length,
    };

    const poqStats = poq
        ? getPartialOutcomeQualifierStatistics(poq)
        : undefined;

    /**
     * Using DER encoding will NOT actually recursively DER-encode this element.
     * This is a bug in my ASN.1 compiler, where the selected codec does not
     * recurse completely. Fortunately, this is actually good, because it means
     * that the entries will not get re-ordered.
     */
    const unsignedReturnValue: MergeListResultsReturn = {
        encodedListResult: (() => {
            const el = new DERElement();
            el.fromBytes(listInfoBuffer);
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
    const signingResult = generateSignature(key, listInfoBuffer);
    if (!signingResult) {
        return unsignedReturnValue;
    }
    const [ sigAlg, sigValue ] = signingResult;
    const algIdBuffer = Buffer.from(_encode_AlgorithmIdentifier(sigAlg, DER).toBytes().buffer);
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

    listInfoLength += (
        listInfoTLBytes.length
        + algIdBuffer.length
        + sigValueTagAndLengthBytes.length
        + sigValue.length
    );

    const signedBuffer = Buffer.concat([
        (listInfoLength >= 128)
            ? (() => {
                const lengthBytes = encodeUnsignedBigEndianInteger(listInfoLength);
                return Buffer.from([
                    0x30, // SEQUENCE
                    0b1000_0000 | lengthBytes.length, // Definite long-form length
                    ...lengthBytes, // length
                ]);
            })()
            : Buffer.from([ 0x30, listInfoLength ]), // SEQUENCE + length
        listInfoBuffer,
        algIdBuffer,
        sigValueTagAndLengthBytes, // ... and trailing bits determinant.
        sigValue,
    ]);
    /**
     * Getting to this code path with the CLI is possible like so:
     *
     * x500 dap list '' --pageSize=10 --chainingProhibited
     *
     * ^Except you'll have to request target === signed, which currently means
     * modifying the X.500 CLI.
     */
    return {
        encodedListResult: (() => {
            const el = new DERElement();
            el.fromBytes(signedBuffer);
            return el;
        })(),
        resultStats,
        poqStats,
    };
}

export default mergeSortAndPageList;
