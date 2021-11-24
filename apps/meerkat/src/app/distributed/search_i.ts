import type {
    Context,
    Vertex,
    ClientConnection,
    WithRequestStatistics,
    WithOutcomeStatistics,
    PagedResultsRequestState,
    IndexableOID,
    Value,
    StoredContext,
    DIT,
} from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import * as crypto from "crypto";
import { DER } from "asn1-ts/dist/node/functional";
import {
    SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import {
    SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import {
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import {
    HierarchySelections_self,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/HierarchySelections.ta";
import { OBJECT_IDENTIFIER, TRUE_BIT, TRUE, ASN1Element, ObjectIdentifier } from "asn1-ts";
import readChildren from "../dit/readChildren";
import readChildrenSorted from "../dit/readChildrenSorted";
import {
    ChainingArguments,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    ServiceControlOptions_subentries as subentriesBit,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    _encode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type ContextMatcher from "@wildboar/x500/src/lib/types/ContextMatcher";
import getDistinguishedName from "../x500/getDistinguishedName";
import { evaluateFilter, EvaluateFilterSettings } from "@wildboar/x500/src/lib/utils/evaluateFilter";
import { EntryInformation } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import {
    EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import {
    ContinuationReference,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import {
    OperationProgress,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress.ta";
import {
    OperationProgress_nameResolutionPhase_completed,
    OperationProgress_nameResolutionPhase_proceeding,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import {
    ReferenceType_nonSpecificSubordinate,
    ReferenceType_subordinate,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ReferenceType.ta";
import {
    AccessPointInformation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPointInformation.ta";
import splitIntoMastersAndShadows from "@wildboar/x500/src/lib/utils/splitIntoMastersAndShadows";
import isPrefix from "../x500/isPrefix";
import searchAliasesProcedure from "./searchAliases";
import hierarchySelectionProcedure from "./hierarchySelection";
import checkSuitabilityProcedure from "./checkSuitability";
import {
    search,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import {
    ServiceControlOptions_dontUseCopy,
    ServiceControlOptions_copyShallDo,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    MasterOrShadowAccessPoint_category_master,
    MasterOrShadowAccessPoint_category_shadow,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint-category.ta";
import getAttributeTypesFromFilter from "../x500/getAttributeTypesFromFilter";
import readAttributes from "../database/entry/readAttributes";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import {
    readEntryInformation,
} from "../database/entry/readEntryInformation";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import { NameErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameErrorData.ta";
import {
    NameProblem_noSuchObject,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import accessControlSchemesThatUseEntryACI from "../authz/accessControlSchemesThatUseEntryACI";
import accessControlSchemesThatUseSubentryACI from "../authz/accessControlSchemesThatUseSubentryACI";
import accessControlSchemesThatUsePrescriptiveACI from "../authz/accessControlSchemesThatUsePrescriptiveACI";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_BROWSE,
    PERMISSION_CATEGORY_RETURN_DN,
    PERMISSION_CATEGORY_COMPARE,
    PERMISSION_CATEGORY_READ,
    PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
    PERMISSION_CATEGORY_FILTER_MATCH,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import getIsGroupMember from "../authz/getIsGroupMember";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    nameError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/nameError.oa";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import { AttributeTypeAndValue } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AttributeTypeAndValue.ta";
import valuesFromAttribute from "../x500/valuesFromAttribute";
import attributesFromValues from "../x500/attributesFromValues";
import {
    id_at_aliasedEntryName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-at-aliasedEntryName.va";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_invalidQueryReference,
    ServiceProblem_unwillingToPerform,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    PartialOutcomeQualifier,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PartialOutcomeQualifier.ta";
import {
    PagedResultsRequest_newRequest,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PagedResultsRequest-newRequest.ta";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    AbandonedProblem_pagingAbandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedProblem.ta";
import {
    LimitProblem_sizeLimitExceeded,
    LimitProblem_timeLimitExceeded,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/LimitProblem.ta";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import type { OperationDispatcherState } from "./OperationDispatcher";
import {
    id_errcode_serviceError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-serviceError.va";
import cloneChainingArguments from "../x500/cloneChainingArguments";
import getEqualityMatcherGetter from "../x500/getEqualityMatcherGetter";
import getOrderingMatcherGetter from "../x500/getOrderingMatcherGetter";
import getSubstringsMatcherGetter from "../x500/getSubstringsMatcherGetter";
import getApproxMatcherGetter from "../x500/getApproxMatcherGetter";
import { objectClass } from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import LDAPConnection from "../ldap/LDAPConnection";
import readFamily from "../database/family/readFamily";
import readEntryOnly from "../database/family/readEntryOnly";
import readCompoundEntry from "../database/family/readCompoundEntry";
import readStrands from "../database/family/readStrands";
import {
    FamilyGrouping_entryOnly,
    FamilyGrouping_compoundEntry,
    FamilyGrouping_strands,
    // FamilyGrouping_multiStrand,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyGrouping.ta";
import {
    // SearchControlOptions_searchAliases,
    SearchControlOptions_matchedValuesOnly,
    // SearchControlOptions_checkOverspecified,
    SearchControlOptions_performExactly,
    // SearchControlOptions_includeAllAreas,
    // SearchControlOptions_noSystemRelaxation,
    SearchControlOptions_dnAttribute,
    SearchControlOptions_matchOnResidualName,
    // SearchControlOptions_entryCount,
    // SearchControlOptions_useSubset,
    SearchControlOptions_separateFamilyMembers,
    SearchControlOptions_searchFamily,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchControlOptions.ta";
import {
    EntryInformationSelection_infoTypes_attributeTypesOnly as typesOnly,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection-infoTypes.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    FamilyEntries,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyEntries.ta";
import {
    family_information,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/family-information.oa";
import convertSubtreeToFamilyInformation from "../x500/convertSubtreeToFamilyInformation";
import type {
    Filter,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Filter.ta";
import type {
    FilterItem,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FilterItem.ta";
import {
    AttributeValueAssertion,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeValueAssertion.ta";
import type {
    RelativeDistinguishedName as RDN,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import {
    id_oc_parent,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-parent.va";
import {
    id_oc_child,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-child.va";
import getACIItems from "../authz/getACIItems";
import isAttributeSubtype from "../x500/isAttributeSubtype";
import accessControlSchemesThatUseACIItems from "../authz/accessControlSchemesThatUseACIItems";

// NOTE: This will require serious changes when service specific areas are implemented.

const BYTES_IN_A_UUID: number = 16;
const PARENT: string = id_oc_parent.toString();
const CHILD: string = id_oc_child.toString();

/**
 * "Why don't you just fetch `pageSize` number of entries?"
 *
 * Pagination fetches `pageSize` number of entries at _each level_ of search
 * recursion. In other words, if you request a page size of 100, and, in the
 * process, you recurse into the DIT ten layers deep, there will actually be
 * 1000 entries loaded into memory at the deepest part. This means that a
 * request could consume considerably higher memory than expected. To prevent
 * this, a fixed page size is used. In the future, this may be configurable.
 */
const ENTRIES_PER_BATCH: number = 1000;

export
interface SearchState extends Partial<WithRequestStatistics>, Partial<WithOutcomeStatistics> {
    chaining: ChainingResults;
    results: EntryInformation[];
    poq?: PartialOutcomeQualifier;
    skipsRemaining?: number;
    depth: number;
    paging?: [ queryReference: string, pagingState: PagedResultsRequestState ];
    familyOnly?: boolean;
}

// Note that this does not scrutinize the root DSE for membership. It is assumed.
function keepSubsetOfDITById (dit: DIT, idsToKeep: Set<number>): DIT {
    return {
        ...dit,
        subordinates: dit.subordinates
            ?.filter((sub) => idsToKeep.has(sub.dse.id))
            .map((sub) => keepSubsetOfDITById(sub, idsToKeep))
            ?? [],
    };
}

/* NOTE:
The commented-out section below should not be used to pre-filter search results,
because, in the search algorithm, when doing a subtree search, even if an entry
does not match, its subordinates still must be searched.
*/

// function canFilterAttributeValueTable (
//     ctx: Context,
//     types: AttributeType[],
// ): boolean {
//     for (const t of types) {
//         const spec = ctx.attributeTypes.get(t.toString());
//         if (
//             !spec
//             || spec.driver
//             || spec.noUserModification
//             || spec.collective
//             || spec.dummy
//             || (spec.usage !== AttributeUsage_userApplications)
//         ) {
//             return false;
//         }
//     }
//     return true;
// }

// function convertFilterItemToPrismaSelect (
//     ctx: Context,
//     filterItem: FilterItem,
// ): Partial<Prisma.EntryWhereInput> | undefined {
//     if ("equality" in filterItem) {
//         const type_ = filterItem.equality.type_;
//         if (type_.isEqualTo(objectClass["&id"])) {
//             return {
//                 EntryObjectClass: {
//                     some: {
//                         object_class: filterItem
//                             .equality
//                             .assertion
//                             .objectIdentifier
//                             .toString(),
//                     },
//                 },
//             };
//         }
//         if (type_.isEqualTo(administrativeRole["&id"])) {
//             return {
//                 EntryAdministrativeRole: {
//                     some: {
//                         administrativeRole: filterItem
//                             .equality
//                             .assertion
//                             .objectIdentifier
//                             .toString(),
//                     },
//                 },
//             };
//         }
//         if (type_.isEqualTo(accessControlScheme["&id"])) {
//             return {
//                 EntryAccessControlScheme: {
//                     some: {
//                         accessControlScheme: filterItem
//                             .equality
//                             .assertion
//                             .objectIdentifier
//                             .toString(),
//                     },
//                 },
//             };
//         }
//         if (type_.isEqualTo(aliasedEntryName["&id"])) {
//             return {
//                 alias: true,
//                 AliasEntry: {
//                     some: {}, // REVIEW: I feel like this would crash. No way Prisma actually lets you do this.
//                 },
//             };
//         }
//         // if (type_.isEqualTo(hierarchyTop["&id"])) {

//         // }
//         // if (type_.isEqualTo(hierarchyLevel["&id"])) {

//         // }
//         // if (type_.isEqualTo(hierarchyBelow["&id"])) {

//         // }
//         // if (type_.isEqualTo(hierarchyParent["&id"])) {

//         // }
//         if (type_.isEqualTo(uniqueIdentifier["&id"])) {
//             return {
//                 UniqueIdentifier: {
//                     some: {}, // REVIEW: I feel like this would crash. No way Prisma actually lets you do this.
//                 },
//             };
//         }
//         const superTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, type_));
//         if (!canFilterAttributeValueTable(ctx, superTypes)) {
//             return undefined;
//         }
//         return {
//             AttributeValue: {
//                 some: {
//                     type: {
//                         in: superTypes.map((st) => st.toString()),
//                     },
//                 },
//             },
//         };
//     } else if ("substrings" in filterItem) {
//         const type_ = filterItem.substrings.type_;
//         const superTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, type_));
//         if (!canFilterAttributeValueTable(ctx, superTypes)) {
//             return undefined;
//         }
//         return {
//             AttributeValue: {
//                 some: {
//                     type: {
//                         in: superTypes.map((st) => st.toString()),
//                     },
//                 },
//             },
//         };
//     } else if ("greaterOrEqual" in filterItem) {
//         const type_ = filterItem.greaterOrEqual.type_;
//         const superTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, type_));
//         if (!canFilterAttributeValueTable(ctx, superTypes)) {
//             return undefined;
//         }
//         return {
//             AttributeValue: {
//                 some: {
//                     type: {
//                         in: superTypes.map((st) => st.toString()),
//                     },
//                 },
//             },
//         };
//     } else if ("lessOrEqual" in filterItem) {
//         const type_ = filterItem.lessOrEqual.type_;
//         const superTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, type_));
//         if (!canFilterAttributeValueTable(ctx, superTypes)) {
//             return undefined;
//         }
//         return {
//             AttributeValue: {
//                 some: {
//                     type: {
//                         in: superTypes.map((st) => st.toString()),
//                     },
//                 },
//             },
//         };
//     } else if ("present" in filterItem) {
//         const type_ = filterItem.present;
//         const superTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, type_));
//         if (!canFilterAttributeValueTable(ctx, superTypes)) {
//             return undefined;
//         }
//         return {
//             AttributeValue: {
//                 some: {
//                     type: {
//                         in: superTypes.map((st) => st.toString()),
//                     },
//                 },
//             },
//         };
//     } else if ("approximateMatch" in filterItem) {
//         const type_ = filterItem.approximateMatch.type_;
//         const superTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, type_));
//         if (!canFilterAttributeValueTable(ctx, superTypes)) {
//             return undefined;
//         }
//         return {
//             AttributeValue: {
//                 some: {
//                     type: {
//                         in: superTypes.map((st) => st.toString()),
//                     },
//                 },
//             },
//         };
//     } else if ("extensibleMatch" in filterItem) {
//         const type_ = filterItem.extensibleMatch.type_;
//         if (!type_) {
//             return undefined;
//         }
//         const superTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, type_));
//         if (!canFilterAttributeValueTable(ctx, superTypes)) {
//             return undefined;
//         }
//         return {
//             AttributeValue: {
//                 some: {
//                     type: {
//                         in: superTypes.map((st) => st.toString()),
//                     },
//                 },
//             },
//         };
//     } else if ("contextPresent" in filterItem) {
//         const type_ = filterItem.contextPresent.type_;
//         const superTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, type_));
//         if (!canFilterAttributeValueTable(ctx, superTypes)) {
//             return undefined;
//         }
//         return {
//             AttributeValue: {
//                 some: {
//                     type: {
//                         in: superTypes.map((st) => st.toString()),
//                     },
//                 },
//             },
//         };
//     } else {
//         return undefined;
//     }
// }

// function convertFilterToPrismaSelect (
//     ctx: Context,
//     filter: Filter,
// ): Partial<Prisma.EntryWhereInput> | undefined {
//     if ("item" in filter) {
//         return convertFilterItemToPrismaSelect(ctx, filter.item);
//     } else if ("and" in filter) {
//         return {
//             AND: filter.and
//                 .map((sub) => convertFilterToPrismaSelect(ctx, sub))
//                 .filter((sub): sub is Partial<Prisma.EntryWhereInput> => !!sub),
//         };
//     } else if ("or" in filter) {
//         return {
//             OR: filter.or
//                 .map((sub) => convertFilterToPrismaSelect(ctx, sub))
//                 .filter((sub): sub is Partial<Prisma.EntryWhereInput> => !!sub),
//         };
//     } else if ("not" in filter) {
//         return {
//             NOT: convertFilterToPrismaSelect(ctx, filter.not),
//         };
//     } else {
//         return undefined;
//     }
// }

export
async function search_i (
    ctx: Context,
    conn: ClientConnection,
    state: OperationDispatcherState,
    argument: SearchArgument,
    searchState: SearchState,
): Promise<void> {
    const target = state.foundDSE;
    const data = getOptionallyProtectedValue(argument);
    const op = ("present" in state.invokeId)
        ? conn.invocations.get(Number(state.invokeId.present))
        : undefined;

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
        throw new errors.ServiceError(
            ctx.i18n.t("err:joins_unsupported"),
            new ServiceErrorData(
                ServiceProblem_unwillingToPerform,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_serviceError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }

    // const searchAliases: boolean = Boolean(data.searchControlOptions?.[SearchControlOptions_searchAliases]);
    const matchedValuesOnly: boolean = Boolean(data.searchControlOptions?.[SearchControlOptions_matchedValuesOnly]);
    // const checkOverspecified: boolean = Boolean(data.searchControlOptions?.[SearchControlOptions_checkOverspecified]);
    const performExactly: boolean = Boolean(data.searchControlOptions?.[SearchControlOptions_performExactly]);
    // const includeAllAreas: boolean = Boolean(data.searchControlOptions?.[SearchControlOptions_includeAllAreas]);
    // const noSystemRelaxation: boolean = Boolean(data.searchControlOptions?.[SearchControlOptions_noSystemRelaxation]);
    const dnAttribute: boolean = Boolean(data.searchControlOptions?.[SearchControlOptions_dnAttribute]);
    const matchOnResidualName: boolean = Boolean(data.searchControlOptions?.[SearchControlOptions_matchOnResidualName]);
    // const entryCount: boolean = Boolean(data.searchControlOptions?.[SearchControlOptions_entryCount]);
    // const useSubset: boolean = Boolean(data.searchControlOptions?.[SearchControlOptions_useSubset]);
    const separateFamilyMembers: boolean = Boolean(data.searchControlOptions?.[SearchControlOptions_separateFamilyMembers]);
    const searchFamily: boolean = Boolean(data.searchControlOptions?.[SearchControlOptions_searchFamily]);

    const timeLimitEndTime: Date | undefined = state.chainingArguments.timeLimit
        ? getDateFromTime(state.chainingArguments.timeLimit)
        : undefined;
    const targetDN = getDistinguishedName(target);
    let cursorId: number | undefined = searchState.paging?.[1].cursorIds[searchState.depth];
    if (!searchState.depth && data.pagedResults) { // This should only be done for the first recursion.
        if ("newRequest" in data.pagedResults) {
            const nr = data.pagedResults.newRequest;
            const pi = (((nr.pageNumber !== undefined) ? Number(nr.pageNumber) : 1) - 1); // The spec is unclear if this is zero-indexed.
            if ((pi < 0) || !Number.isSafeInteger(pi)) {
                throw new errors.ServiceError(
                    ctx.i18n.t("err:page_number_invalid", {
                        pi,
                    }),
                    new ServiceErrorData(
                        ServiceProblem_invalidQueryReference,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            id_errcode_serviceError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
            // pageSize = 0 is a problem because we push entry to results before checking if we have a full page.
            if ((nr.pageSize < 1) || !Number.isSafeInteger(nr.pageSize)) {
                throw new errors.ServiceError(
                    ctx.i18n.t("err:page_size_invalid", {
                        ps: nr.pageSize,
                    }),
                    new ServiceErrorData(
                        ServiceProblem_invalidQueryReference,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            id_errcode_serviceError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
            const queryReference: string = crypto.randomBytes(BYTES_IN_A_UUID).toString("base64");
            const newPagingState: PagedResultsRequestState = {
                cursorIds: [],
                pageIndex: (((data.pagedResults.newRequest.pageNumber !== undefined)
                    ? Number(data.pagedResults.newRequest.pageNumber)
                    : 1) - 1),
                request: data.pagedResults.newRequest,
            };
            searchState.paging = [ queryReference, newPagingState ];
            if (conn.pagedResultsRequests.size >= 5) {
                conn.pagedResultsRequests.clear();
            }
            conn.pagedResultsRequests.set(queryReference, newPagingState);
        } else if ("queryReference" in data.pagedResults) {
            const queryReference: string = Buffer.from(data.pagedResults.queryReference).toString("base64");
            const paging = conn.pagedResultsRequests.get(queryReference);
            if (!paging) {
                throw new errors.ServiceError(
                    ctx.i18n.t("err:paginated_query_ref_invalid"),
                    new ServiceErrorData(
                        ServiceProblem_invalidQueryReference,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            id_errcode_serviceError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
            searchState.paging = [ queryReference, paging ];
            cursorId = searchState.paging[1].cursorIds[searchState.depth];
        } else if ("abandonQuery" in data.pagedResults) {
            const queryReference: string = Buffer.from(data.pagedResults.abandonQuery).toString("base64");
            conn.pagedResultsRequests.delete(queryReference);
            throw new errors.AbandonError(
                ctx.i18n.t("err:abandoned_paginated_query"),
                new AbandonedData(
                    AbandonedProblem_pagingAbandoned,
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        undefined,
                        abandoned["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        } else {
            throw new errors.ServiceError(
                ctx.i18n.t("err:unrecognized_paginated_query_syntax"),
                new ServiceErrorData(
                    ServiceProblem_unwillingToPerform,
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        undefined,
                        id_errcode_serviceError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
    }
    const pageNumber: number = (searchState.paging?.[1].request.pageNumber !== undefined)
        ? Number(searchState.paging[1].request.pageNumber)
        : 0;
    const pageSize: number = Number(
        searchState.paging?.[1].request.pageSize
            ?? data.serviceControls?.sizeLimit
            ?? Infinity
    );
    if (timeLimitEndTime && (new Date() > timeLimitEndTime)) {
        searchState.poq = new PartialOutcomeQualifier(
            LimitProblem_timeLimitExceeded,
            undefined,
            undefined,
            undefined,
            searchState.paging?.[0]
                ? Buffer.from(searchState.paging[0], "base64")
                : undefined,
            undefined,
            undefined,
            undefined,
        );
        return;
    }
    if (searchState.results.length >= pageSize) {
        searchState.poq = new PartialOutcomeQualifier(
            LimitProblem_sizeLimitExceeded,
            undefined,
            undefined,
            undefined,
            searchState.paging?.[0]
                ? Buffer.from(searchState.paging[0], "base64")
                : undefined,
            undefined,
            undefined,
            undefined,
        );
        return;
    }
    if (searchState.skipsRemaining === undefined) {
        searchState.skipsRemaining = (data.pagedResults && ("newRequest" in data.pagedResults))
            ? (pageNumber * pageSize)
            : 0;
    }
    const EQUALITY_MATCHER = getEqualityMatcherGetter(ctx);
    const relevantSubentries: Vertex[] = (await Promise.all(
        state.admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = state.admPoints
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const targetACI = getACIItems(accessControlScheme, target, relevantSubentries);
    const acdfTuples: ACDFTuple[] = (targetACI ?? [])
        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
    const isMemberOfGroup = getIsGroupMember(ctx, EQUALITY_MATCHER);
    const relevantTuples: ACDFTupleExtended[] = (await Promise.all(
        acdfTuples.map(async (tuple): Promise<ACDFTupleExtended> => [
            ...tuple,
            await userWithinACIUserClass(
                tuple[0],
                conn.boundNameAndUID!,
                targetDN,
                EQUALITY_MATCHER,
                isMemberOfGroup,
            ),
        ]),
    ))
        .filter((tuple) => (tuple[5] > 0));
    const onBaseObjectIteration: boolean = (targetDN.length === data.baseObject.rdnSequence.length);
    const authorized = (permissions: number[]) => {
        const {
            authorized,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
            },
            permissions,
            EQUALITY_MATCHER,
        );
        return authorized;
    };
    if (
        accessControlScheme
        && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
    ) {
        const authorizedToSearch = authorized([
            PERMISSION_CATEGORY_RETURN_DN,
            PERMISSION_CATEGORY_BROWSE,
        ]);
        if (onBaseObjectIteration) {
            const authorizedForDisclosure = authorized([
                PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
            ]);
            if (!authorizedToSearch) {
                if (authorizedForDisclosure) {
                    throw new errors.SecurityError(
                        ctx.i18n.t("err:not_authz_search_base_object"),
                        new SecurityErrorData(
                            SecurityProblem_insufficientAccessRights,
                            undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                conn.boundNameAndUID?.dn,
                                undefined,
                                securityError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                } else {
                    throw new errors.NameError(
                        ctx.i18n.t("err:not_authz_search_base_object"),
                        new NameErrorData(
                            NameProblem_noSuchObject,
                            {
                                rdnSequence: targetDN.slice(0, -1),
                            },
                            [],
                            createSecurityParameters(
                                ctx,
                                conn.boundNameAndUID?.dn,
                                undefined,
                                nameError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                }
            }
        } else if (!authorizedToSearch) {
            return;
        }
    }
    const subset = data.subset ?? SearchArgumentData._default_value_for_subset;
    const searchAliases = data.searchAliases ?? SearchArgumentData._default_value_for_searchAliases;
    /**
     * NOTE: It is critical that entryOnly comes from ChainingArguments. The
     * default values are the OPPOSITE between ChainingArguments and CommonArguments.
     */
    const entryOnly = state.chainingArguments.entryOnly ?? ChainingArguments._default_value_for_entryOnly;
    const subentries: boolean = (data.serviceControls?.options?.[subentriesBit] === TRUE_BIT);
    const filter: Filter = (matchOnResidualName && state.partialName)
        ? {
            and: [
                (data.filter ?? SearchArgumentData._default_value_for_filter),
                data.baseObject.rdnSequence
                    .slice(targetDN.length)
                    .flatMap((unmatchedRDN: RDN): FilterItem[] => unmatchedRDN
                        .map((atav): FilterItem => ({
                            equality: new AttributeValueAssertion(
                                atav.type_,
                                atav.value,
                                undefined,
                            ),
                        }))),
            ],
        }
        : (data.filter ?? SearchArgumentData._default_value_for_filter);
    const serviceControlOptions = data.serviceControls?.options;
    // Service controls
    const dontUseCopy: boolean = (
        serviceControlOptions?.[ServiceControlOptions_dontUseCopy] === TRUE_BIT);
    const copyShallDo: boolean = (
        serviceControlOptions?.[ServiceControlOptions_copyShallDo] === TRUE_BIT);
    const filteredAttributes = filter
        ? getAttributeTypesFromFilter(filter)
        : undefined;
    const infoItems: EntryInformation_information_Item[] = [];
    const eis: EntryInformationSelection | undefined = filteredAttributes
        ? new EntryInformationSelection(
            {
                select: filteredAttributes
                    .filter((attr) => {
                        const spec = ctx.attributeTypes.get(attr.toString());
                        if (!spec) {
                            return true; // We assume all unrecognized attributes are user attributes.
                        }
                        return (spec.usage === AttributeUsage_userApplications);
                    }),
            },
            undefined,
            {
                select: filteredAttributes
                    .filter((attr) => {
                        const spec = ctx.attributeTypes.get(attr.toString());
                        if (!spec) {
                            return false; // We assume all unrecognized attributes are user attributes.
                        }
                        return (spec.usage !== AttributeUsage_userApplications);
                    }),
            },
            undefined,
            undefined,
            undefined,
        )
        : undefined;

    const readFamilyMemberInfo = async (vertex: Vertex): Promise<EntryInformation> => {
        const vertexDN = getDistinguishedName(vertex);
        const {
            userAttributes,
            operationalAttributes,
            collectiveAttributes,
        } = await readAttributes(ctx, target, eis, relevantSubentries, data.operationContexts);
        const attributes = [
            ...userAttributes,
            ...operationalAttributes,
            ...collectiveAttributes,
        ];
        infoItems.push(...attributes.map((attribute): EntryInformation_information_Item => ({
            attribute,
        })));
        /**
         * This is the entry information that is used for filtering, not necessarily
         * what is returned by the search (via `selection`).
         */
        return new EntryInformation(
            {
                rdnSequence: vertexDN,
            },
            undefined,
            infoItems,
            undefined,
            undefined,
            undefined,
        );
    };
    const filterOptions: EvaluateFilterSettings = {
        getEqualityMatcher: getEqualityMatcherGetter(ctx),
        getOrderingMatcher: getOrderingMatcherGetter(ctx),
        getSubstringsMatcher: getSubstringsMatcherGetter(ctx),
        getApproximateMatcher: getApproxMatcherGetter(ctx),
        getContextMatcher: (contextType: OBJECT_IDENTIFIER): ContextMatcher | undefined => {
            return ctx.contextTypes.get(contextType.toString())?.matcher;
        },
        determineAbsentMatch: (contextType: OBJECT_IDENTIFIER): boolean => {
            return ctx.contextTypes.get(contextType.toString())?.absentMatch ?? true;
        },
        isMatchingRuleCompatibleWithAttributeType: (mr: OBJECT_IDENTIFIER, at: OBJECT_IDENTIFIER): boolean => {
            return !!ctx.attributeTypes.get(at.toString())?.compatibleMatchingRules.has(mr.toString());
        },
        isAttributeSubtype: (attributeType: OBJECT_IDENTIFIER, parentType: OBJECT_IDENTIFIER): boolean => {
            return !!isAttributeSubtype(ctx, attributeType, parentType);
        },
        permittedToMatch: (attributeType: OBJECT_IDENTIFIER, value?: ASN1Element): boolean => {
            if (
                !accessControlScheme
                || !accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
            ) {
                return true;
            }
            const {
                authorized: authorizedToMatch,
            } = bacACDF(
                relevantTuples,
                conn.authLevel,
                value
                    ? {
                        value: new AttributeTypeAndValue(
                            attributeType,
                            value,
                        ),
                    }
                    : {
                        attributeType,
                    },
                [
                    PERMISSION_CATEGORY_FILTER_MATCH,
                    PERMISSION_CATEGORY_COMPARE, // Not required by specification.
                    PERMISSION_CATEGORY_READ, // Not required by specification.
                ],
                EQUALITY_MATCHER,
            );
            return authorizedToMatch;
        },
        performExactly,
        matchedValuesOnly,
        dnAttribute,
    };

    if (target.dse.cp) {
        if (data.exclusions?.some((x) => isPrefix(ctx, x, targetDN))) {
            return;
        } else {
            const suitable: boolean = await checkSuitabilityProcedure(
                ctx,
                conn,
                target,
                search["&operationCode"]!,
                state.chainingArguments.aliasDereferenced ?? ChainingArguments._default_value_for_aliasDereferenced,
                data.criticalExtensions ?? new Uint8ClampedArray(),
                dontUseCopy,
                copyShallDo,
                state.chainingArguments.excludeShadows ?? ChainingArguments._default_value_for_excludeShadows,
            );
            if (suitable) {
                if (searchState.chaining.alreadySearched) {
                    searchState.chaining.alreadySearched.push(targetDN);
                } else {
                    searchState.chaining = new ChainingResults(
                        searchState.chaining.info,
                        searchState.chaining.crossReferences,
                        searchState.chaining.securityParameters,
                        [ targetDN ],
                    );
                }
            } else {
                const cr = new ContinuationReference(
                    {
                        rdnSequence: targetDN.slice(0, -1),
                    },
                    undefined,
                    new OperationProgress(
                        OperationProgress_nameResolutionPhase_proceeding,
                        (targetDN.length - 1),
                    ),
                    undefined,
                    ReferenceType_subordinate,
                    (target.dse.cp.supplierKnowledge ?? [])
                        .map((sk) => new AccessPointInformation(
                                sk.ae_title,
                                sk.address,
                                sk.protocolInformation,
                                (typeof sk.supplier_is_master === "boolean")
                                    ? sk.supplier_is_master
                                        ? MasterOrShadowAccessPoint_category_master
                                        : MasterOrShadowAccessPoint_category_shadow
                                    : undefined,
                                undefined,
                                undefined,
                            )),
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                );
                state.SRcontinuationList.push(cr);
            }
            return;
        }
    }

    // NOTE: This was copied from the read operation.
    const filterUnauthorizedEntryInformation = (
        einfo: EntryInformation_information_Item[],
    ): [ boolean, EntryInformation_information_Item[] ] => {
        if (
            !accessControlScheme
            || !accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
        ) {
            return [ true, einfo ];
        }
        let incompleteEntry: boolean = false;
        const permittedEinfo: EntryInformation_information_Item[] = [];
        for (const info of einfo) {
            if ("attribute" in info) {
                const {
                    authorized: authorizedToAddAttributeType,
                } = bacACDF(
                    relevantTuples,
                    conn.authLevel,
                    {
                        attributeType: info.attribute.type_,
                    },
                    [
                        PERMISSION_CATEGORY_READ,
                    ],
                    EQUALITY_MATCHER,
                );
                if (!authorizedToAddAttributeType) {
                    incompleteEntry = true;
                    continue;
                }
                const permittedValues = valuesFromAttribute(info.attribute)
                    .filter((value) => {
                        const {
                            authorized: authorizedToAddAttributeValue,
                        } = bacACDF(
                            relevantTuples,
                            conn.authLevel,
                            {
                                value: new AttributeTypeAndValue(
                                    value.type,
                                    value.value,
                                ),
                            },
                            [
                                PERMISSION_CATEGORY_READ,
                            ],
                            EQUALITY_MATCHER,
                        );
                        if (!authorizedToAddAttributeValue) {
                            incompleteEntry = true;
                        }
                        return authorizedToAddAttributeValue;
                    });
                const attribute = attributesFromValues(permittedValues)[0];
                if (attribute) {
                    permittedEinfo.push({ attribute });
                } else {
                    permittedEinfo.push({
                        attributeType: info.attribute.type_,
                    });
                }
            } else if ("attributeType" in info) {
                const {
                    authorized: authorizedToAddAttributeType,
                } = bacACDF(
                    relevantTuples,
                    conn.authLevel,
                    {
                        attributeType: info.attributeType,
                    },
                    [
                        PERMISSION_CATEGORY_READ,
                    ],
                    EQUALITY_MATCHER,
                );
                if (authorizedToAddAttributeType) {
                    permittedEinfo.push(info);
                }
            } else {
                continue;
            }
        }
        return [ incompleteEntry, permittedEinfo ];
    };

    if (target.dse.alias && searchAliases) {
        const authorizedToReadEntry: boolean = authorized([
            PERMISSION_CATEGORY_READ,
        ]);
        const {
            authorized: authorizedToReadAliasedEntryName,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                attributeType: id_at_aliasedEntryName,
            },
            [
                PERMISSION_CATEGORY_READ,
            ],
            EQUALITY_MATCHER,
        );
        const {
            authorized: authorizedToReadAliasedEntryNameValue,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                value: new AttributeTypeAndValue(
                    id_at_aliasedEntryName,
                    _encode_DistinguishedName(target.dse.alias.aliasedEntryName, DER),
                ),
            },
            [
                PERMISSION_CATEGORY_READ,
            ],
            EQUALITY_MATCHER,
        );
        if (
            !authorizedToReadEntry
            || !authorizedToReadAliasedEntryName
            || !authorizedToReadAliasedEntryNameValue
        ) {
            return; // REVIEW: This is not totally correct.
        }
        await searchAliasesProcedure(
            ctx,
            conn,
            target,
            argument,
            state.chainingArguments,
            searchState,
        );
        return;
    }
    const isParent: boolean = target.dse.objectClass.has(PARENT);
    const isChild: boolean = target.dse.objectClass.has(CHILD);
    const isAncestor: boolean = (isParent && !isChild);
    const searchFamilyInEffect: boolean = (
        (searchFamily && !entryOnly && isAncestor && (searchState.depth === 0))
        || Boolean(searchState.familyOnly)
    );
    const familyGrouping = data.familyGrouping ?? SearchArgumentData._default_value_for_familyGrouping;
    const familySubsetGetter: (vertex: Vertex) => IterableIterator<Vertex[]> = (() => {
        switch (familyGrouping) {
        case (FamilyGrouping_entryOnly): return readEntryOnly;
        case (FamilyGrouping_compoundEntry): return readCompoundEntry;
        case (FamilyGrouping_strands): return readStrands;
        default: {
            throw new errors.ServiceError(
                ctx.i18n.t("err:unsupported_familygrouping"),
                new ServiceErrorData(
                    ServiceProblem_unwillingToPerform,
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        undefined,
                        id_errcode_serviceError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
        }
    })();
    if ((subset === SearchArgumentData_subset_oneLevel) && !entryOnly) {
        // Nothing needs to be done here. Proceed to step 6.
        // This no-op section is basically so that a one-level search does not
        // include the target entry.
    } else if ((subset === SearchArgumentData_subset_baseObject) || entryOnly) {
        if (
            (target.dse.subentry && subentries)
            || (!target.dse.subentry && !subentries)
            || (
                /**
                 * NOTE: LDAP behaves a little differently from X.500
                 * directories in this regard: subentries can be read without
                 * using the subentries control if they are specified as the
                 * `baseObject` of a search.
                 *
                 * This matters, too. I discovered this because Apache Directory
                 * Studio does not send the subentries control when you are
                 * actually trying to read the subentry itself--it only sends it
                 * when you are querying its superior.
                 */
                (conn instanceof LDAPConnection)
                && (subset === SearchArgumentData_subset_baseObject)
            )
        ) {
            /**
             * See IETF RFC 4512, Section 5.1: This is how an LDAP client can
             * read the Root DSE.
             */
            const searchingForRootDSE: boolean = Boolean(
                !target.immediateSuperior
                && target.dse.root
                && ("item" in filter)
                && ("present" in filter.item)
                && filter.item.present.isEqualTo(objectClass["&id"])
            );
            // Entry ACI is checked above.
            const familySelect: Set<IndexableOID> | null = data.selection?.familyReturn?.familySelect?.length
                ? new Set(data.selection.familyReturn.familySelect.map((oid) => oid.toString()))
                : null;
            const family = await readFamily(ctx, target);
            const familySubsets = familySubsetGetter(family);
            for (const familySubset of familySubsets) {
                if (familySubset.length === 0) {
                    ctx.log.warn(ctx.i18n.t("log:family_subset_had_zero_members"));
                    continue; // This should never happen, but just handling it in case it does.
                }
                const familyInfos = await Promise.all(
                    familySubset.map((member) => readFamilyMemberInfo(member)),
                );
                const matchedValues = evaluateFilter(filter, familyInfos, filterOptions);
                const matched: boolean = (
                    (matchedValues === true)
                    || (Array.isArray(matchedValues) && !!matchedValues.length)
                );
                if (matched || searchingForRootDSE) {
                    if (searchState.skipsRemaining > 0) {
                        // The specification never explicitly says that
                        // separateFamilyMembers should make each family member
                        // count towards the limits, but it would make sense.
                        if (separateFamilyMembers || searchFamilyInEffect) {
                            searchState.skipsRemaining -= familySubset
                                .filter((vertex) => (
                                    !familySelect
                                    || familySelect.has(vertex.dse.structuralObjectClass?.toString() ?? "")
                                )).length;
                        } else {
                            searchState.skipsRemaining--;
                        }
                        return;
                    }
                    const einfos = await Promise.all(
                        familySubset.map((member) => readEntryInformation(
                            ctx,
                            member,
                            data.selection,
                            relevantSubentries,
                            data.operationContexts,
                        )),
                    );
                    if (
                        matchedValuesOnly
                        && (Array.isArray(matchedValues) && matchedValues.length)
                        && !typesOnly // This option would make no sense with matchedValuesOnly.
                    ) {
                        for (let i = 0; i < einfos.length; i++) {
                            const matchedValuesAttributes = attributesFromValues(
                                matchedValues
                                    .filter((mv) => (mv.entryIndex === i))
                                    .map((mv): Value => ({
                                        ...mv,
                                        contexts: mv.contexts
                                            ? new Map(
                                                mv.contexts.map((context): [ string, StoredContext ] => [
                                                    context.contextType.toString(),
                                                    {
                                                        id: context.contextType,
                                                        fallback: context.fallback ?? false,
                                                        values: context.contextValues,
                                                    },
                                                ]),
                                            )
                                            : undefined,
                                    })),
                            );
                            const matchedValuesTypes: Set<IndexableOID> = new Set(
                                matchedValuesAttributes.map((mva) => mva.type_.toString()),
                            );
                            const einfo = einfos[i];
                            einfos[i] = [
                                ...einfo
                                    .filter((e) => {
                                        if ("attribute" in e) {
                                            return !matchedValuesTypes.has(e.attribute.type_.toString());
                                        } else if ("attributeType" in e) {
                                            return !matchedValuesTypes.has(e.attributeType.toString());
                                        } else {
                                            return false;
                                        }
                                    }),
                                ...matchedValuesAttributes.map((attribute) => ({ attribute })),
                            ];
                        }
                    } // End of matchedValuesOnly handling.
                    const filteredEinfos = einfos
                        .map(filterUnauthorizedEntryInformation);
                    if (separateFamilyMembers) {
                        searchState.results.push(
                            ...filteredEinfos
                                .map((einfo, i) => [ einfo, familySubset[i], i ] as const)
                                .filter(([ , vertex ]) => (
                                    !familySelect
                                    || familySelect.has(vertex.dse.structuralObjectClass?.toString() ?? "")
                                ))
                                .map(([ [ incompleteEntry, permittedEinfo ], vertex, index ]) => new EntryInformation(
                                    {
                                        rdnSequence: getDistinguishedName(vertex),
                                    },
                                    Boolean(vertex.dse.shadow),
                                    permittedEinfo,
                                    incompleteEntry, // Technically, you need DiscloseOnError permission to see this, but this is fine.
                                    // Only the ancestor can have partialName.
                                    ((index === 0) && state.partialName && (searchState.depth === 0)),
                                    undefined,
                                )),
                        );
                        return;
                    }
                    if (familySubset.length > 1) {
                        const subset = keepSubsetOfDITById(family, new Set(familySubset.map((member) => member.dse.id)));
                        const familyEntries: FamilyEntries[] = convertSubtreeToFamilyInformation(
                            subset,
                            (vertex: Vertex) => filteredEinfos[
                                familySubset.findIndex((member) => (member.dse.id === vertex.dse.id))]?.[1] ?? [],
                        )
                            .filter((fe) => (!familySelect || familySelect.has(fe.toString())));
                        const familyInfoAttr: Attribute = new Attribute(
                            family_information["&id"],
                            familyEntries.map((fe) => family_information.encoderFor["&Type"]!(fe, DER)),
                            undefined,
                        );
                        filteredEinfos[0][1].push({
                            attribute: familyInfoAttr,
                        });
                    }
                    searchState.results.push(
                        new EntryInformation(
                            {
                                rdnSequence: getDistinguishedName(familySubset[0]),
                            },
                            Boolean(familySubset[0].dse.shadow),
                            filteredEinfos[0][1],
                            filteredEinfos[0][0], // Technically, you need DiscloseOnError permission to see this, but this is fine.
                            (state.partialName && (searchState.depth === 0)),
                            undefined,
                        ),
                    );
                    if (data.hierarchySelections && !data.hierarchySelections[HierarchySelections_self]) {
                        hierarchySelectionProcedure(
                            ctx,
                            data.hierarchySelections,
                            data.serviceControls?.serviceType,
                        );
                    }
                    return;
                }
            }
        }
        return;
    } else if (!entryOnly) /* if ((subset === SearchArgumentData_subset_wholeSubtree) && !entryOnly) */ { // Condition is implied.
        if (
            (
                (target.dse.subentry && subentries)
                || (!target.dse.subentry && !subentries)
            )
            /**
             * Per IETF RFC 4512:
             *
             * > The root DSE SHALL NOT be included if the client performs a
             * > subtree search starting from the root.
             *
             * Unfortunately, I can't find any evidence of this being required
             * by X.500 directories. However, this behavior makes sense: you
             * should not include the root DSE in search results for searches
             * that do not explicitly target it, because, in some sense, the
             * root DSE is not a "real" entry in the DIT.
             */
            && !(!target.immediateSuperior && target.dse.root)
        ) {
            // Entry ACI is checked above.
            // NOTE: This section of code is copy-pasted. There might be a way to de-duplicate.
            const familySelect: Set<IndexableOID> | null = data.selection?.familyReturn?.familySelect?.length
                ? new Set(data.selection.familyReturn.familySelect.map((oid) => oid.toString()))
                : null;
            const family = await readFamily(ctx, target);
            const familySubsets = familySubsetGetter(family);
            for (const familySubset of familySubsets) {
                if (familySubset.length === 0) {
                    ctx.log.warn(ctx.i18n.t("log:family_subset_had_zero_members"));
                    continue; // This should never happen, but just handling it in case it does.
                }
                const familyInfos = await Promise.all(
                    familySubset.map((member) => readFamilyMemberInfo(member)),
                );
                const matchedValues = evaluateFilter(filter, familyInfos, filterOptions);
                const matched: boolean = (
                    (matchedValues === true)
                    || (Array.isArray(matchedValues) && !!matchedValues.length)
                );
                if (matched) {
                    if (searchState.skipsRemaining > 0) {
                        if (separateFamilyMembers) {
                            searchState.skipsRemaining -= familySubset.length;
                        } else {
                            searchState.skipsRemaining--;
                        }
                        return;
                    }
                    const einfos = await Promise.all(
                        familySubset.map((member) => readEntryInformation(
                            ctx,
                            member,
                            data.selection,
                            relevantSubentries,
                            data.operationContexts,
                        )),
                    );
                    if (
                        matchedValuesOnly
                        && (Array.isArray(matchedValues) && matchedValues.length)
                        && !typesOnly // This option would make no sense with matchedValuesOnly.
                    ) {
                        for (let i = 0; i < einfos.length; i++) {
                            const matchedValuesAttributes = attributesFromValues(
                                matchedValues
                                    .filter((mv) => (mv.entryIndex === i))
                                    .map((mv): Value => ({
                                        ...mv,
                                        contexts: mv.contexts
                                            ? new Map(
                                                mv.contexts.map((context): [ string, StoredContext ] => [
                                                    context.contextType.toString(),
                                                    {
                                                        id: context.contextType,
                                                        fallback: context.fallback ?? false,
                                                        values: context.contextValues,
                                                    },
                                                ]),
                                            )
                                            : undefined,
                                    })),
                            );
                            const matchedValuesTypes: Set<IndexableOID> = new Set(
                                matchedValuesAttributes.map((mva) => mva.type_.toString()),
                            );
                            const einfo = einfos[i];
                            einfos[i] = [
                                ...einfo
                                    .filter((e) => {
                                        if ("attribute" in e) {
                                            return !matchedValuesTypes.has(e.attribute.type_.toString());
                                        } else if ("attributeType" in e) {
                                            return !matchedValuesTypes.has(e.attributeType.toString());
                                        } else {
                                            return false;
                                        }
                                    }),
                                ...matchedValuesAttributes.map((attribute) => ({ attribute })),
                            ];
                        }
                    } // End of matchedValuesOnly handling.
                    const filteredEinfos = einfos
                        .map(filterUnauthorizedEntryInformation);
                    if (separateFamilyMembers) {
                        searchState.results.push(
                            ...filteredEinfos
                                .map((einfo, i) => [ einfo, familySubset[i], i ] as const)
                                .filter(([ , vertex ]) => (
                                    !familySelect
                                    || familySelect.has(vertex.dse.structuralObjectClass?.toString() ?? "")
                                ))
                                .map(([ [ incompleteEntry, permittedEinfo ], vertex, index ]) => new EntryInformation(
                                    {
                                        rdnSequence: getDistinguishedName(vertex),
                                    },
                                    Boolean(vertex.dse.shadow),
                                    permittedEinfo,
                                    incompleteEntry, // Technically, you need DiscloseOnError permission to see this, but this is fine.
                                    // Only the ancestor can have partialName.
                                    ((index === 0) && state.partialName && (searchState.depth === 0)),
                                    undefined,
                                )),
                        );
                        return;
                    } else {
                        if (familySubset.length > 1) {
                            const subset = keepSubsetOfDITById(family, new Set(familySubset.map((member) => member.dse.id)));
                            const familyEntries: FamilyEntries[] = convertSubtreeToFamilyInformation(
                                subset,
                                (vertex: Vertex) => filteredEinfos[
                                    familySubset.findIndex((member) => (member.dse.id === vertex.dse.id))]?.[1] ?? [],
                            )
                                .filter((fe) => (!familySelect || familySelect.has(fe.toString())));
                            const familyInfoAttr: Attribute = new Attribute(
                                family_information["&id"],
                                familyEntries.map((fe) => family_information.encoderFor["&Type"]!(fe, DER)),
                                undefined,
                            );
                            filteredEinfos[0][1].push({
                                attribute: familyInfoAttr,
                            });
                        }
                        searchState.results.push(
                            new EntryInformation(
                                {
                                    rdnSequence: getDistinguishedName(familySubset[0]),
                                },
                                Boolean(familySubset[0].dse.shadow),
                                filteredEinfos[0][1],
                                filteredEinfos[0][0], // Technically, you need DiscloseOnError permission to see this, but this is fine.
                                (state.partialName && (searchState.depth === 0)),
                                undefined,
                            ),
                        );
                    }
                    if (data.hierarchySelections && !data.hierarchySelections[HierarchySelections_self]) {
                        hierarchySelectionProcedure(
                            ctx,
                            data.hierarchySelections,
                            data.serviceControls?.serviceType,
                        );
                    }
                }
            }
        }
    }

    // Step 6.
    if (target.dse.nssr) {
        // Almost copied entirely from list_i().
        const cr = new ContinuationReference(
            {
                rdnSequence: targetDN,
            },
            undefined,
            new OperationProgress(
                OperationProgress_nameResolutionPhase_completed,
                undefined,
            ),
            undefined,
            ReferenceType_nonSpecificSubordinate,
            target.dse.nssr.nonSpecificKnowledge
                .map((nsk): AccessPointInformation | undefined => {
                    const [ masters, shadows ] = splitIntoMastersAndShadows(nsk);
                    const preferred = shadows[0] ?? masters[0];
                    if (!preferred) {
                        return undefined;
                    }
                    return new AccessPointInformation(
                        preferred.ae_title,
                        preferred.address,
                        preferred.protocolInformation,
                        preferred.category,
                        preferred.chainingRequired,
                        shadows[0]
                            ? [ ...shadows.slice(1), ...masters ]
                            : [ ...shadows, ...masters.slice(1) ],
                    );
                })
                .filter((api): api is AccessPointInformation => !!api),
            undefined,
            undefined,
            undefined,
            undefined,
        );
        state.SRcontinuationList.push(cr);
    }

    if (searchState.paging?.[1].request.sortKeys && (searchState.paging[1].request.sortKeys.length > 1)) {
        throw new errors.ServiceError(
            ctx.i18n.t("err:only_one_sort_key"),
            new ServiceErrorData(
                ServiceProblem_unwillingToPerform,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_serviceError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }
    const useSortedSearch: boolean = !!searchState.paging?.[1].request.sortKeys?.[0];
    const getNextBatchOfSubordinates = async (): Promise<Vertex[]> => {
        /**
         * We return no subordinates, because the family members will all be
         * returned because of the current target entry, even if the
         * `separateFamilyMembers` option is used.
         */
        if (searchFamilyInEffect) {
            return [];
        }
        return useSortedSearch
            ? await (async () => {
                const results: Vertex[] = [];
                const newCursorId = await readChildrenSorted(
                    ctx,
                    target,
                    searchState.paging![1].request!.sortKeys![0].type_,
                    results,
                    searchState.paging![1].request.reverse ?? PagedResultsRequest_newRequest._default_value_for_reverse,
                    ENTRIES_PER_BATCH, // TODO: Make configurable
                    undefined,
                    cursorId,
                );
                if (searchState.paging?.[1].cursorIds) {
                    if (newCursorId === undefined) {
                        searchState.paging[1].cursorIds = searchState.paging[1].cursorIds.slice(0, searchState.depth);
                    } else {
                        searchState.paging[1].cursorIds[searchState.depth] = newCursorId;
                    }
                }
                cursorId = newCursorId;
                return results;
            })()
            : await readChildren(
                ctx,
                target,
                ENTRIES_PER_BATCH,
                undefined,
                cursorId,
                {
                    // ...(data.filter
                    //     ? convertFilterToPrismaSelect(ctx, data.filter)
                    //     : {}),
                    subentry: subentries,
                    EntryObjectClass: {
                        /**
                         * We do not iterate over child entries, because
                         * those will be returned--or not--with the
                         * ancestor entry.
                         */
                        none: {
                            object_class: CHILD,
                        },
                    },
                },
            );
    };
    let subordinatesInBatch = await getNextBatchOfSubordinates();
    while (subordinatesInBatch.length) {
        for (const subordinate of subordinatesInBatch) {
            if (op?.abandonTime) {
                op.events.emit("abandon");
                throw new errors.AbandonError(
                    ctx.i18n.t("err:abandoned"),
                    new AbandonedData(
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            abandoned["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
            if (timeLimitEndTime && (new Date() > timeLimitEndTime)) {
                searchState.poq = new PartialOutcomeQualifier(
                    LimitProblem_timeLimitExceeded,
                    undefined,
                    undefined,
                    undefined,
                    searchState.paging?.[0]
                        ? Buffer.from(searchState.paging[0], "base64")
                        : undefined,
                    undefined,
                    undefined,
                    undefined,
                );
                return;
            }
            if (!useSortedSearch) {
                cursorId = subordinate.dse.id;
                if (searchState.paging?.[1].cursorIds) {
                    searchState.paging[1].cursorIds[searchState.depth] = subordinate.dse.id;
                }
            }
            if (subentries && !subordinate.dse.subentry) {
                continue;
            }
            /**
             * We do not iterate over child entries, because
             * those will be returned--or not--with the
             * ancestor entry.
             */
            if (subordinate.dse.objectClass.has(CHILD)) {
                continue;
            }
            if (subordinate.dse.subr && !subordinate.dse.cp) {
                const cr = new ContinuationReference(
                    {
                        // REVIEW: The documentation says use the DN of e, but I am pretty sure they mean e'.
                        // rdnSequence: [ ...targetDN, subordinate.dse.rdn ],
                        rdnSequence: targetDN,
                    },
                    undefined,
                    new OperationProgress(
                        OperationProgress_nameResolutionPhase_completed,
                        undefined,
                    ),
                    undefined,
                    ReferenceType_subordinate,
                    ((): AccessPointInformation[] => {
                        const [
                            masters,
                            shadows,
                        ] = splitIntoMastersAndShadows(subordinate.dse.subr.specificKnowledge);
                        const preferred = shadows[0] ?? masters[0];
                        if (!preferred) {
                            return [];
                        }
                        return [
                            new AccessPointInformation(
                                preferred.ae_title,
                                preferred.address,
                                preferred.protocolInformation,
                                preferred.category,
                                preferred.chainingRequired,
                                shadows[0]
                                    ? [ ...shadows.slice(1), ...masters ]
                                    : [ ...shadows, ...masters.slice(1) ],
                            ),
                        ];
                    })(),
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                );
                state.SRcontinuationList.push(cr);
            }
            const newChainingArguments: ChainingArguments = (subset === SearchArgumentData_subset_oneLevel)
                ? cloneChainingArguments(state.chainingArguments, {
                    entryOnly: TRUE,
                })
                : state.chainingArguments;
            searchState.depth++;
            searchState.familyOnly = searchFamilyInEffect;
            await search_i(
                ctx,
                conn,
                {
                    ...state,
                    chainingArguments: newChainingArguments,
                    foundDSE: subordinate,
                }, // TODO: Are you sure you can always pass in the same admPoints?
                argument,
                searchState,
            );
            searchState.depth--;
            if (searchState.poq) {
                return;
            }
        }
        subordinatesInBatch = await getNextBatchOfSubordinates();
    }
    // subordinatesInBatch.length === 0 beyond this point.
    if ((searchState.depth === 0) && searchState.paging) {
        conn.pagedResultsRequests.delete(searchState.paging[0]);
        searchState.paging[1].cursorIds.pop();
    }
}

export default search_i;
