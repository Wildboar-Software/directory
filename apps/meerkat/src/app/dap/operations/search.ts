import type { Context, Entry } from "../../types";
import type {
    SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import type {
    SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
import DAPConnection from "../DAPConnection";
import {
    SearchArgumentData_subset,
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import {
    EntryInformation,
    SearchResultData_searchInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResultData-searchInfo.ta";
import {
    ServiceControlOptions_dontDereferenceAliases,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
// import {
//     JoinArgument_joinSubset,
//     JoinArgument_joinSubset_baseObject,
//     JoinArgument_joinSubset_oneLevel,
//     JoinArgument_joinSubset_wholeSubtree,
// } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/JoinArgument-joinSubset.ta";
import {
    HierarchySelections_self,
    HierarchySelections_children,
    HierarchySelections_parent,
    HierarchySelections_hierarchy,
    HierarchySelections_top,
    HierarchySelections_subtree,
    HierarchySelections_siblings,
    HierarchySelections_siblingChildren,
    HierarchySelections_siblingSubtree,
    HierarchySelections_all,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/HierarchySelections.ta";
// import {
//     _enum_for_SearchArgumentData_joinType as JoinType,
//     SearchArgumentData_joinType,
//     SearchArgumentData_joinType_fullOuterJoin as fullOuterJoin,
//     SearchArgumentData_joinType_innerJoin as innerJoin,
//     SearchArgumentData_joinType_leftOuterJoin as leftOuterJoin,
// } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-joinType.ta";
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
import { evaluateFilter, FilterEntryOptions } from "@wildboar/x500/src/lib/evaluateFilter";
import {
    AbandonError,
    NameError,
    ServiceError,
    objectDoesNotExistErrorData,
} from "../errors";
import findEntry from "../../x500/findEntry";
// import canJoin from "../../x500/canJoin";
import entryInformationFromEntry from "../../x500/entryInformationFromEntry";
import selectFromEntry from "../../x500/selectFromEntry";
import { TRUE_BIT, OBJECT_IDENTIFIER } from "asn1-ts";
import { EntryInformation_information_Item } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import { ServiceErrorData, ServiceProblem_unwillingToPerform } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import * as crypto from "crypto";
import getSubset from "../../x500/getSubset";
import readEntry from "../../database/readEntry";
import EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import OrderingMatcher from "@wildboar/x500/src/lib/types/OrderingMatcher";
import SubstringsMatcher from "@wildboar/x500/src/lib/types/SubstringsMatcher";
import ApproxMatcher from "@wildboar/x500/src/lib/types/ApproxMatcher";
import ContextMatcher from "@wildboar/x500/src/lib/types/ContextMatcher";
// import sort from "@wildboar/x500/src/lib/dap/sort";

// search OPERATION ::= {
//   ARGUMENT  SearchArgument
//   RESULT    SearchResult
//   ERRORS    {attributeError |
//              nameError |
//              serviceError |
//              referral |
//              abandoned |
//              securityError}
//   CODE      id-opcode-search }

// SearchArgument ::= OPTIONALLY-PROTECTED { SearchArgumentData }

// SearchArgumentData ::= SET {
//   baseObject            [0]  Name,
//   subset                [1]  INTEGER {
//     baseObject    (0),
//     oneLevel      (1),
//     wholeSubtree  (2)} DEFAULT baseObject,
//   filter                [2]  Filter DEFAULT and:{},
//   searchAliases         [3]  BOOLEAN DEFAULT TRUE,
//   selection             [4]  EntryInformationSelection DEFAULT {},
//   pagedResults          [5]  PagedResultsRequest OPTIONAL,
//   matchedValuesOnly     [6]  BOOLEAN DEFAULT FALSE,
//   extendedFilter        [7]  Filter OPTIONAL,
//   checkOverspecified    [8]  BOOLEAN DEFAULT FALSE,
//   relaxation            [9]  RelaxationPolicy OPTIONAL,
//   extendedArea          [10] INTEGER OPTIONAL,
//   hierarchySelections   [11] HierarchySelections DEFAULT {self},
//   searchControlOptions  [12] SearchControlOptions DEFAULT {searchAliases},
//   joinArguments         [13] SEQUENCE SIZE (1..MAX) OF JoinArgument OPTIONAL,
//   joinType              [14] ENUMERATED {
//     innerJoin      (0),
//     leftOuterJoin  (1),
//     fullOuterJoin  (2)} DEFAULT leftOuterJoin,
//   ...,
//   ...,
//   COMPONENTS OF              CommonArguments }

// HierarchySelections ::= BIT STRING {
//   self                  (0),
//   children              (1),
//   parent                (2),
//   hierarchy             (3),
//   top                   (4),
//   subtree               (5),
//   siblings              (6),
//   siblingChildren       (7),
//   siblingSubtree        (8),
//   all                   (9) }

// SearchControlOptions ::= BIT STRING {
//   searchAliases         (0),
//   matchedValuesOnly     (1),
//   checkOverspecified    (2),
//   performExactly        (3),
//   includeAllAreas       (4),
//   noSystemRelaxation    (5),
//   dnAttribute           (6),
//   matchOnResidualName   (7),
//   entryCount            (8),
//   useSubset             (9),
//   separateFamilyMembers (10),
//   searchFamily          (11) }

// JoinArgument ::= SEQUENCE {
//   joinBaseObject  [0]  Name,
//   domainLocalID   [1]  DomainLocalID OPTIONAL,
//   joinSubset      [2]  ENUMERATED {
//     baseObject   (0),
//     oneLevel     (1),
//     wholeSubtree (2),
//     ... } DEFAULT baseObject,
//   joinFilter      [3]  Filter OPTIONAL,
//   joinAttributes  [4]  SEQUENCE SIZE (1..MAX) OF JoinAttPair OPTIONAL,
//   joinSelection   [5]  EntryInformationSelection,
//   ... }

// DomainLocalID ::= UnboundedDirectoryString

// JoinAttPair ::= SEQUENCE {
//   baseAtt      AttributeType,
//   joinAtt      AttributeType,
//   joinContext  SEQUENCE SIZE (1..MAX) OF JoinContextType OPTIONAL,
//   ... }

// JoinContextType ::= CONTEXT.&id({SupportedContexts})

// SearchResult ::= OPTIONALLY-PROTECTED { SearchResultData }

// SearchResultData ::= CHOICE {
//   searchInfo                    SET {
//     name                          Name OPTIONAL,
//     entries                  [0]  SET OF EntryInformation,
//     partialOutcomeQualifier  [2]  PartialOutcomeQualifier OPTIONAL,
//     altMatching              [3]  BOOLEAN DEFAULT FALSE,
//     ...,
//     ...,
//     COMPONENTS OF                 CommonResults
//     },
//   uncorrelatedSearchInfo   [0]  SET OF SearchResult,
//   ... }

// RelaxationPolicy ::= SEQUENCE {
//     basic        [0]  MRMapping DEFAULT {},
//     tightenings  [1]  SEQUENCE SIZE (1..MAX) OF MRMapping OPTIONAL,
//     relaxations  [2]  SEQUENCE SIZE (1..MAX) OF MRMapping OPTIONAL,
//     maximum      [3]  INTEGER OPTIONAL, -- mandatory if tightenings is present
//     minimum      [4]  INTEGER DEFAULT 1,
//     ... }

//   MRMapping ::= SEQUENCE {
//     mapping       [0]  SEQUENCE SIZE (1..MAX) OF Mapping OPTIONAL,
//     substitution  [1]  SEQUENCE SIZE (1..MAX) OF MRSubstitution OPTIONAL,
//     ... }

//   Mapping ::= SEQUENCE {
//     mappingFunction  OBJECT IDENTIFIER (CONSTRAINED BY {-- shall be an--
//                        -- object identifier of a mapping-based matching algorithm -- }),
//     level            INTEGER DEFAULT 0,
//     ... }

//   MRSubstitution ::= SEQUENCE {
//     attribute             AttributeType,
//     oldMatchingRule  [0]  MATCHING-RULE.&id OPTIONAL,
//     newMatchingRule  [1]  MATCHING-RULE.&id OPTIONAL,
//     ... }

// This might seem petty, but it deduplicates a lot of code.
function toEntryAndInfo (ctx: Context, entry: Entry): [ Entry, EntryInformation ] {
    return [
        entry,
        entryInformationFromEntry(ctx, entry),
    ];
}

const BYTES_IN_A_UUID: number = 16;

// Find entry (subject to dontDereferenceAliases service control)
// Create candidates set using object, subset, and searchAliases parameters.
// Filter them from extendedFilter ?? filter
// checkOverspecified can be ignored. (Still nice to have...)
// relaxation should only be used if there is no service-specific AA-imposed RP. Influenced by extendedArea.
// if relaxation, search entries again
// perform hierarchy selections
// perform joins on the intermediate results
// Apply selections from selection
export
async function search (
    ctx: Context,
    connection: DAPConnection,
    arg: SearchArgument,
): Promise<SearchResult> {
    const data = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;

    // let aliasesDereferenced: boolean = false;
    const dontDereferenceAliases: boolean = (
        data.serviceControls?.options?.[ServiceControlOptions_dontDereferenceAliases] === TRUE_BIT);

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
    const skip: number = pagingRequest
        ? page * pagingRequest.pageSize
        : 0;
    const pageSize: number = pagingRequest?.pageSize
        ?? data.serviceControls?.sizeLimit
        ?? Infinity;
    if (queryReference && pagingRequest) {
        connection.pagedResultsRequests.set(queryReference, [ pagingRequest, (page + 1) ]);
    }
    // Meerkat will only sort the results of the page, and only by the first sort key.
    const sortKey = (pagingRequest?.sortKeys && (pagingRequest.sortKeys.length > 0))
        ? pagingRequest.sortKeys[0]
        : undefined;

    const entry: Entry | undefined = findEntry(
        ctx,
        ctx.database.data.dit,
        data.baseObject.rdnSequence,
        !dontDereferenceAliases,
    );
    if (!entry) {
        throw new NameError(
            "No such object.",
            objectDoesNotExistErrorData(ctx, data.baseObject),
        );
    }

    const intialCandidates = getSubset(
        entry,
        data.subset ?? SearchArgumentData_subset_baseObject,
        data.searchAliases,
    );

    const filterableCandidates: [ Entry, EntryInformation ][] = intialCandidates.map((candidate) => [
        candidate,
        entryInformationFromEntry(ctx, candidate),
    ]);

    const applicableFilter = data.filter ?? data.extendedFilter;

    const filterOptions: FilterEntryOptions = {
        getEqualityMatcher: (attributeType: OBJECT_IDENTIFIER): EqualityMatcher | undefined => {
            const spec = ctx.attributes.get(attributeType.toString());
            return spec?.equalityMatcher;
        },
        getOrderingMatcher: (attributeType: OBJECT_IDENTIFIER): OrderingMatcher | undefined => {
            const spec = ctx.attributes.get(attributeType.toString());
            return spec?.orderingMatcher;
        },
        getSubstringsMatcher: (attributeType: OBJECT_IDENTIFIER): SubstringsMatcher | undefined => {
            const spec = ctx.attributes.get(attributeType.toString());
            return spec?.substringsMatcher;
        },
        getApproximateMatcher: (attributeType: OBJECT_IDENTIFIER): ApproxMatcher | undefined => {
            const spec = ctx.attributes.get(attributeType.toString());
            return spec?.approxMatcher;
        },
        getContextMatcher: (contextType: OBJECT_IDENTIFIER): ContextMatcher | undefined => {
            return ctx.contextMatchers.get(contextType.toString());
        },
        isMatchingRuleCompatibleWithAttributeType: (mr: OBJECT_IDENTIFIER, at: OBJECT_IDENTIFIER): boolean => {
            return true; // FIXME:
        },
        isAttributeSubtype: (attributeType: OBJECT_IDENTIFIER, parentType: OBJECT_IDENTIFIER): boolean => {
            return false; // FIXME:
        },
        performExactly: false,
    };

    // FIXME: evaluateFilter is incomplete still. No support for dnAttributes, noSubtypeMatch, performExactly, etc.
    let candidates = filterableCandidates
        .filter(([, candidate]) => !applicableFilter || evaluateFilter(applicableFilter, candidate, filterOptions));

    // checkOverspecified can be ignored. (Still nice to have...)

    // TODO: relaxation should only be used if there is no service-specific AA-imposed RP. Influenced by extendedArea.
    // if relaxation, search entries again
    if (data.relaxation) {
        if (filterableCandidates.length < (data.relaxation.minimum ?? 1)) {
            candidates = filterableCandidates
                .filter(([, candidate]) => !applicableFilter || evaluateFilter(applicableFilter, candidate, {
                    ...filterOptions,
                    // FIXME: applied relaxations
                }));
        } else if (data.relaxation.maximum && (filterableCandidates.length > (data.relaxation.maximum))) {
            candidates = filterableCandidates
                .filter(([, candidate]) => !applicableFilter || evaluateFilter(applicableFilter, candidate, {
                    ...filterOptions,
                    // FIXME: applied tightenings
                }));
        }
    }

    // perform hierarchy selections
    if (data.hierarchySelections) {
        const all: boolean = (data.hierarchySelections[HierarchySelections_all] === TRUE_BIT);
        const self: boolean = (data.hierarchySelections[HierarchySelections_self] === TRUE_BIT) || all;
        const children: boolean = (data.hierarchySelections[HierarchySelections_children] === TRUE_BIT) || all;
        const parent: boolean = (data.hierarchySelections[HierarchySelections_parent] === TRUE_BIT) || all;
        const hierarchy: boolean = (data.hierarchySelections[HierarchySelections_hierarchy] === TRUE_BIT) || all;
        const top: boolean = (data.hierarchySelections[HierarchySelections_top] === TRUE_BIT) || all;
        const subtree: boolean = (data.hierarchySelections[HierarchySelections_subtree] === TRUE_BIT) || all;
        const siblings: boolean = (data.hierarchySelections[HierarchySelections_siblings] === TRUE_BIT) || all;
        const siblingChildren: boolean = (data.hierarchySelections[HierarchySelections_siblingChildren] === TRUE_BIT) || all;
        const siblingSubtree: boolean = (data.hierarchySelections[HierarchySelections_siblingSubtree] === TRUE_BIT) || all;

        const getHierarchicalSubtree = (e: Entry): Entry[] => e.hierarchy?.children
            .flatMap((c) => getHierarchicalSubtree(c)) ?? [];
        // Add non-self hierarchy selections
        candidates = candidates
            .flatMap(([entry]) => {
                if (!entry.hierarchy) {
                    return [[ entry, entryInformationFromEntry(ctx, entry) ]];
                }

                let ret: [ Entry, EntryInformation ][] = [];
                if (children) {
                    ret.push(...entry.hierarchy.children
                        .map((child): [ Entry, EntryInformation ] => toEntryAndInfo(ctx, child)));
                }
                if (parent && entry.hierarchy.parent) {
                    ret.push(toEntryAndInfo(ctx, entry.hierarchy.parent));
                }
                if (hierarchy) {
                    let current: Entry | undefined = entry.parent;
                    while (current) {
                        ret.push(toEntryAndInfo(ctx, current));
                        current = current.parent;
                    }
                }
                if (top) {
                    ret.push(toEntryAndInfo(ctx, entry.hierarchy.top));
                }
                if (subtree) {
                    ret.push(...getHierarchicalSubtree(entry)
                        .map((e): [ Entry, EntryInformation ] => toEntryAndInfo(ctx, e)));
                }
                if (siblings && entry.hierarchy.parent) {
                    // Yes, this will include the current entry.
                    ret.push(
                        ...entry.hierarchy.parent.hierarchy?.children
                            .map((sibling): [ Entry, EntryInformation ] => toEntryAndInfo(ctx, sibling)) ?? [],
                    );
                }
                if (siblingChildren && entry.hierarchy.parent) {
                    // Yes, this will include the current entry.
                    ret.push(
                        ...entry.hierarchy.parent.hierarchy?.children
                            .flatMap((sibling): [ Entry, EntryInformation ][] => sibling.hierarchy?.children
                                .map((child) => toEntryAndInfo(ctx, child)) ?? []) ?? [],
                    );
                }
                if (siblingSubtree && entry.hierarchy.parent) {
                    // Yes, this will include the current entry.
                    ret.push(
                        ...entry.hierarchy.parent.hierarchy?.children
                            .flatMap((sibling): [ Entry, EntryInformation ][] => getHierarchicalSubtree(sibling)
                                .map((e) => toEntryAndInfo(ctx, e))) ?? [],
                    );
                }
                if (!self) {
                    ret = ret.filter(([e]) => (e.uuid !== entry.uuid));
                }
                return ret;
            });
    }

    // Deduplicates entries.
    candidates = Array.from(
        (new Map(candidates.map((e) => [ e[0].uuid, e ]))).values()
    );

    // const rightOuter: EntryInformation[] = [];
    /**
     * NOTE: Joins are going to be ENTIRELY UNSUPPORTED, because many details
     * are unspecified:
     *
     * - The `relatedEntry` attribute that joining depends on is _undefined_ by any ITU specification.
     * - ~~It is not clear what `JoinArgument.domainLocalID` even is, nor how to handle if it is not understood.~~
     *   - I rescined this statement^. `domainLocalID` is defined in X.518.
     *   - However, it is still undefined what to do if it is not recognized.
     *
     * If this is ever implemented, the code below will also need to perform
     * pagination before joining. The code below is _extremely unscalable_.
     * Because every entry has to be compared against every other entry
     * (and indexing attribute values generally is not viable), the compute
     * time will grow a O(n^2) or even worse time (because all attributes of
     * each entry must be compared, and the same for all values of said
     * attributes.) This is so unscalable, I had doubts about implementing it
     * in the first place.
     *
     * Also, if the code below is ever implemented, another deduplication may be
     * necessary, because the additional entries brought in by the joins may
     * overlap. On the other hand, maybe it's fine to allow the user to do this?
     *
     * For now, if a join is attempted, the server should just return an
     * unwillingToPerform error.
     */
    if (data.joinArguments) {
        throw new ServiceError(
            "Joins are entirely unsupported by this server.",
            new ServiceErrorData(
                ServiceProblem_unwillingToPerform,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    //     // Get the additional search results.
    //     // If it joins, primary.relatedEntry.push(foreign);
    //     // If outer join, additionals.push(foreign);
    //     // If inner, filter out entries without relatedEntry
    //     // Set derivedEntry = TRUE for all joined entries.
    //     data.joinArguments.forEach((ja) => {
    //         if (!ja.joinAttributes) {
    //             return;
    //         }
    //         const foreignEntry: Entry | undefined = findEntry(
    //             ctx,
    //             ctx.database.data.dit,
    //             ja.joinBaseObject.rdnSequence,
    //             !dontDereferenceAliases,
    //         );
    //         if (!foreignEntry) {
    //             throw new NameError(
    //                 "No such object.",
    //                 objectDoesNotExistErrorData(ctx, ja.joinBaseObject),
    //             );
    //         }
    //         const intialForeignCandidates = getSubset(
    //             foreignEntry,
    //             ja.joinSubset ?? JoinArgument_joinSubset_baseObject,
    //             data.searchAliases,
    //         );
    //         const filterableForeignCandidates: [ Entry, EntryInformation ][] = intialForeignCandidates
    //             .map((candidate) => [
    //                 candidate,
    //                 entryInformationFromEntry(ctx, candidate),
    //             ]);
    //         const applicableJoinFilter = ja.joinFilter ?? applicableFilter;
    //         const viableForeignCandidates = filterableForeignCandidates
    //             .filter(([, candidate]) => (
    //                 !applicableJoinFilter
    //                 || evaluateFilter(applicableJoinFilter, candidate, filterOptions)
    //             ))
    //             .map((c) => c[1]);

    //         candidates.forEach((candidate) => {
    //             const primaryEntry: EntryInformation = candidate[1];
    //             viableForeignCandidates.forEach((vfc) => {
    //                 const anyJoinMatches: boolean = ja.joinAttributes!
    //                     .some((ja) => canJoin(ctx, primaryEntry, vfc, ja));
    //                 if (!anyJoinMatches) {
    //                     return;
    //                 }
    //                 // Does the relatedEntry itself need a relatedEntry attribute?
    //                 const relatedEntry = ja.joinSelection
    //                     ? new EntryInformation(
    //                         vfc.name,
    //                         vfc.fromEntry,
    //                         selectFromEntry(ctx, ja.joinSelection, vfc[1]),
    //                         undefined,
    //                         undefined,
    //                         undefined,
    //                     )
    //                     : vfc;
    //                 if (data.joinType === JoinType.fullOuterJoin) {
    //                     rightOuter.push(relatedEntry);
    //                 }

    //             });
    //         });
    //     });
    }

    const completeResults: boolean = ((skip + pageSize) < candidates.length);

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
                "Unrecognized matching rule used in search.",
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
        // TODO: Generalize this into the X.500 library.
        candidates.sort((a, b): number => {
            const [ , ainfo ] = a;
            const [ , binfo ] = b;
            const aattrinfo = ainfo.information?.find((attr) => (
                ("attribute" in attr)
                && (attr.attribute.type_.toString() === SORT_TYPE_OID)
            ));
            const battrinfo = binfo.information?.find((attr) => (
                ("attribute" in attr)
                && (attr.attribute.type_.toString() === SORT_TYPE_OID)
            ));

            /**
             * From ITU X.511 (2016), Section 7.9:
             *
             * > if the attribute type is missing from the returned results, it
             * > is regarded as "greater" than all other matched values.
             */
            if (!aattrinfo) {
                return (pagingRequest!.reverse ? B_IS_GREATER : A_IS_GREATER);
            }
            if (!battrinfo) {
                return (pagingRequest!.reverse ? A_IS_GREATER : B_IS_GREATER);
            }
            if (!("attribute" in aattrinfo) || !("attribute" in battrinfo)) {
                throw new Error();
            }
            const aattr = aattrinfo.attribute;
            const battr = battrinfo.attribute;

            const lowestAValue = [
                ...aattr.values,
                ...aattr.valuesWithContext?.map((vwc) => vwc.value) ?? []
            ].sort((a, b) => order(a, b))[0];
            const lowestBValue = [
                ...battr.values,
                ...battr.valuesWithContext?.map((vwc) => vwc.value) ?? []
            ].sort((a, b) => order(a, b))[0];

            return pagingRequest!.reverse
                ? (order(lowestAValue, lowestBValue) * -1)
                : order(lowestAValue, lowestBValue);
        });
    }

    // TODO: Use a default EIS instead.
    // Apply selections from selection
    if (data.selection) {
        const eis = data.selection;
        const attrs = await readEntry(ctx, entry);
        const selectedInfos = candidates
            .map(([ entry, einfo ]): [ EntryInformation, EntryInformation_information_Item[] ] => [
                einfo,
                selectFromEntry(ctx, eis, entry, attrs),
            ])
            .slice(skip, pageSize);
        return {
            unsigned: {
                searchInfo: new SearchResultData_searchInfo(
                    undefined, // FIXME: if dereferenced.
                    selectedInfos.map(([einfo, selectedInfoItems]) => new EntryInformation(
                        einfo.name,
                        einfo.fromEntry,
                        selectedInfoItems,
                        einfo.incompleteEntry,
                        einfo.partialName,
                        einfo.derivedEntry,
                    )), // FIXME: This will return operational attributes.
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
                    false, // FIXME: Will change once relaxation is implemented.
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            },
        };
    } else {
        return {
            unsigned: {
                searchInfo: new SearchResultData_searchInfo(
                    undefined, // FIXME: if dereferenced.
                    candidates
                        .map(([, einfo]) => einfo)
                        .slice(skip, pageSize), // FIXME: This will return operational attributes.
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
                    false, // FIXME: Will change once relaxation is implemented.
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            },
        };
    }
}

export default search;
