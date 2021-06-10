import type { Context, Entry } from "../../types";
import type {
    ListArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgument.ta";
import type {
    ListResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResult.ta";
import type DAPConnection from "../DAPConnection";
import {
    ListResultData_listInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData-listInfo.ta";
import {
    ListResultData_listInfo_subordinates_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData-listInfo-subordinates-Item.ta";
import {
    AbandonError,
    NameError,
    ServiceError,
    objectDoesNotExistErrorData,
} from "../errors";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_invalidQueryReference,
    ServiceProblem_unsupportedMatchingUse,
    ServiceProblem_unavailable,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    PartialOutcomeQualifier,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PartialOutcomeQualifier.ta";
import type {
    PagedResultsRequest_newRequest,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PagedResultsRequest-newRequest.ta";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    AbandonedProblem_pagingAbandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedProblem.ta";
import {
    EXT_BIT_PAGED_RESULTS_REQUEST,
    EXT_BIT_ABANDON_OF_PAGED_RESULTS,
} from "../../x500/extensions";
import { TRUE_BIT } from "asn1-ts";
import * as crypto from "crypto";
import findEntry from "../../x500/findEntry";
import getDistinguishedName from "../../x500/getDistinguishedName";

// list OPERATION ::= {
//   ARGUMENT  ListArgument
//   RESULT    ListResult
//   ERRORS    {nameError |
//              serviceError |
//              referral |
//              abandoned |
//              securityError}
//   CODE      id-opcode-list }

// ListArgument ::= OPTIONALLY-PROTECTED { ListArgumentData }

// ListArgumentData ::= SET {
//   object        [0]  Name,
//   pagedResults  [1]  PagedResultsRequest OPTIONAL,
//   listFamily    [2]  BOOLEAN DEFAULT FALSE,
//   ...,
//   ...,
//   COMPONENTS OF      CommonArguments
//   }

// ListResult ::= OPTIONALLY-PROTECTED { ListResultData }

// ListResultData ::= CHOICE {
//   listInfo                     SET {
//     name                         Name OPTIONAL,
//     subordinates            [1]  SET OF SEQUENCE {
//       rdn                          RelativeDistinguishedName,
//       aliasEntry              [0]  BOOLEAN DEFAULT FALSE,
//       fromEntry               [1]  BOOLEAN DEFAULT TRUE,
//       ... },
//     partialOutcomeQualifier [2]  PartialOutcomeQualifier OPTIONAL,
//     ...,
//     ...,
//     COMPONENTS OF                CommonResults
//     },
//   uncorrelatedListInfo    [0]  SET OF ListResult,
//   ... }

// PartialOutcomeQualifier ::= SET {
//   limitProblem                  [0]  LimitProblem OPTIONAL,
//   unexplored                    [1]  SET SIZE (1..MAX) OF ContinuationReference OPTIONAL,
//   unavailableCriticalExtensions [2]  BOOLEAN DEFAULT FALSE,
//   unknownErrors                 [3]  SET SIZE (1..MAX) OF ABSTRACT-SYNTAX.&Type OPTIONAL,
//   queryReference                [4]  OCTET STRING OPTIONAL,
//   overspecFilter                [5]  Filter OPTIONAL,
//   notification                  [6]  SEQUENCE SIZE (1..MAX) OF
//                                        Attribute{{SupportedAttributes}} OPTIONAL,
//   entryCount                         CHOICE {
//     bestEstimate                  [7]  INTEGER,
//     lowEstimate                   [8]  INTEGER,
//     exact                         [9]  INTEGER,
//     ...} OPTIONAL
//   --                            [10] Not to be used -- }

// LimitProblem ::= INTEGER {
//   timeLimitExceeded           (0),
//   sizeLimitExceeded           (1),
//   administrativeLimitExceeded (2) }

// Extensions:
// TODO: subentries
// TODO: copyShallDo (Blocked on shadowing)
// TODO: use of contexts? (The spec says this is used by the list operation, but I don't see how.)

// Controls
// TODO: size limit (paging takes precedence)
// TODO: ServiceControlOptions.dontUseCopy
// TODO: ServiceControlOptions.copyShallDo (when shadowing is implemented.)
// TODO: ServiceControlOptions.

const BYTES_IN_A_UUID: number = 16;


/**
 *
 * ## Important Note:
 *
 * From ITU Recommendation X.511 (2016), section 7.9:
 *
 * > Although a DUA may request pagedResults, a DSA is permitted to ignore the
 * > request and return its results in the normal manner.
 *
 * @param ctx
 * @param connection
 * @param arg
 * @returns
 */
export
async function list (
    ctx: Context,
    connection: DAPConnection,
    arg: ListArgument,
): Promise<ListResult> {
    const data = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;
    if (
        data.serviceControls?.sizeLimit
        && (
            (data.serviceControls.sizeLimit < 1)
            || !Number.isSafeInteger(data.serviceControls.sizeLimit)
        )
    ) {
        throw new Error();
    }

    const useOfPaging = (data.criticalExtensions?.[EXT_BIT_PAGED_RESULTS_REQUEST] === TRUE_BIT);
    if (!useOfPaging && data.pagedResults) {
        throw new ServiceError(
            "Use of paging was not enabled by the request.",
            new ServiceErrorData(
                ServiceProblem_unavailable,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    }
    const useOfAbandonPaging = (data.criticalExtensions?.[EXT_BIT_ABANDON_OF_PAGED_RESULTS] === TRUE_BIT);
    let pagingRequest: PagedResultsRequest_newRequest | undefined;
    let page: number = 0;
    let queryReference: string | undefined;
    if (data.pagedResults) {
        if ("newRequest" in data.pagedResults) {
            const nr = data.pagedResults.newRequest;
            const pi = ((nr.pageNumber ?? 1) - 1); // The spec is unclear if this is zero-indexed.
            if ((pi < 0) || !Number.isSafeInteger(pi)) {
                throw new ServiceError(
                    `Paginated query page index ${pi} is invalid.`,
                    new ServiceErrorData(
                        ServiceProblem_invalidQueryReference,
                        [],
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                    ),
                );
            }
            // pageSize = 0 is a problem because we push entry to results before checking if we have a full page.
            if ((nr.pageSize < 1) || !Number.isSafeInteger(nr.pageSize)) {
                throw new ServiceError(
                    `Paginated query page size ${nr.pageSize} is invalid.`,
                    new ServiceErrorData(
                        ServiceProblem_invalidQueryReference,
                        [],
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                    ),
                );
            }
            queryReference = crypto.randomBytes(BYTES_IN_A_UUID).toString("base64");
            connection.pagedResultsRequests.set(queryReference, [ nr, pi ]);
            pagingRequest = data.pagedResults.newRequest;
            page = ((data.pagedResults.newRequest.pageNumber ?? 1) - 1);
        } else if ("queryReference" in data.pagedResults) {
            queryReference = Buffer.from(data.pagedResults.queryReference).toString("base64");
            const paging = connection.pagedResultsRequests.get(queryReference);
            if (!paging) {
                throw new ServiceError(
                    `Paginated query reference '${queryReference.slice(0, 32)}' is invalid.`,
                    new ServiceErrorData(
                        ServiceProblem_invalidQueryReference,
                        [],
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                    ),
                );
            }
            pagingRequest = paging[0];
            page = paging[1];
        } else if ("abandonQuery" in data.pagedResults) {
            if (!useOfAbandonPaging) {
                throw new ServiceError(
                    "Use of abandoning paging was not enabled by the request.",
                    new ServiceErrorData(
                        ServiceProblem_unavailable,
                        [],
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                    ),
                );
            }
            queryReference = Buffer.from(data.pagedResults.abandonQuery).toString("base64");
            throw new AbandonError(
                `Abandoned paginated query identified by query reference '${queryReference.slice(0, 32)}'.`,
                new AbandonedData(
                    AbandonedProblem_pagingAbandoned,
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        } else {
            throw new ServiceError(
                "Unrecognized paginated query syntax.",
                new ServiceErrorData(
                    ServiceProblem_unavailable,
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
    }
    const base = findEntry(ctx, ctx.database.data.dit, data.object.rdnSequence);
    if (!base) {
        throw new NameError(
            "No such object.",
            objectDoesNotExistErrorData(ctx, data.object),
        );
    }

    const skip: number = pagingRequest
        ? page * pagingRequest.pageSize
        : 0;
    const pageSize: number = pagingRequest?.pageSize
        ?? data.serviceControls?.sizeLimit
        ?? Infinity;
    const results: Entry[] = base.children;
    const completeResults: boolean = ((skip + pageSize) < base.children.length);
    if (queryReference && pagingRequest) {
        connection.pagedResultsRequests.set(queryReference, [ pagingRequest, (page + 1) ]);
    }
    // Meerkat will only sort the results of the page, and only by the first sort key.
    const sortKey = (pagingRequest?.sortKeys && (pagingRequest.sortKeys.length > 0))
        ? pagingRequest.sortKeys[0]
        : undefined;

    if (sortKey) {
        const A_IS_GREATER: number = 1;
        const B_IS_GREATER: number = -1;
        const SORT_TYPE_OID: string = sortKey.type_.toString();
        const attr = ctx.attributes.get(SORT_TYPE_OID);
        const order = sortKey.orderingRule
            ? ctx.orderingMatchingRules.get(sortKey.orderingRule.toString())
            : attr?.orderingMatcher; // FIXME: Change this to a reference to the matching rule, rather than the matcher.
        if (!order) {
            throw new ServiceError(
                "Unrecognized matching rule used in list.",
                new ServiceErrorData(
                    ServiceProblem_unsupportedMatchingUse,
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
        results.sort((a: Entry, b: Entry): number => {
            const ardn = a.rdn;
            const brdn = b.rdn;
            /**
             * From ITU X.511 (2016), Section 7.9:
             *
             * > if the attribute type is missing from the returned results, it
             * > is regarded as "greater" than all other matched values.
             */
            if (!ardn || (ardn.length === 0)) {
                return (pagingRequest!.reverse ? B_IS_GREATER : A_IS_GREATER);
            }
            if (!brdn || (brdn.length === 0)) {
                return (pagingRequest!.reverse ? A_IS_GREATER : B_IS_GREATER);
            }
            const aatav = ardn.find((atav) => (atav.type_.toString() === SORT_TYPE_OID));
            const batav = brdn.find((atav) => (atav.type_.toString() === SORT_TYPE_OID));
            if (!aatav) {
                return (pagingRequest!.reverse ? B_IS_GREATER : A_IS_GREATER);
            }
            if (!batav) {
                return (pagingRequest!.reverse ? A_IS_GREATER : B_IS_GREATER);
            }
            return pagingRequest!.reverse
                ? (order(aatav.value, batav.value) * -1)
                : order(aatav.value, batav.value);
        });
    }

    return {
        unsigned: {
            listInfo: new ListResultData_listInfo(
                base.aliasedEntry // If we made it this far, it's because this resolved.
                    ? {
                        rdnSequence: getDistinguishedName(base.aliasedEntry),
                    }
                    : undefined,
                results.slice(skip, pageSize).map((result) => new ListResultData_listInfo_subordinates_Item(
                    result.rdn,
                    result.aliasedEntry ? true : false,
                    false, // TODO: Will change when shadowing is implemented.
                )),
                (completeResults && queryReference)
                    ? undefined
                    : new PartialOutcomeQualifier(
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        Buffer.from(queryReference!, "base64"),
                        undefined,
                        undefined,
                        undefined,
                    ),
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        },
    };
}

export default list;
