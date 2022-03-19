import type {
    Vertex,
    ClientAssociation,
    WithRequestStatistics,
    WithOutcomeStatistics,
    PagedResultsRequestState,
    IndexableOID,
} from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
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
import { OBJECT_IDENTIFIER, TRUE_BIT, TRUE, ASN1Element, ObjectIdentifier, BOOLEAN } from "asn1-ts";
import readSubordinates from "../dit/readSubordinates";
import {
    ChainingArguments,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    ServiceControlOptions_subentries as subentriesBit,
    ServiceControlOptions_chainingProhibited as chainingProhibitedBit,
    ServiceControlOptions_manageDSAIT as manageDSAITBit,
    ServiceControlOptions_preferChaining as preferChainingBit,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    _encode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type ContextMatcher from "@wildboar/x500/src/lib/types/ContextMatcher";
import getDistinguishedName from "../x500/getDistinguishedName";
import { evaluateFilter, EvaluateFilterSettings } from "@wildboar/x500/src/lib/utils/evaluateFilter";
import {
    CannotPerformExactly,
} from "@wildboar/x500/src/lib/errors";
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
    ServiceControlOptions_noSubtypeMatch,
    ServiceControlOptions_noSubtypeSelection,
    ServiceControlOptions_dontSelectFriends,
    ServiceControlOptions_dontMatchFriends,
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
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import { NameErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameErrorData.ta";
import {
    NameProblem_noSuchObject,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
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
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    nameError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/nameError.oa";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import { AttributeTypeAndValue } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AttributeTypeAndValue.ta";
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
    ServiceProblem_unsupportedMatchingUse,
    ServiceProblem_unwillingToPerform,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    PartialOutcomeQualifier,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PartialOutcomeQualifier.ta";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    AbandonedProblem_pagingAbandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedProblem.ta";
import {
    LimitProblem_administrativeLimitExceeded,
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
import LDAPAssociation from "../ldap/LDAPConnection";
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
    SearchControlOptions_searchAliases,
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
// import type {
//     FilterItem,
// } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FilterItem.ta";
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
import accessControlSchemesThatUseACIItems from "../authz/accessControlSchemesThatUseACIItems";
import type {
    SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
import { MINIMUM_MAX_ATTR_SIZE, MAX_RESULTS } from "../constants";
import getAttributeSizeFilter from "../x500/getAttributeSizeFilter";
import getAttributeSubtypes from "../x500/getAttributeSubtypes";
import {
    id_soc_subschema,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/id-soc-subschema.va";
import {
    FamilyReturn,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyReturn.ta";
import {
    FamilyReturn_memberSelect_contributingEntriesOnly,
    FamilyReturn_memberSelect_participatingEntriesOnly,
    FamilyReturn_memberSelect_compoundEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyReturn-memberSelect.ta";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { id_ar_autonomousArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import { strict as assert } from "assert";
import _ from "lodash";
import keepSubsetOfDITById from "../dit/keepSubsetOfDITById";
import walkMemory from "../dit/walkMemory";
import bacSettings from "../authz/bacSettings";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import preprocessTuples from "../authz/preprocessTuples";
import readPermittedEntryInformation from "../database/entry/readPermittedEntryInformation";
import isOperationalAttributeType from "../x500/isOperationalAttributeType";

// NOTE: This will require serious changes when service specific areas are implemented.

const BYTES_IN_A_UUID: number = 16;
const PARENT: string = id_oc_parent.toString();
const CHILD: string = id_oc_child.toString();
const AUTONOMOUS: string = id_ar_autonomousArea.toString();

export
interface SearchState extends Partial<WithRequestStatistics>, Partial<WithOutcomeStatistics> {
    chaining: ChainingResults;
    results: EntryInformation[];
    resultSets: SearchResult[];
    poq?: PartialOutcomeQualifier;
    depth: number;
    paging?: [ queryReference: string, pagingState: PagedResultsRequestState ];
    familyOnly?: boolean;
    alreadyReturnedById: Set<number>;
}

/**
 * @summary Count the number of results in a `SearchResult`
 * @description
 *
 * This function counts the number of results in a `SearchResult`, recursing
 * into uncorrelated result sets, if they are present.
 *
 * @param result The `SearchResult` whose entries are to be counted
 * @returns The number of entries in the `SearchResult`
 *
 * @function
 */
function getNumberOfResultsInSearch (result: SearchResult): number {
    const data = getOptionallyProtectedValue(result);
    if ("searchInfo" in data) {
        return data.searchInfo.entries.length;
    } else if ("uncorrelatedSearchInfo" in data) {
        return data.uncorrelatedSearchInfo
            .map(getNumberOfResultsInSearch)
            .reduce((p, c) => p + c, 0);
    } else {
        return 0;
    }
}

/**
 * @summary Get the current number of results returning from the search operation
 * @description
 *
 * This function gets the current number of results returning from the current
 * search operation. It does not persist between pages of search operations.
 *
 * @param state The current search state
 * @returns The number of results from the current search operation state
 *
 * @function
 */
function getCurrentNumberOfResults (state: SearchState): number {
    return (
        state.results.length
        + state.resultSets
            .map(getNumberOfResultsInSearch)
            .reduce((p, c) => p + c, 0)
    );
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

/**
 * @summary Get the database IDs of family members to return
 * @description
 *
 * Gets the database IDs of family members within a compound entry that should
 * be returned per the `familyReturn` selection.
 *
 * @param familyReturn The family return selection
 * @param participatingEntries An array of participating vertices
 * @param contributingEntryIds A set of database IDs of entries that have contributed
 * @returns A set of database IDs of entries to return, or `null` if all of them
 *  should be returned
 *
 * @function
 */
function getFamilyMembersToReturnById (
    familyReturn: FamilyReturn,
    participatingEntries: Vertex[],
    contributingEntryIds: Set<number>,
): Set<number> | null { // `null` means "all"
    switch (familyReturn.memberSelect) {
        case (FamilyReturn_memberSelect_contributingEntriesOnly as number): { // Bizarre TypeScript bug.
            return contributingEntryIds;
        }
        case (FamilyReturn_memberSelect_participatingEntriesOnly as number): { // Bizarre TypeScript bug.
            return new Set(participatingEntries.map((v) => v.dse.id));
        }
        case (FamilyReturn_memberSelect_compoundEntry as number): {  // Bizarre TypeScript bug.
            return null;
        }
        default: {
            throw new errors.MistypedArgumentError();
        }
    }
}

// async function emitResultsFromMatchedFamilySubset (
//     ctx: Context,
//     data: SearchArgumentData,
//     searchState: SearchState,
//     matchedFamilySubset: Vertex[],
//     matchedValues: ReturnType<typeof evaluateFilter>,
//     relevantSubentries: Vertex[],
//     filterUnauthorizedEntryInformation: (einfo: EntryInformation_information_Item[]) => [ boolean, EntryInformation_information_Item[] ],
//     attributeSizeLimit?: number,
//     noSubtypeSelection?: boolean,
//     dontSelectFriends?: boolean,
//     separateFamilyMembers?: boolean,
//     matchedValuesOnly?: boolean,
// ): Promise<void> {
//     const einfos = await Promise.all(
//         matchedFamilySubset.map((member) => readEntryInformation(
//             ctx,
//             member,
//             {
//                 selection: data.selection,
//                 relevantSubentries,
//                 operationContexts: data.operationContexts,
//                 attributeSizeLimit,
//                 noSubtypeSelection,
//                 dontSelectFriends,
//             },
//         )),
//     );
//     if (
//         matchedValuesOnly
//         && (Array.isArray(matchedValues) && matchedValues.length)
//         && !typesOnly // This option would make no sense with matchedValuesOnly.
//     ) {
//         for (let i = 0; i < einfos.length; i++) {
//             const matchedValuesAttributes = attributesFromValues(
//                 matchedValues.filter((mv) => (mv.entryIndex === i)),
//             );
//             const matchedValuesTypes: Set<IndexableOID> = new Set(
//                 matchedValuesAttributes.map((mva) => mva.type_.toString()),
//             );
//             const einfo = einfos[i];
//             /**
//              * Remember: matchedValuesOnly only filters the
//              * values of attributes that contributed to the
//              * match. All other information is returned
//              * unchanged. This was actually a point of
//              * confusion to the IETF LDAP working group, which
//              * is why LDAP's matchedValues extension does not
//              * align with DAP's matchedValuesOnly boolean.
//              *
//              * See: https://www.rfc-editor.org/rfc/rfc3876.html#section-3
//              *
//              * This was later clarified in the X.500 standards.
//              * There is a notable increase in detail in X.511's
//              * description of matchedValuesOnly in the 2001
//              * version of the specification.
//              */
//             einfos[i] = [
//                 ...einfo
//                     .filter((e) => {
//                         if ("attribute" in e) {
//                             return !matchedValuesTypes.has(e.attribute.type_.toString());
//                         } else if ("attributeType" in e) {
//                             return !matchedValuesTypes.has(e.attributeType.toString());
//                         } else {
//                             return false;
//                         }
//                     }),
//                 ...matchedValuesAttributes.map((attribute) => ({ attribute })),
//             ];
//         }
//     } // End of matchedValuesOnly handling.
//     const familyMembersToBeReturned = familyMembersToReturnById(familyReturn, matchedFamilySubset, matchedValues);
//     const filteredEinfos = einfos.map(filterUnauthorizedEntryInformation);
//     if (separateFamilyMembers) {
//         const familyMemberResults = filteredEinfos
//             .map((einfo, i) => [ einfo, matchedFamilySubset![i], i ] as const)
//             .filter(([ , vertex ]) => (
//                 (!familySelect || familySelect.has(vertex.dse.structuralObjectClass?.toString() ?? ""))
//                 && !((): boolean => {
//                     const had: boolean = searchState.paging?.[1].alreadyReturnedById.has(vertex.dse.id) ?? false;
//                     searchState.paging?.[1].alreadyReturnedById.add(vertex.dse.id);
//                     return had;
//                 })()
//                 && ( // Is this part of the familyReturn member selection?
//                     !familyMembersToBeReturned
//                     || familyMembersToBeReturned.has(vertex.dse.id)
//                 )
//             ))
//             .map(([ [ incompleteEntry, permittedEinfo ], vertex, index ]) => new EntryInformation(
//                 {
//                     rdnSequence: getDistinguishedName(vertex),
//                 },
//                 !vertex.dse.shadow,
//                 attributeSizeLimit
//                     ? permittedEinfo.filter(filterEntryInfoItemBySize)
//                     : permittedEinfo,
//                 incompleteEntry, // Technically, you need DiscloseOnError permission to see this, but this is fine.
//                 // Only the ancestor can have partialName.
//                 ((index === 0) && state.partialName && (searchState.depth === 0)),
//                 undefined,
//             ));
//         searchState.results.push(...familyMemberResults);
//         return;
//     } else {
//         if (matchedFamilySubset.length > 1) { // If there actually are children.
//             const subset = keepSubsetOfDITById(
//                 family,
//                 new Set(matchedFamilySubset
//                     .filter((vertex) => ( // Is this part of the familyReturn member selection?
//                         !familyMembersToBeReturned
//                         || familyMembersToBeReturned.has(vertex.dse.id)
//                     ))
//                     .map((member) => member.dse.id)),
//             );
//             const familyEntries: FamilyEntries[] = convertSubtreeToFamilyInformation(
//                 subset,
//                 (vertex: Vertex) => filteredEinfos[
//                     matchedFamilySubset!.findIndex((member) => (member.dse.id === vertex.dse.id))]?.[1] ?? [],
//             )
//                 .filter((fe) => (!familySelect || familySelect.has(fe.family_class.toString())));
//             const familyInfoAttr: Attribute = new Attribute(
//                 family_information["&id"],
//                 familyEntries.map((fe) => family_information.encoderFor["&Type"]!(fe, DER)),
//                 undefined,
//             );
//             filteredEinfos[0][1].push({
//                 attribute: familyInfoAttr,
//             });
//         }
//         if (!searchState.paging?.[1].alreadyReturnedById.has(matchedFamilySubset[0].dse.id)) {
//             searchState.paging?.[1].alreadyReturnedById.add(matchedFamilySubset[0].dse.id);
//             searchState.results.push(
//                 new EntryInformation(
//                     {
//                         rdnSequence: getDistinguishedName(matchedFamilySubset[0]),
//                     },
//                     !matchedFamilySubset[0].dse.shadow,
//                     attributeSizeLimit
//                         ? filteredEinfos[0][1].filter(filterEntryInfoItemBySize)
//                         : filteredEinfos[0][1],
//                     filteredEinfos[0][0], // Technically, you need DiscloseOnError permission to see this, but this is fine.
//                     (state.partialName && (searchState.depth === 0)),
//                     undefined,
//                 ),
//             );
//         }
//     }
//     if (data.hierarchySelections && !data.hierarchySelections[HierarchySelections_self]) {
//         hierarchySelectionProcedure(
//             ctx,
//             data.hierarchySelections,
//             data.serviceControls?.serviceType,
//         );
//     }
// }

/**
 * @summary The Search (I) Procedure, as specified in ITU Recommendation X.518.
 * @description
 *
 * The `search` operation, as specified in ITU Recommendation X.511 (2016),
 * Section 11.2, per the recommended implementation of the Search (I) procedure
 * defined in in ITU Recommendation X.518 (2016), Section 19.3.2.2.5.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param state The operation dispatcher state
 * @param argument The original SearchArgument
 * @param searchState The current search state
 *
 * @function
 * @async
 */
export
async function search_i (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    state: OperationDispatcherState,
    argument: SearchArgument,
    searchState: SearchState,
): Promise<void> {
    const target = state.foundDSE;
    const data = getOptionallyProtectedValue(argument);
    const op = ("present" in state.invokeId)
        ? assn.invocations.get(Number(state.invokeId.present))
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
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_serviceError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }

    const attributeSizeLimit: number | undefined = (
        Number.isSafeInteger(Number(data.serviceControls?.attributeSizeLimit))
        && (Number(data.serviceControls?.attributeSizeLimit) >= MINIMUM_MAX_ATTR_SIZE)
    )
        ? Number(data.serviceControls!.attributeSizeLimit)
        : undefined;
    const sizeFilter = getAttributeSizeFilter(attributeSizeLimit ?? Infinity);
    const filterEntryInfoItemBySize = (item: EntryInformation_information_Item): boolean => {
        if (!("attribute" in item)) {
            return true;
        }
        return sizeFilter(item.attribute);
    };

    const searchAliases: boolean = data.searchAliases
        ?? Boolean(data.searchControlOptions?.[SearchControlOptions_searchAliases])
        ?? SearchArgumentData._default_value_for_searchAliases;
    const matchedValuesOnly: boolean = data.matchedValuesOnly
        || Boolean(data.searchControlOptions?.[SearchControlOptions_matchedValuesOnly]);
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
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const relevantSubentries: Vertex[] = (await Promise.all(
        state.admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = [ ...state.admPoints ] // Array.reverse() works in-place, so we create a new array.
        .reverse()
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const targetACI = getACIItems(accessControlScheme, target, relevantSubentries);
    const acdfTuples: ACDFTuple[] = (targetACI ?? [])
        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
    const isMemberOfGroup = getIsGroupMember(ctx, NAMING_MATCHER);
    const user = state.chainingArguments.originator
        ? new NameAndOptionalUID(
            state.chainingArguments.originator,
            state.chainingArguments.uniqueIdentifier,
        )
        : undefined;
    const relevantTuples: ACDFTupleExtended[] = await preprocessTuples(
        accessControlScheme,
        acdfTuples,
        user,
        state.chainingArguments.authenticationLevel ?? assn.authLevel,
        targetDN,
        isMemberOfGroup,
        NAMING_MATCHER,
    );
    let cursorId: number | undefined = searchState.paging?.[1].cursorIds[searchState.depth];
    if (!searchState.depth && data.pagedResults) { // This should only be done for the first recursion.
        const chainingProhibited = (
            (data.serviceControls?.options?.[chainingProhibitedBit] === TRUE_BIT)
            || (data.serviceControls?.options?.[manageDSAITBit] === TRUE_BIT)
        );
        const preferChaining: boolean = (data.serviceControls?.options?.[preferChainingBit] === TRUE_BIT);
        if (
            data.pagedResults
            && (data.securityParameters?.target === ProtectionRequest_signed)
            && (!chainingProhibited || preferChaining)
        ) {
            throw new errors.ServiceError(
                ctx.i18n.t("err:cannot_use_pagination_and_signing"),
                new ServiceErrorData(
                    ServiceProblem_unwillingToPerform,
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        id_errcode_serviceError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
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
                            assn.boundNameAndUID?.dn,
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
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_errcode_serviceError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
            if (nr.sortKeys?.length) {
                const uniqueSortKeys = new Set(nr.sortKeys.map((sk) => sk.type_.toString()));
                if (uniqueSortKeys.size < nr.sortKeys.length) {
                    throw new errors.ServiceError(
                        ctx.i18n.t("err:duplicate_sort_key", {
                            ps: nr.pageSize,
                        }),
                        new ServiceErrorData(
                            ServiceProblem_unwillingToPerform,
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                id_errcode_serviceError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                }
                if (nr.sortKeys.length > 3) {
                    ctx.log.warn(ctx.i18n.t("log:too_many_sort_keys", {
                        aid: assn.id,
                        num: nr.sortKeys.length,
                    }), {
                        remoteFamily: assn.socket.remoteFamily,
                        remoteAddress: assn.socket.remoteAddress,
                        remotePort: assn.socket.remotePort,
                        association_id: assn.id,
                    });
                    nr.sortKeys.length = 3;
                }
            }
            const queryReference: string = crypto.randomBytes(BYTES_IN_A_UUID).toString("base64");
            const newPagingState: PagedResultsRequestState = {
                cursorIds: [],
                request: data.pagedResults.newRequest,
                alreadyReturnedById: new Set(),
            };
            searchState.paging = [ queryReference, newPagingState ];
            if (assn.pagedResultsRequests.size >= 5) {
                assn.pagedResultsRequests.clear();
            }
            assn.pagedResultsRequests.set(queryReference, newPagingState);
        } else if ("queryReference" in data.pagedResults) {
            const queryReference: string = Buffer.from(data.pagedResults.queryReference).toString("base64");
            const paging = assn.pagedResultsRequests.get(queryReference);
            if (!paging) {
                throw new errors.ServiceError(
                    ctx.i18n.t("err:paginated_query_ref_invalid"),
                    new ServiceErrorData(
                        ServiceProblem_invalidQueryReference,
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
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
            return;
        } else if ("abandonQuery" in data.pagedResults) {
            const queryReference: string = Buffer.from(data.pagedResults.abandonQuery).toString("base64");
            assn.pagedResultsRequests.delete(queryReference);
            throw new errors.AbandonError(
                ctx.i18n.t("err:abandoned_paginated_query"),
                new AbandonedData(
                    AbandonedProblem_pagingAbandoned,
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
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
                        assn.boundNameAndUID?.dn,
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
    const sizeLimit: number = searchState.paging?.[1]
        ? MAX_RESULTS
        : Number(data.serviceControls?.sizeLimit ?? MAX_RESULTS);
    if (timeLimitEndTime && (new Date() > timeLimitEndTime)) {
        searchState.poq = new PartialOutcomeQualifier(
            LimitProblem_timeLimitExceeded,
            undefined,
            undefined,
            undefined,
            searchState.paging?.[0]
                ? Buffer.from(searchState.paging[0], "base64")
                : undefined,
        );
        return;
    }
    const currentNumberOfResults: number = getCurrentNumberOfResults(searchState);
    if (currentNumberOfResults >= sizeLimit) {
        searchState.poq = new PartialOutcomeQualifier(
            (currentNumberOfResults >= MAX_RESULTS)
                ? LimitProblem_administrativeLimitExceeded
                : LimitProblem_sizeLimitExceeded,
            undefined,
            undefined,
            undefined,
            searchState.paging?.[0]
                ? Buffer.from(searchState.paging[0], "base64")
                : undefined,
        );
        return;
    }
    const onBaseObjectIteration: boolean = (targetDN.length === data.baseObject.rdnSequence.length);
    const authorized = (permissions: number[]) => {
        const { authorized } = bacACDF(
            relevantTuples,
            user,
            {
                entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
            },
            permissions,
            bacSettings,
            true,
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
                                assn.boundNameAndUID?.dn,
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
                                assn.boundNameAndUID?.dn,
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
                ...data.baseObject.rdnSequence
                    .slice(targetDN.length)
                    .flatMap((unmatchedRDN: RDN): Filter[] => unmatchedRDN
                        .map((atav): Filter => ({
                            item: {
                                equality: new AttributeValueAssertion(
                                    atav.type_,
                                    atav.value,
                                    undefined,
                                ),
                            },
                        }))),
            ],
        }
        : (data.filter ?? SearchArgumentData._default_value_for_filter);
    const serviceControlOptions = data.serviceControls?.options;
    // Service controls
    const noSubtypeMatch: boolean = (
        data.serviceControls?.options?.[ServiceControlOptions_noSubtypeMatch] === TRUE_BIT);
    const noSubtypeSelection: boolean = (
        data.serviceControls?.options?.[ServiceControlOptions_noSubtypeSelection] === TRUE_BIT);
    const dontSelectFriends: boolean = (
        data.serviceControls?.options?.[ServiceControlOptions_dontSelectFriends] === TRUE_BIT);
    const dontMatchFriends: boolean = (
        data.serviceControls?.options?.[ServiceControlOptions_dontMatchFriends] === TRUE_BIT);
    const dontUseCopy: boolean = (
        serviceControlOptions?.[ServiceControlOptions_dontUseCopy] === TRUE_BIT);
    const copyShallDo: boolean = (
        serviceControlOptions?.[ServiceControlOptions_copyShallDo] === TRUE_BIT);
    const filteredAttributes = filter
        ? getAttributeTypesFromFilter(filter)
        : undefined;
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
            {
                allContexts: null,
            },
            TRUE,
        )
        : undefined;

    const readFamilyMemberInfo = async (vertex: Vertex): Promise<EntryInformation> => {
        const infoItems: EntryInformation_information_Item[] = [];
        const vertexDN = getDistinguishedName(vertex);
        const {
            userAttributes,
            operationalAttributes,
            collectiveAttributes,
        } = await readAttributes(ctx, vertex, {
            selection: eis,
            relevantSubentries,
            operationContexts: data.operationContexts,
            attributeSizeLimit,
            noSubtypeSelection: noSubtypeMatch, // This selection of info is used for filtering, not the actual return.
            dontSelectFriends: dontMatchFriends, // This selection of info is used for filtering, not the actual return.
        });
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
        );
    };
    const subschemaSubentry = relevantSubentries
        .filter((sub) => sub.dse.objectClass.has(id_soc_subschema.toString()))
        .sort((a, b) => {
            const adn = getDistinguishedName(a);
            const bdn = getDistinguishedName(b);
            return (bdn.length - adn.length);
        })[0]; // Select the nearest subschema
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
            return (
                attributeType.isEqualTo(parentType)
                || getAttributeSubtypes(ctx, parentType).some((st) => st.isEqualTo(attributeType))
            );
        },
        getFriends: (attributeType: OBJECT_IDENTIFIER): OBJECT_IDENTIFIER[] => {
            if (dontMatchFriends) {
                return [];
            }
            const friendship = subschemaSubentry?.dse.subentry?.friendships
                ?.find((f) => f.anchor.isEqualTo(attributeType));
            return friendship ? [ ...friendship.friends ] : [];
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
                user,
                value
                    ? {
                        value: new AttributeTypeAndValue(
                            attributeType,
                            value,
                        ),
                        operational: isOperationalAttributeType(ctx, attributeType),
                    }
                    : {
                        attributeType,
                    },
                [
                    PERMISSION_CATEGORY_FILTER_MATCH,
                    PERMISSION_CATEGORY_COMPARE, // Not required by specification.
                    PERMISSION_CATEGORY_READ, // Not required by specification.
                ],
                bacSettings,
                true,
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
                assn,
                target,
                search["&operationCode"]!,
                state.chainingArguments.aliasDereferenced ?? ChainingArguments._default_value_for_aliasDereferenced,
                data.criticalExtensions ?? new Uint8ClampedArray(),
                dontUseCopy,
                copyShallDo,
                state.chainingArguments.excludeShadows ?? ChainingArguments._default_value_for_excludeShadows,
                undefined,
                argument,
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
                );
                state.SRcontinuationList.push(cr);
            }
            return;
        }
    }

    if (target.dse.alias && searchAliases) {
        if (
            accessControlScheme
            && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
        ) {
            const authorizedToReadEntry: boolean = authorized([
                PERMISSION_CATEGORY_READ,
            ]);
            const { authorized: authorizedToReadAliasedEntryName } = bacACDF(
                relevantTuples,
                user,
                {
                    attributeType: id_at_aliasedEntryName,
                    operational: false,
                },
                [ PERMISSION_CATEGORY_READ ],
                bacSettings,
                true,
            );
            const { authorized: authorizedToReadAliasedEntryNameValue } = bacACDF(
                relevantTuples,
                user,
                {
                    value: new AttributeTypeAndValue(
                        id_at_aliasedEntryName,
                        _encode_DistinguishedName(target.dse.alias.aliasedEntryName, DER),
                    ),
                    operational: false,
                },
                [ PERMISSION_CATEGORY_READ ],
                bacSettings,
                true,
            );
            if (
                !authorizedToReadEntry
                || !authorizedToReadAliasedEntryName
                || !authorizedToReadAliasedEntryNameValue
            ) {
                return; // REVIEW: This is not totally correct.
            }
        }
        await searchAliasesProcedure(
            ctx,
            assn,
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
                        assn.boundNameAndUID?.dn,
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
    const familyReturn: FamilyReturn = data.selection?.familyReturn
        ?? EntryInformationSelection._default_value_for_familyReturn;
    if ((subset === SearchArgumentData_subset_oneLevel) && !entryOnly) { // Step 3
        // Nothing needs to be done here. Proceed to step 6.
        // This no-op section is basically so that a one-level search does not
        // include the target entry.
    } else if ((subset === SearchArgumentData_subset_baseObject) || entryOnly) { // Step 4
        if (!( // Notice the inversion.
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
                (assn instanceof LDAPAssociation)
                && (subset === SearchArgumentData_subset_baseObject)
            )
        )) {
            return;
        }
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
        const family = (assn instanceof LDAPAssociation)
            ? target // Saves us an unnecessary database query.
            : await readFamily(ctx, target);
        const familySubsets = familySubsetGetter(family);
        let filterResult: ReturnType<typeof evaluateFilter> = {
            matched: false,
            contributingEntries: new Set(),
        };
        let matchedFamilySubset: Vertex[] | undefined;
        for (const familySubset of familySubsets) {
            if (familySubset.length === 0) {
                ctx.log.warn(ctx.i18n.t("log:family_subset_had_zero_members"), {
                    remoteFamily: assn.socket.remoteFamily,
                    remoteAddress: assn.socket.remoteAddress,
                    remotePort: assn.socket.remotePort,
                    association_id: assn.id,
                });
                continue; // This should never happen, but just handling it in case it does.
            }
            const familyInfos = await Promise.all(
                familySubset.map((member) => readFamilyMemberInfo(member)),
            );
            try {
                filterResult = evaluateFilter(filter, familyInfos, filterOptions);
            } catch (e) {
                if (e instanceof CannotPerformExactly) {
                    throw new errors.ServiceError(
                        ctx.i18n.t("err:could_not_match_exactly"),
                        new ServiceErrorData(
                            ServiceProblem_unsupportedMatchingUse,
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                id_errcode_serviceError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                } else {
                    continue;
                }
            }
            if (filterResult.matched || searchingForRootDSE) {
                matchedFamilySubset = familySubset;
                break;
            }
        }
        if (matchedFamilySubset) {
            const familySelect: Set<IndexableOID> | null = data.selection?.familyReturn?.familySelect?.length
                ? new Set(data.selection.familyReturn.familySelect.map((oid) => oid.toString()))
                : null;
            const contributingEntriesByIndex: Set<number> = filterResult.contributingEntries;
            /** DEVIATION:
             *
             * X.511 (2016), Section 7.13 states that:
             *
             * > If the filter used is the default filter (and : { }), then all
             * members of a family grouping shall be marked as participating
             * members, but not as contributing members.
             *
             * This is a problem, because `familyReturn` defaults to
             * `contributingEntriesOnly`, which means that _nothing_ will be
             * returned even though the compound entry as a whole matches
             * `and:{}`. In other words, if the default search filter and
             * selection are used, compound entries will be entirely hidden from
             * results if the X.500 specifications are observed strictly.
             *
             * This was probably not intentional, so I reported it. In early
             * January of 2022. Until I get clarification, Meerkat DSA will
             * mark every entry as a contributing member if there is a match,
             * but no identified contributing members.
             */
            if (
                (familyReturn.memberSelect === FamilyReturn_memberSelect_contributingEntriesOnly)
                && (contributingEntriesByIndex.size === 0)
            ) {
                matchedFamilySubset
                    .forEach((_, i) => contributingEntriesByIndex.add(i));
            }
            const contributingEntryIds: Set<number> = new Set(
                matchedFamilySubset
                    .filter((_, i) => contributingEntriesByIndex.has(i))
                    .map((member) => member.dse.id),
            );
            const memberSelectIds = getFamilyMembersToReturnById(
                familyReturn,
                matchedFamilySubset,
                contributingEntryIds,
            );
            // If separateFamilyMembers, you can remove familyMembersToReturnById IDs that have already been returned.
            const familySubsetToReturn = keepSubsetOfDITById(family, memberSelectIds, familySelect);
            assert(familySubsetToReturn);
            const verticesToReturn: Vertex[] = Array.from(walkMemory(familySubsetToReturn));
            const resultsById: Map<number, [ Vertex, BOOLEAN, EntryInformation_information_Item[], boolean ]> = new Map(
                await Promise.all(
                    verticesToReturn
                        .map(async (member) => {
                            const permittedEntryReturn = await readPermittedEntryInformation(
                                ctx,
                                member,
                                user,
                                relevantTuples,
                                accessControlScheme,
                                {
                                    selection: data.selection, // TODO: Future improvement: filter out non-permitted types.
                                    relevantSubentries,
                                    operationContexts: data.operationContexts,
                                    attributeSizeLimit,
                                    noSubtypeSelection,
                                    dontSelectFriends,
                                },
                            );
                            return [
                                member.dse.id,
                                [
                                    member,
                                    permittedEntryReturn.incompleteEntry,
                                    permittedEntryReturn.information,
                                    permittedEntryReturn.discloseIncompleteEntry,
                                ] as [ Vertex, BOOLEAN, EntryInformation_information_Item[], boolean ]
                            ] as const;
                        }),
                ),
            );
            if (
                matchedValuesOnly
                && filterResult.matchedValues?.length
                && !typesOnly // This option would make no sense with matchedValuesOnly.
            ) {
                const matchedValuesByEntryId = filterResult.matchedValues?.length
                    ? _.groupBy(filterResult.matchedValues, (mv) => matchedFamilySubset![mv.entryIndex].dse.id)
                    : {};
                for (const [ id, result ] of resultsById.entries()) {
                    const [ , , einfo ] = result;
                    // We create new attributes from the matched values for the member...
                    const matchedValuesAttributes = attributesFromValues(matchedValuesByEntryId[id] ?? []);
                    if (!matchedValuesAttributes.length) {
                        continue;
                    }
                    // Then we index these attributes by their type OIDs.
                    const matchedValuesTypes: Set<IndexableOID> = new Set(
                        matchedValuesAttributes.map((mva) => mva.type_.toString()),
                    );
                    /**
                     * Remember: matchedValuesOnly only filters the
                     * values of attributes that contributed to the
                     * match. All other information is returned
                     * unchanged. This was actually a point of
                     * confusion to the IETF LDAP working group, which
                     * is why LDAP's matchedValues extension does not
                     * align with DAP's matchedValuesOnly boolean.
                     *
                     * See: https://www.rfc-editor.org/rfc/rfc3876.html#section-3
                     *
                     * This was later clarified in the X.500 standards.
                     * There is a notable increase in detail in X.511's
                     * description of matchedValuesOnly in the 2001
                     * version of the specification.
                     */
                    result[2] = [
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
            if (separateFamilyMembers) {
                const separateResults = Array.from(resultsById.values())
                    .filter(([ vertex ]) => !searchState.alreadyReturnedById.has(vertex.dse.id))
                    .map(([ vertex, incompleteEntry, info, discloseIncompleteness ]) => new EntryInformation(
                        {
                            rdnSequence: getDistinguishedName(vertex),
                        },
                        !vertex.dse.shadow,
                        attributeSizeLimit
                            ? info.filter(filterEntryInfoItemBySize)
                            : info,
                        discloseIncompleteness
                            ? incompleteEntry
                            : false,
                        (state.partialName && (searchState.depth === 0)),
                        undefined,
                    ));
                for (const id of resultsById.keys()) {
                    searchState.alreadyReturnedById.add(id);
                    searchState.paging?.[1].alreadyReturnedById.add(id);
                }
                searchState.results.push(...separateResults);
            } else {
                const rootResult = resultsById.get(familySubsetToReturn.dse.id)!;
                if ((resultsById.size > 1) && !(assn instanceof LDAPAssociation)) { // If there actually are children.
                    const familyEntries: FamilyEntries[] = convertSubtreeToFamilyInformation(
                        familySubsetToReturn,
                        (vertex: Vertex) => resultsById.get(vertex.dse.id)?.[2] ?? [],
                    );
                    const familyInfoAttr: Attribute = new Attribute(
                        family_information["&id"],
                        familyEntries.map((fe) => family_information.encoderFor["&Type"]!(fe, DER)),
                        undefined,
                    );
                    rootResult[2].push({
                        attribute: familyInfoAttr,
                    });
                }
                if (
                    !searchState.alreadyReturnedById.has(rootResult[0].dse.id)
                    && !searchState.paging?.[1].alreadyReturnedById.has(rootResult[0].dse.id)
                ) {
                    searchState.results.push(
                        new EntryInformation(
                            {
                                rdnSequence: getDistinguishedName(rootResult[0]),
                            },
                            !rootResult[0].dse.shadow,
                            attributeSizeLimit
                                ? rootResult[2].filter(filterEntryInfoItemBySize)
                                : rootResult[2],
                            rootResult[3] // discloseOnError?
                                ? rootResult[1] // -> tell them the truth
                                : false, // -> say the entry is complete even when it is not
                            (state.partialName && (searchState.depth === 0)),
                            undefined,
                        ),
                    );
                }
                searchState.alreadyReturnedById.add(rootResult[0].dse.id);
                searchState.paging?.[1].alreadyReturnedById.add(rootResult[0].dse.id);
            }
            if (data.hierarchySelections && !data.hierarchySelections[HierarchySelections_self]) {
                hierarchySelectionProcedure(
                    ctx,
                    data.hierarchySelections,
                    data.serviceControls?.serviceType,
                );
            }
        }
        return;
    } else if ( // Step 5
        !entryOnly // It is implied that this is a subtree search at this point.
        && (
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
    ) /* if ((subset === SearchArgumentData_subset_wholeSubtree) && !entryOnly) */ { // Condition is implied.
        // Entry ACI is checked above.
        // NOTE: This section of code is copy-pasted. There might be a way to de-duplicate
        const family = (assn instanceof LDAPAssociation)
            ? target // Saves us an unnecessary database query.
            : await readFamily(ctx, target);
        const familySubsets = familySubsetGetter(family);
        let filterResult: ReturnType<typeof evaluateFilter> = {
            matched: false,
            contributingEntries: new Set(),
        };
        let matchedFamilySubset: Vertex[] | undefined;
        for (const familySubset of familySubsets) {
            if (familySubset.length === 0) {
                ctx.log.warn(ctx.i18n.t("log:family_subset_had_zero_members"), {
                    remoteFamily: assn.socket.remoteFamily,
                    remoteAddress: assn.socket.remoteAddress,
                    remotePort: assn.socket.remotePort,
                    association_id: assn.id,
                });
                continue; // This should never happen, but just handling it in case it does.
            }
            const familyInfos = await Promise.all(
                familySubset.map((member) => readFamilyMemberInfo(member)),
            );
            try {
                filterResult = evaluateFilter(filter, familyInfos, filterOptions);
            } catch (e) {
                if (e instanceof CannotPerformExactly) {
                    throw new errors.ServiceError(
                        ctx.i18n.t("err:could_not_match_exactly"),
                        new ServiceErrorData(
                            ServiceProblem_unsupportedMatchingUse,
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                id_errcode_serviceError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                } else {
                    continue;
                }
            }
            if (filterResult.matched) {
                matchedFamilySubset = familySubset;
                break;
            }
        }
        if (matchedFamilySubset) {
            const familySelect: Set<IndexableOID> | null = data.selection?.familyReturn?.familySelect?.length
                ? new Set(data.selection.familyReturn.familySelect.map((oid) => oid.toString()))
                : null;
            const contributingEntriesByIndex: Set<number> = filterResult.contributingEntries;
            /** DEVIATION:
             *
             * X.511 (2016), Section 7.13 states that:
             *
             * > If the filter used is the default filter (and : { }), then all
             * members of a family grouping shall be marked as participating
             * members, but not as contributing members.
             *
             * This is a problem, because `familyReturn` defaults to
             * `contributingEntriesOnly`, which means that _nothing_ will be
             * returned even though the compound entry as a whole matches
             * `and:{}`. In other words, if the default search filter and
             * selection are used, compound entries will be entirely hidden from
             * results if the X.500 specifications are observed strictly.
             *
             * This was probably not intentional, so I reported it. In early
             * January of 2022. Until I get clarification, Meerkat DSA will
             * mark every entry as a contributing member if there is a match,
             * but no identified contributing members.
             */
            if (
                (familyReturn.memberSelect === FamilyReturn_memberSelect_contributingEntriesOnly)
                && (contributingEntriesByIndex.size === 0)
            ) {
                matchedFamilySubset
                    .forEach((_, i) => contributingEntriesByIndex.add(i));
            }
            const contributingEntryIds: Set<number> = new Set(
                matchedFamilySubset
                    .filter((_, i) => contributingEntriesByIndex.has(i))
                    .map((member) => member.dse.id),
            );
            const memberSelectIds = getFamilyMembersToReturnById(
                familyReturn,
                matchedFamilySubset,
                contributingEntryIds,
            );
            // If separateFamilyMembers, you can remove familyMembersToReturnById IDs that have already been returned.
            const familySubsetToReturn = keepSubsetOfDITById(family, memberSelectIds, familySelect);
            assert(familySubsetToReturn);
            const verticesToReturn: Vertex[] = Array.from(walkMemory(familySubsetToReturn));
            const resultsById: Map<number, [ Vertex, BOOLEAN, EntryInformation_information_Item[], boolean ]> = new Map(
                await Promise.all(
                    verticesToReturn
                        .map(async (member) => {
                            const permittedEntryReturn = await readPermittedEntryInformation(
                                ctx,
                                member,
                                user,
                                relevantTuples,
                                accessControlScheme,
                                {
                                    selection: data.selection, // TODO: Future improvement: filter out non-permitted types.
                                    relevantSubentries,
                                    operationContexts: data.operationContexts,
                                    attributeSizeLimit,
                                    noSubtypeSelection,
                                    dontSelectFriends,
                                },
                            );
                            return [
                                member.dse.id,
                                [
                                    member,
                                    permittedEntryReturn.incompleteEntry,
                                    permittedEntryReturn.information,
                                    permittedEntryReturn.discloseIncompleteEntry,
                                ] as [ Vertex, BOOLEAN, EntryInformation_information_Item[], boolean ]
                            ] as const;
                        }),
                ),
            );
            if (
                matchedValuesOnly
                && filterResult.matchedValues?.length
                && !typesOnly // This option would make no sense with matchedValuesOnly.
            ) {
                const matchedValuesByEntryId = filterResult.matchedValues?.length
                    ? _.groupBy(filterResult.matchedValues, (mv) => matchedFamilySubset![mv.entryIndex].dse.id)
                    : {};
                for (const [ id, result ] of resultsById.entries()) {
                    const [ , , einfo ] = result;
                    // We create new attributes from the matched values for the member...
                    const matchedValuesAttributes = attributesFromValues(matchedValuesByEntryId[id] ?? []);
                    if (!matchedValuesAttributes.length) {
                        continue;
                    }
                    // Then we index these attributes by their type OIDs.
                    const matchedValuesTypes: Set<IndexableOID> = new Set(
                        matchedValuesAttributes.map((mva) => mva.type_.toString()),
                    );
                    /**
                     * Remember: matchedValuesOnly only filters the
                     * values of attributes that contributed to the
                     * match. All other information is returned
                     * unchanged. This was actually a point of
                     * confusion to the IETF LDAP working group, which
                     * is why LDAP's matchedValues extension does not
                     * align with DAP's matchedValuesOnly boolean.
                     *
                     * See: https://www.rfc-editor.org/rfc/rfc3876.html#section-3
                     *
                     * This was later clarified in the X.500 standards.
                     * There is a notable increase in detail in X.511's
                     * description of matchedValuesOnly in the 2001
                     * version of the specification.
                     */
                    result[2] = [
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
            if (separateFamilyMembers) {
                const separateResults = Array.from(resultsById.values())
                    .filter(([ vertex ]) => !searchState.alreadyReturnedById.has(vertex.dse.id))
                    .map(([ vertex, incompleteEntry, info, discloseIncompleteness ]) => new EntryInformation(
                        {
                            rdnSequence: getDistinguishedName(vertex),
                        },
                        !vertex.dse.shadow,
                        attributeSizeLimit
                            ? info.filter(filterEntryInfoItemBySize)
                            : info,
                        discloseIncompleteness
                            ? incompleteEntry
                            : false,
                        (state.partialName && (searchState.depth === 0)),
                        undefined,
                    ));
                for (const id of resultsById.keys()) {
                    searchState.alreadyReturnedById.add(id);
                    searchState.paging?.[1].alreadyReturnedById.add(id);
                }
                searchState.results.push(...separateResults);
            } else {
                const rootResult = resultsById.get(familySubsetToReturn.dse.id)!;
                if ((resultsById.size > 1) && !(assn instanceof LDAPAssociation)) { // If there actually are children.
                    const familyEntries: FamilyEntries[] = convertSubtreeToFamilyInformation(
                        familySubsetToReturn,
                        (vertex: Vertex) => resultsById.get(vertex.dse.id)?.[2] ?? [],
                    );
                    const familyInfoAttr: Attribute = new Attribute(
                        family_information["&id"],
                        familyEntries.map((fe) => family_information.encoderFor["&Type"]!(fe, DER)),
                        undefined,
                    );
                    rootResult[2].push({
                        attribute: familyInfoAttr,
                    });
                }
                if (
                    !searchState.alreadyReturnedById.has(rootResult[0].dse.id)
                    && !searchState.paging?.[1].alreadyReturnedById.has(rootResult[0].dse.id)
                ) {
                    searchState.results.push(
                        new EntryInformation(
                            {
                                rdnSequence: getDistinguishedName(rootResult[0]),
                            },
                            !rootResult[0].dse.shadow,
                            attributeSizeLimit
                                ? rootResult[2].filter(filterEntryInfoItemBySize)
                                : rootResult[2],
                            rootResult[3] // discloseOnError?
                                ? rootResult[1] // -> tell them the truth
                                : false, // -> say the entry is complete even when it is not
                            (state.partialName && (searchState.depth === 0)),
                            undefined,
                        ),
                    );
                }
                searchState.alreadyReturnedById.add(rootResult[0].dse.id);
                searchState.paging?.[1].alreadyReturnedById.add(rootResult[0].dse.id);
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
        );
        state.SRcontinuationList.push(cr);
    }

    const getNextBatchOfSubordinates = async (): Promise<Vertex[]> => readSubordinates(
        ctx,
        target,
        /** 9967C6CD-DE0D-4F76-97D3-6D1686C39677
         * "Why don't you just fetch `pageSize` number of entries?"
         *
         * Pagination fetches `pageSize` number of entries at _each level_ of search
         * recursion. In other words, if you request a page size of 100, and, in the
         * process, you recurse into the DIT ten layers deep, there will actually be
         * 1000 entries loaded into memory at the deepest part. This means that a
         * request could consume considerably higher memory than expected. To prevent
         * this, a fixed page size is used. In the future, this may be configurable.
         */
        ctx.config.entriesPerSubordinatesPage,
        undefined,
        cursorId,
        {
            // ...(data.filter
            //     ? convertFilterToPrismaSelect(ctx, data.filter)
            //     : {}),
            subentry: subentries,
            EntryObjectClass: (searchFamilyInEffect
                ? {
                    some: {
                        object_class: CHILD,
                    },
                }
                : (assn instanceof LDAPAssociation)
                    ? undefined
                    : {
                        none: {
                            object_class: CHILD,
                        },
                    }),
        },
    );
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
                            assn.boundNameAndUID?.dn,
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
                );
                return;
            }
            if (subentries && !subordinate.dse.subentry) {
                cursorId = subordinate.dse.id;
                if (searchState.paging?.[1].cursorIds) {
                    searchState.paging[1].cursorIds[searchState.depth] = subordinate.dse.id;
                }
                continue;
            }
            /**
             * We do not iterate over child entries, because
             * those will be returned--or not--with the
             * ancestor entry.
             */
            if (
                searchFamilyInEffect
                    ? !subordinate.dse.objectClass.has(CHILD)
                    : (subordinate.dse.objectClass.has(CHILD) && !(assn instanceof LDAPAssociation))
            ) {
                cursorId = subordinate.dse.id;
                if (searchState.paging?.[1].cursorIds) {
                    searchState.paging[1].cursorIds[searchState.depth] = subordinate.dse.id;
                }
                continue;
            }
            if (subordinate.dse.subr && !subordinate.dse.cp) { // Step 7.a.
                const cr = new ContinuationReference(
                    {
                        /**
                         * It might seem counter-intuitive that the specification says to
                         * set the targetObject to e, rather than e', but if you look at
                         * the implementation of Search (II), you'll see that Search (II)
                         * only uses the subordinates of the target object that are of
                         * type `cp` to resume the Search (I) recursion.
                         */
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
                assn,
                {
                    ...state,
                    admPoints: subordinate.dse.admPoint
                        ? (subordinate.dse.admPoint.administrativeRole.has(AUTONOMOUS)
                            ? [ subordinate ]
                            : [ ...state.admPoints, subordinate ])
                        : [ ...state.admPoints ],
                    chainingArguments: newChainingArguments,
                    foundDSE: subordinate,
                },
                argument,
                searchState,
            );
            searchState.depth--;
            /**
             * It is CRITICAL that this appears BEFORE the cursor update.
             * Otherwise, you will not continue to return results from
             * incompletely-searched subordinates.
             */
            if (searchState.poq && (searchState.poq.limitProblem !== undefined)) {
                return;
            }
            /**
             * We record what entries we have recorded AFTER we recurse into the
             * subordinates so that we do not have to recover our steps. The
             * cursor ID being set means that we are finished with this
             * subordinate completely.
             *
             * Note that, unlike with the list operation, the result size limits
             * are checked near the start of the search procedure rather than
             * within each iteration of its subordinates. An exceeded limit is
             * indicated recursively to superiors through the search state's
             * `poq` property (Partial Outcome Qualifier). Therefore, updating
             * the cursor ID must happen only if we have not received a partial
             * outcome qualifier from recursion, which is why we return from
             * this procedure before we get to this part.
             */
            {
                cursorId = subordinate.dse.id;
                if (searchState.paging?.[1].cursorIds) {
                    searchState.paging[1].cursorIds[searchState.depth] = subordinate.dse.id;
                }
            }
        }
        subordinatesInBatch = await getNextBatchOfSubordinates();
    }
    // subordinatesInBatch.length === 0 beyond this point.
    if ((searchState.depth === 0) && searchState.paging) {
        // conn.pagedResultsRequests.delete(searchState.paging[0]);
        searchState.paging[1].cursorIds.pop();
    }
}

export default search_i;
