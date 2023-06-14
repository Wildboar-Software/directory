import type {
    Vertex,
    ClientAssociation,
    WithRequestStatistics,
    WithOutcomeStatistics,
    PagedResultsRequestState,
    IndexableOID,
    Context,
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
    SearchArgumentData_subset,
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import {
    OBJECT_IDENTIFIER,
    TRUE_BIT,
    TRUE,
    ASN1Element,
    ObjectIdentifier,
    BOOLEAN,
    ASN1TagClass,
    ASN1UniversalType,
    INTEGER,
    OPTIONAL,
} from "asn1-ts";
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
    ServiceControlOptions,
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
    SecurityProblem_invalidSignature,
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
    ServiceProblem_requestedServiceNotAvailable,
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
    FamilyGrouping,
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
    SearchControlOptions_useSubset,
    SearchControlOptions_separateFamilyMembers,
    SearchControlOptions_searchFamily,
    SearchControlOptions,
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
import { MINIMUM_MAX_ATTR_SIZE, MAX_RESULTS, UNTRUSTED_REQ_AUTH_LEVEL } from "../constants";
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
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
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
import { stringifyDN } from "../x500/stringifyDN";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import { printInvokeId } from "../utils/printInvokeId";
import { administrativeRole, entryACI, prescriptiveACI, searchRules, subentryACI } from "@wildboar/x500/src/lib/collections/attributes";
import { AttributeType } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import { FilterItem } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FilterItem.ta";
import { Prisma } from "@prisma/client";
import getAttributeParentTypes from "../x500/getAttributeParentTypes";
import {
    MRMapping,
} from "@wildboar/x500/src/lib/modules/ServiceAdministration/MRMapping.ta";
import {
    oid,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/oid.oa";
import {
    integer,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integer.oa";
import {
    boolean_,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/boolean.oa";
// TODO: Once value normalization is implemented, these shall be incorporated
// into `convertFilterToPrismaSelect()`.
// import {
//     uuid,
// } from "@wildboar/parity-schema/src/lib/modules/UUID/uuid.oa";
// import {
//     bitString,
// } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/bitString.oa";
// import {
//     countryString,
// } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryString.oa";
// import {
//     octetString,
// } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/octetString.oa";
import {
    objectIdentifierMatch,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectIdentifierMatch.oa";
import {
    integerMatch,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integerMatch.oa";
import {
    booleanMatch,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/booleanMatch.oa";
import getEqualityNormalizer from "../x500/getEqualityNormalizer";
import { id_mr_nullMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-mr-nullMatch.va";
import { groupByOID } from "@wildboar/x500";
import { systemProposedMatch } from "@wildboar/x500/src/lib/collections/matchingRules";
import { id_mr_zonalMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-mr-zonalMatch.va";
import { mapFilterForPostalZonalMatch } from "../matching/zonal";
import {
    ZonalResult_multiple_mappings,
    ZonalResult_zero_mappings,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/ZonalResult.ta";
import { searchServiceProblem } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/searchServiceProblem.oa";
import {
    id_pr_ambiguousKeyAttributes,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-ambiguousKeyAttributes.va";
import {
    id_pr_unmatchedKeyAttributes,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-unmatchedKeyAttributes.va";
// TODO: Once value normalization is implemented, these shall be incorporated
// into `convertFilterToPrismaSelect()`.
// import {
//     bitStringMatch,
// } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/bitStringMatch.oa";
// import {
//     octetStringMatch,
// } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/octetStringMatch.oa";
import {
    RequestAttribute,
    ResultAttribute,
    SearchRule,
} from "@wildboar/x500/src/lib/modules/ServiceAdministration/SearchRule.ta";
import { HierarchySelections } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/HierarchySelections.ta";
import { getServiceAdminPoint } from "../dit/getServiceAdminPoint";
import getEntryExistsFilter from "../database/entryExistsFilter";
import { attributeValueFromDB } from "../database/attributeValueFromDB";
import { getEffectiveControlsFromSearchRule } from "../service/getEffectiveControlsFromSearchRule";
import { id_ar_serviceSpecificArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-serviceSpecificArea.va";
import { ID_AR_SERVICE, ID_AUTONOMOUS } from "../../oidstr";
import { isMatchAllFilter } from "../x500/isMatchAllFilter";

// NOTE: This will require serious changes when service specific areas are implemented.

const BYTES_IN_A_UUID: number = 16;
const PARENT: string = id_oc_parent.toString();
const CHILD: string = id_oc_child.toString();
const AUTONOMOUS: string = id_ar_autonomousArea.toString();
const FALSE_CONTENT_OCTETS: Buffer = Buffer.from([ 0x00 ]);

export
interface SearchState extends Partial<WithRequestStatistics>, Partial<WithOutcomeStatistics> {
    chaining: ChainingResults;
    results: EntryInformation[];
    resultSets: SearchResult[];
    poq?: PartialOutcomeQualifier;
    depth: number;
    paging?: [ queryReference: string, pagingState: PagedResultsRequestState ];
    familyOnly?: boolean;

    /**
     * Entries that are excluded from being returned because they were either
     * added to the result set already or they were de-selected via exclusive
     * relaxation (See ITU Rec. X.501 (2019), Section 13.6.2).
     */
    excludedById: Set<number>;

    /**
     * Regardless of the search argument, the currently effective filter, after
     * considering relaxation or tightening.
     */
    effectiveFilter?: Filter;

    /**
     * This is a mapping of both attribute type OIDs to the OID of the
     * currently-applicable matching rule that supplants the default.
     */
    matching_rule_substitutions: Map<IndexableOID, OBJECT_IDENTIFIER>;

    /**
     * Notification attributes.
     */
    notification: Attribute[];

    // These are set by service administration.
    governingSearchRule?: SearchRule;
    outputAttributeTypes?: Map<IndexableOID, ResultAttribute>;
    effectiveServiceControls?: ServiceControlOptions;
    effectiveSearchControls?: SearchControlOptions;
    effectiveHierarchySelections?: HierarchySelections;
    effectiveSubset?: SearchArgumentData_subset;
    effectiveEntryLimit: number;
    effectiveFamilyGrouping?: FamilyGrouping;
    effectiveFamilyReturn?: FamilyReturn;
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
export function getCurrentNumberOfResults (state: SearchState): number {
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

/**
 * @summary Determine whether attributes can be queried from the `AttributeValue` table.
 * @description
 *
 * This function determines if all attribute types specified in `types` can be
 * queried via the `AttributeValue` table. This is the case if there is no
 * driver defined for that attribute type, and the attribute type is neither a
 * dummy or collective attribute type.
 *
 * @param ctx The context object
 * @param types The attribute types to check
 * @returns Whether the `AttributeValue` table can be filtered to select for
 *  values of the specified types.
 *
 * @function
 */
function canFilterAttributeValueTable (
    ctx: Context,
    types: AttributeType[],
): boolean {
    for (const t of types) {
        const spec = ctx.attributeTypes.get(t.toString());
        if (
            !spec
            || spec.driver
            || spec.collective
            || spec.dummy
        ) {
            return false;
        }
    }
    return true;
}

/**
 * @summary Determine friend attribute types
 * @description
 *
 * This function gets the friend attribute types of a given attribute type based
 * on the target DSE.
 *
 * @param relevantSubentries Subentries whose subtree selected the target DSE
 * @param type_ The anchor attribute type
 * @returns An array of friend attribute types, not including the type specified
 *  by `type_`.
 *
 * @function
 */
function addFriends (
    relevantSubentries: Vertex[],
    type_: OBJECT_IDENTIFIER,
): AttributeType[] {
    const ret: AttributeType[] = [];
    const friendship = relevantSubentries
        .filter((sub) => sub.dse.objectClass.has(id_soc_subschema.toString()) && sub.dse.subentry)
        .sort((a, b) => {
            const adn = getDistinguishedName(a);
            const bdn = getDistinguishedName(b);
            return (bdn.length - adn.length);
        }) // Select the nearest subschema
        [0]?.dse.subentry!.friendships?.find((fr) => fr.anchor.isEqualTo(type_) && !fr.obsolete);
    if (friendship) {
        for (const friend of friendship.friends) {
            ret.push(friend);
        }
    }
    return ret;
}

/**
 * @summary Convert an X.500 filter item into a Prisma filter on the Entry table
 * @description
 *
 * When using a search operation to filter entries, it may be possible to
 * "pre-filter" said entries within the DBMS (MySQL, Postgres, etc.) before
 * performing the more expensive work of loading those entries and evaluating
 * the filter against them in memory. For instance, if the user is filtering for
 * a `surname` of `Wilbur`, we can pre-filter entries that have an
 * `AttributeValue` whose `normalized_str` is `WILBUR`, thereby greatly
 * narrowing the number of entries Meerkat DSA has to actually load into memory
 * and evaluate.
 *
 * This function implements such an optimization by converting the search filter
 * item into a Prisma (that's the ORM used by Meerkat DSA) filter.
 *
 * @param ctx The context object
 * @param filterItem The filter item to be converted
 * @param relevantSubentries The subentries whose subtrees select for the target DSE.
 * @param selectFriends Whether to select friend attribute types as well
 * @param mr_subs Active matching rule substitutions (as imposed by relaxation or tightening)
 * @param request_attributes Request attribute types (as imposed by search rules)
 * @returns A Prisma filter for the `Entry` table, or `undefined` if this cannot
 *  be produced
 *
 * @function
 * @see {@link convertFilterToPrismaSelect}
 */
function convertFilterItemToPrismaSelect (
    ctx: Context,
    filterItem: FilterItem,
    relevantSubentries: Vertex[],
    selectFriends: boolean,
    mr_subs: SearchState["matching_rule_substitutions"],
    request_attributes?: EvaluateFilterSettings["requestAttributes"],
): Partial<Prisma.EntryWhereInput> | undefined {
    if ("equality" in filterItem) {
        const type_ = filterItem.equality.type_;
        const type_str = type_.toString();
        // For now, if the matching rules for this type are overwritten, just return.
        if (mr_subs.has(type_str)) {
            return undefined;
        }
        const profile = request_attributes?.get(type_str);
        if (profile?.defaultValues) {
            // If there are default values defined, there is no need to pre-filter entries.
            return undefined;
        }
        const value = filterItem.equality.assertion.value;
        if (type_.isEqualTo(objectClass["&id"])) {
            return {
                EntryObjectClass: {
                    some: {
                        object_class: filterItem
                            .equality
                            .assertion
                            .objectIdentifier
                            .toString(),
                    },
                },
            };
        }
        // TODO: You can pre-filter DN-typed values using the `jer` field by
        // checking that every RDN has the correct attribute types.
        // if (type_.isEqualTo(aliasedEntryName["&id"])) {
        //     return {
        //         alias: true,
        //         AliasEntry: {
        //             some: {}, // REVIEW: I feel like this would crash. No way Prisma actually lets you do this.
        //         },
        //     };
        // }
        const typeAndFriends: AttributeType[] = [ type_ ];
        if (selectFriends) {
            typeAndFriends.push(...addFriends(relevantSubentries, type_));
        }
        const selected: AttributeType[] = typeAndFriends.flatMap((s) => Array.from(getAttributeParentTypes(ctx, s)));
        if (!canFilterAttributeValueTable(ctx, selected)) {
            return undefined;
        }
        let ldapSyntax: OBJECT_IDENTIFIER | undefined;
        let eqMatchingRule: OBJECT_IDENTIFIER | undefined;
        for (const st of selected) {
            const spec = ctx.attributeTypes.get(st.toString());
            if (!spec) {
                continue;
            }
            if (spec.equalityMatchingRule) {
                eqMatchingRule = spec.equalityMatchingRule;
            }
            if (spec.ldapSyntax) {
                ldapSyntax = spec.ldapSyntax;
            }
            if (eqMatchingRule || ldapSyntax) {
                break;
            }
        }
        switch (eqMatchingRule?.toString()) {
            case (objectIdentifierMatch["&id"].toString()): {
                return {
                    AttributeValue: {
                        some: {
                            type_oid: {
                                in: selected.map((st) => st.toBytes()),
                            },
                            tag_class: ASN1TagClass.universal,
                            constructed: false,
                            tag_number: ASN1UniversalType.objectIdentifier,
                            content_octets: Buffer.from(value.buffer, value.byteOffset, value.byteLength),
                        },
                    },
                };
            }
            case (integerMatch["&id"].toString()): {
                return {
                    AttributeValue: {
                        some: {
                            type_oid: {
                                in: selected.map((st) => st.toBytes()),
                            },
                            tag_class: ASN1TagClass.universal,
                            constructed: false,
                            tag_number: ASN1UniversalType.integer,
                            content_octets: Buffer.from(value.buffer, value.byteOffset, value.byteLength),
                        },
                    },
                };
            }
            case (booleanMatch["&id"].toString()): {
                return {
                    AttributeValue: {
                        some: {
                            type_oid: {
                                in: selected.map((st) => st.toBytes()),
                            },
                            tag_class: ASN1TagClass.universal,
                            constructed: false,
                            tag_number: ASN1UniversalType.boolean,
                            content_octets: filterItem.equality.assertion.boolean
                                ? { not: FALSE_CONTENT_OCTETS }
                                : FALSE_CONTENT_OCTETS,
                        },
                    },
                };
            }
        }
        switch (ldapSyntax?.toString()) {
            case (oid["&id"].toString()): {
                return {
                    AttributeValue: {
                        some: {
                            type_oid: {
                                in: selected.map((st) => st.toBytes()),
                            },
                            tag_class: ASN1TagClass.universal,
                            constructed: false,
                            tag_number: ASN1UniversalType.objectIdentifier,
                            content_octets: Buffer.from(value.buffer, value.byteOffset, value.byteLength),
                        },
                    },
                };
            }
            case (integer["&id"].toString()): {
                return {
                    AttributeValue: {
                        some: {
                            type_oid: {
                                in: selected.map((st) => st.toBytes()),
                            },
                            tag_class: ASN1TagClass.universal,
                            constructed: false,
                            tag_number: ASN1UniversalType.integer,
                            content_octets: Buffer.from(value.buffer, value.byteOffset, value.byteLength),
                        },
                    },
                };
            }
            case (boolean_["&id"].toString()): {
                return {
                    AttributeValue: {
                        some: {
                            type_oid: {
                                in: selected.map((st) => st.toBytes()),
                            },
                            tag_class: ASN1TagClass.universal,
                            constructed: false,
                            tag_number: ASN1UniversalType.boolean,
                            content_octets: filterItem.equality.assertion.boolean
                                ? { not: FALSE_CONTENT_OCTETS }
                                : FALSE_CONTENT_OCTETS,
                        },
                    },
                };
            }
            // case (uuid["&id"].toString()): {
            //     return {
            //         AttributeValue: {
            //             some: {
            //                 type_oid: {
            //                     in: superTypes.map((st) => st.toBytes()),
            //                 },
            //             },
            //         },
            //     };
            // }
            // case (bitString["&id"].toString()): {
            //     return {
            //         AttributeValue: {
            //             some: {
            //                 type_oid: {
            //                     in: superTypes.map((st) => st.toBytes()),
            //                 },
            //             },
            //         },
            //     };
            // }
            // case (countryString["&id"].toString()): {
            //     return {
            //         AttributeValue: {
            //             some: {
            //                 type_oid: {
            //                     in: superTypes.map((st) => st.toBytes()),
            //                 },
            //             },
            //         },
            //     };
            // }
            // case (octetString["&id"].toString()): {
            //     return {
            //         AttributeValue: {
            //             some: {
            //                 type_oid: {
            //                     in: superTypes.map((st) => st.toBytes()),
            //                 },
            //             },
            //         },
            //     };
            // }
        }
        const normalized_str = getEqualityNormalizer(ctx)(type_)?.(ctx, filterItem.equality.assertion);
        if (normalized_str) {
            return {
                AttributeValue: {
                    some: {
                        type_oid: {
                            in: selected.map((st) => st.toBytes()),
                        },
                        normalized_str,
                    },
                },
            };
        }
        return {
            AttributeValue: {
                some: {
                    type_oid: {
                        in: selected.map((st) => st.toBytes()),
                    },
                },
            },
        };
    } else if ("substrings" in filterItem) {
        const type_ = filterItem.substrings.type_;
        // For now, if the matching rules for this type are overwritten, just return.
        if (mr_subs.has(type_.toString())) {
            return undefined;
        }
        const superTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, type_));
        if (!canFilterAttributeValueTable(ctx, superTypes)) {
            return undefined;
        }
        return {
            AttributeValue: {
                some: {
                    type_oid: {
                        in: superTypes.map((st) => st.toBytes()),
                    },
                },
            },
        };
    } else if ("greaterOrEqual" in filterItem) {
        const type_ = filterItem.greaterOrEqual.type_;
        // For now, if the matching rules for this type are overwritten, just return.
        if (mr_subs.has(type_.toString())) {
            return undefined;
        }
        const superTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, type_));
        if (!canFilterAttributeValueTable(ctx, superTypes)) {
            return undefined;
        }
        return {
            AttributeValue: {
                some: {
                    type_oid: {
                        in: superTypes.map((st) => st.toBytes()),
                    },
                },
            },
        };
    } else if ("lessOrEqual" in filterItem) {
        const type_ = filterItem.lessOrEqual.type_;
        // For now, if the matching rules for this type are overwritten, just return.
        if (mr_subs.has(type_.toString())) {
            return undefined;
        }
        const superTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, type_));
        if (!canFilterAttributeValueTable(ctx, superTypes)) {
            return undefined;
        }
        return {
            AttributeValue: {
                some: {
                    type_oid: {
                        in: superTypes.map((st) => st.toBytes()),
                    },
                },
            },
        };
    } else if ("present" in filterItem) {
        const type_ = filterItem.present;
        const superTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, type_));
        if (!canFilterAttributeValueTable(ctx, superTypes)) {
            return undefined;
        }
        return {
            AttributeValue: {
                some: {
                    type_oid: {
                        in: superTypes.map((st) => st.toBytes()),
                    },
                },
            },
        };
    } else if ("approximateMatch" in filterItem) {
        const type_ = filterItem.approximateMatch.type_;
        // For now, if the matching rules for this type are overwritten, just return.
        if (mr_subs.has(type_.toString())) {
            return undefined;
        }
        const superTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, type_));
        if (!canFilterAttributeValueTable(ctx, superTypes)) {
            return undefined;
        }
        return {
            AttributeValue: {
                some: {
                    type_oid: {
                        in: superTypes.map((st) => st.toBytes()),
                    },
                },
            },
        };
    } else if ("extensibleMatch" in filterItem) {
        const type_ = filterItem.extensibleMatch.type_;
        if (!type_) {
            return undefined;
        }
        const superTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, type_));
        if (!canFilterAttributeValueTable(ctx, superTypes)) {
            return undefined;
        }
        return {
            AttributeValue: {
                some: {
                    type_oid: {
                        in: superTypes.map((st) => st.toBytes()),
                    },
                },
            },
        };
    } else if ("contextPresent" in filterItem) {
        const type_ = filterItem.contextPresent.type_;
        const superTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, type_));
        if (!canFilterAttributeValueTable(ctx, superTypes)) {
            return undefined;
        }
        return {
            AttributeValue: {
                some: {
                    type_oid: {
                        in: superTypes.map((st) => st.toBytes()),
                    },
                },
            },
        };
    } else {
        return undefined;
    }
}

/**
 * @summary Convert an X.500 filter into a Prisma filter on the Entry table
 * @description
 *
 * When using a search operation to filter entries, it may be possible to
 * "pre-filter" said entries within the DBMS (MySQL, Postgres, etc.) before
 * performing the more expensive work of loading those entries and evaluating
 * the filter against them in memory. For instance, if the user is filtering for
 * a `surname` of `Wilbur`, we can pre-filter entries that have an
 * `AttributeValue` whose `normalized_str` is `WILBUR`, thereby greatly
 * narrowing the number of entries Meerkat DSA has to actually load into memory
 * and evaluate.
 *
 * This function implements such an optimization by converting the search filter
 * into a Prisma (that's the ORM used by Meerkat DSA) filter.
 *
 * It is important that this is only used to filter entries when `baseObject`
 * and `oneLevel` searches are used; if it is used to pre-filter in a `subtree`
 * search, the search will fail to recurse into entries that themselves have
 * subordinates that might match!
 *
 * @param ctx The context object
 * @param filter The filter to be converted
 * @param relevantSubentries The subentries whose subtrees select for the target DSE.
 * @param selectFriends Whether to select friend attribute types as well
 * @param mr_subs Active matching rule substitutions (as imposed by relaxation or tightening)
 * @param request_attributes Request attribute types (as imposed by search rules)
 * @returns A Prisma filter for the `Entry` table, or `undefined` if this cannot
 *  be produced
 *
 * @function
 * @see {@link convertFilterItemToPrismaSelect}
 */
function convertFilterToPrismaSelect (
    ctx: Context,
    filter: Filter,
    relevantSubentries: Vertex[],
    selectFriends: boolean,
    mr_subs: SearchState["matching_rule_substitutions"],
    request_attributes?: EvaluateFilterSettings["requestAttributes"],
): Partial<Prisma.EntryWhereInput> | undefined {
    if ("item" in filter) {
        return convertFilterItemToPrismaSelect(ctx, filter.item, relevantSubentries, selectFriends, mr_subs, request_attributes);
    } else if ("and" in filter) {
        return {
            AND: filter.and
                .map((sub) => convertFilterToPrismaSelect(ctx, sub, relevantSubentries, selectFriends, mr_subs, request_attributes))
                .filter((sub): sub is Partial<Prisma.EntryWhereInput> => !!sub),
        };
    } else if ("or" in filter) {
        return {
            OR: filter.or
                .map((sub) => convertFilterToPrismaSelect(ctx, sub, relevantSubentries, selectFriends, mr_subs, request_attributes))
                .filter((sub): sub is Partial<Prisma.EntryWhereInput> => !!sub),
        };
    } else if ("not" in filter) {
        return {
            NOT: convertFilterToPrismaSelect(ctx, filter.not, relevantSubentries, selectFriends, mr_subs, request_attributes),
        };
    } else {
        return undefined;
    }
}

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

const get_emr_info = function (ctx: Context, attributeType: IndexableOID): OBJECT_IDENTIFIER | undefined {
    const spec = ctx.attributeTypes.get(attributeType);
    if (!spec) {
        return undefined;
    }
    if (!spec.equalityMatchingRule) {
        if (spec.parent) {
            return get_emr_info(ctx, spec.parent.toString());
        } else {
            return undefined;
        }
    }
    return ctx.equalityMatchingRules.get(spec.equalityMatchingRule.toString())?.id;
};

const get_omr_info = function (ctx: Context, attributeType: IndexableOID): OBJECT_IDENTIFIER | undefined {
    const spec = ctx.attributeTypes.get(attributeType);
    if (!spec) {
        return undefined;
    }
    if (!spec.orderingMatchingRule) {
        if (spec.parent) {
            return get_omr_info(ctx, spec.parent.toString());
        } else {
            return undefined;
        }
    }
    return ctx.orderingMatchingRules.get(spec.orderingMatchingRule.toString())?.id;
};

const get_smr_info = function (ctx: Context, attributeType: IndexableOID): OBJECT_IDENTIFIER | undefined {
    const spec = ctx.attributeTypes.get(attributeType);
    if (!spec) {
        return undefined;
    }
    if (!spec.substringsMatchingRule) {
        if (spec.parent) {
            return get_smr_info(ctx, spec.parent.toString());
        } else {
            return undefined;
        }
    }
    return ctx.substringsMatchingRules.get(spec.substringsMatchingRule.toString())?.id;
};

/**
 * @summary Apply an MRMapping to a search filter.
 * @description
 *
 * Updates the search state to use non-default matching rules per the procedures
 * defined in ITU Recommendation X.501 (2019), Section 16.10.7, and expounded
 * upon in ITU Recommendation X.511 (2019), Section 11.2.2. This means that it
 * applies both matching rule substitution and mapping-based matching.
 *
 * This implementation is designed to support service administration as
 * described in the second section mentioned above. It does so by taking the
 * `dontMapAttributes` and `pretendMatchingRuleMapping` arguments. The former
 * allows relaxations already applied to an attribute type by the search request
 * to be passed over by those imposed by the search rule. The latter allows
 * current matching rule substitutions to be "reverted" so that the `basic`
 * substitution supplied in the search request can replace the `oldMatchingRule`
 * according to what its value was before the search rule's `basic`
 * substitution.
 *
 * The two above arguments come from the outputs of a previous iteration of this
 * function. The tuple returned contains a set of attributes to _not_ map and
 * a mapping of the new matching rule OID to its prior value.
 *
 * @param ctx The context object
 * @param assn The association
 * @param searchState The search state
 * @param target_object The target DSE's distinguished name
 * @param mrm `MRMapping`
 * @param relaxing Whether this invocation is a relaxation rather than a tightening
 * @param signErrors Whether to sign errors
 * @param aliasDereferenced Whether an alias was dereferenced in finding the target DSE
 * @param extendedArea A user-supplied extended area to use in mapping-based-matching
 * @param includeAllAreas Whether to perform inclusive mapping-based mapping.
 * @param dontMapAttributes A set of attributes to not map.
 * @param pretendMatchingRuleMapping A mapping of new matching rule OIDs to the
 *  OIDs of the matching rules they replaced
 * @returns A tuple, where the first element is a set of all mapped attributes,
 *  and the second is a mapping of new matching rule OID strings to the OIDs of
 *  the matching rules they replaced.
 *
 * @async
 * @function
 */
export
async function apply_mr_mapping (
    ctx: Context,
    assn: ClientAssociation,
    searchState: SearchState,
    target_object: DistinguishedName,
    mrm: MRMapping,
    relaxing: boolean,
    signErrors: boolean,
    aliasDereferenced: boolean,
    extendedArea: OPTIONAL<INTEGER>,
    includeAllAreas: boolean,
    dontMapAttributes: Set<IndexableOID>,
    pretendMatchingRuleMapping?: Map<IndexableOID, OBJECT_IDENTIFIER>,
): Promise<[Set<IndexableOID>, Map<IndexableOID, OBJECT_IDENTIFIER>]> {
    const mapped_attributes: Set<IndexableOID> = new Set();
    const new_mr_to_old: Map<IndexableOID, OBJECT_IDENTIFIER> = new Map();
    if (!searchState.effectiveFilter) {
        // If there is no filter, there is no relaxation or tightening to do.
        return [mapped_attributes, new_mr_to_old];
    }
    const subs_cache = searchState.matching_rule_substitutions;
    const substitutions = mrm.substitution ?? [];
    const attrs = groupByOID(substitutions, (s) => s.attribute);
    for (const [attr, subs] of Object.entries(attrs)) { // Each iteration of this loop is a different attribute type.
        if (dontMapAttributes.has(attr)) {
            continue;
        }
        let mr_oid = subs_cache.get(attr)
            ?? get_emr_info(ctx, attr)
            ?? get_omr_info(ctx, attr)
            ?? get_smr_info(ctx, attr)
            ;

        if (!mr_oid) {
            // If there is no matching rule defined for this attribute type, just ignore it.
            continue;
        }
        const old_mr_oid = mr_oid;
        mr_oid = pretendMatchingRuleMapping?.get(mr_oid?.toString()) ?? mr_oid;

        /**
         * We have to track whether a substitution within this level matched
         * the old matching rule specifically. If it did not, but a "wildcard"
         * substitution was present (no `oldMatchingRule`), we apply that
         * wildcard substitution instead.
         */
        let old_mr_specifically_matched: boolean = false;
        /**
         * For the above reason, we merely record the wildcard matching rule
         * for later use.
         */
        let wildcard_new_mr: OBJECT_IDENTIFIER | undefined;
        for (const sub of subs) { // Each iteration of this loop is a single matching rule substitution.
            if (!sub.oldMatchingRule) {
                // If no `oldMatchingRule`, this is a "wildcard" substitution.
                // We merely record the wildcard substitution for later, in case
                // a more specific substitution does not override the existing
                // matching rule specifically.
                wildcard_new_mr = sub.newMatchingRule ?? id_mr_nullMatch;
                if (wildcard_new_mr.isEqualTo(systemProposedMatch["&id"])) {
                    wildcard_new_mr = (relaxing
                        ? ctx.systemProposedRelaxations.get(mr_oid.toString())
                        : ctx.systemProposedTightenings.get(mr_oid.toString()))
                        ?? id_mr_nullMatch;
                }
                continue;
            }
            if (sub.oldMatchingRule.isEqualTo(mr_oid)) {
                if (sub.newMatchingRule?.isEqualTo(systemProposedMatch["&id"])) {
                    mr_oid = (relaxing
                        ? ctx.systemProposedRelaxations.get(mr_oid.toString())
                        : ctx.systemProposedTightenings.get(mr_oid.toString()))
                        ?? sub.oldMatchingRule
                        ?? id_mr_nullMatch;
                } else {
                    mr_oid = sub.newMatchingRule ?? id_mr_nullMatch;
                }
                new_mr_to_old.set(mr_oid.toString(), old_mr_oid);
                old_mr_specifically_matched = true;
            }
        }
        /* If no substitution for this attribute type at this level explicitly
        overrides the existing matching rule specifically, using the
        `oldMatchingRule` component, we can use the "wildcard" substitution, if
        it was present in this level. */
        if (!old_mr_specifically_matched && wildcard_new_mr) {
            mr_oid = wildcard_new_mr;
            new_mr_to_old.set(mr_oid.toString(), old_mr_oid);
        }
        mapped_attributes.add(attr);
        subs_cache.set(attr, mr_oid);
    }

    const alreadyPerformedMBM: Set<IndexableOID> = new Set();
    for (const mapping of (mrm.mapping ?? [])) {
        if (!searchState.effectiveFilter) {
            continue;
        }
        if (alreadyPerformedMBM.has(mapping.mappingFunction.toString())) {
            continue;
        }
        if (mapping.mappingFunction.isEqualTo(id_mr_zonalMatch)) {
            alreadyPerformedMBM.add(id_mr_zonalMatch.toString());
            const [ zr, new_filter ] = await mapFilterForPostalZonalMatch(
                ctx,
                target_object,
                searchState.effectiveFilter,
                /**
                 * Note that extendedArea is _only_ used here because &userControl
                 * is TRUE for this MBM.
                 */
                Number(extendedArea ?? mapping.level ?? 0),
                !includeAllAreas,
            );
            // In the Meerkat DSA implementation of this zonal match, these outcomes
            // are basically impossible, so this could should never be reached.
            // It is here for thoroughness.
            if (zr === ZonalResult_zero_mappings) {
                throw new errors.ServiceError(
                    ctx.i18n.t("err:zonal_zero_mappings"),
                    new ServiceErrorData(
                        ServiceProblem_requestedServiceNotAvailable,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_errcode_serviceError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        aliasDereferenced,
                        [
                            new Attribute(
                                searchServiceProblem["&id"],
                                [
                                    searchServiceProblem.encoderFor["&Type"]!(id_pr_unmatchedKeyAttributes, DER),
                                ],
                            ),
                        ],
                    ),
                    signErrors,
                );
            }
            if (zr === ZonalResult_multiple_mappings) {
                throw new errors.ServiceError(
                    ctx.i18n.t("err:zonal_multiple_mappings"),
                    new ServiceErrorData(
                        ServiceProblem_requestedServiceNotAvailable,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_errcode_serviceError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        aliasDereferenced,
                        [
                            new Attribute(
                                searchServiceProblem["&id"],
                                [
                                    searchServiceProblem.encoderFor["&Type"]!(id_pr_ambiguousKeyAttributes, DER),
                                ],
                            ),
                        ],
                    ),
                    signErrors,
                );
            }
            searchState.effectiveFilter = new_filter;
        }
    }
    return [mapped_attributes, new_mr_to_old];
}

/**
 * @summary Update the operation dispatcher state with a search rule
 * @description
 *
 * This function updates the operation dispatcher state with the restrictions
 * imposed by a governing search rule so that these may be used in operation
 * evaluation.
 *
 * @param data The unsigned search argument data
 * @param state The operation dispatcher state
 * @param governing_search_rule The governing search rule
 *
 * @function
 * @see {@link update_search_state_with_search_rule}
 */
export
function update_operation_dispatcher_state_with_search_rule (
    data: SearchArgumentData,
    state: OperationDispatcherState,
    governing_search_rule: SearchRule,
): void {
    state.governingSearchRule = governing_search_rule;
    if (governing_search_rule.outputAttributeTypes) {
        const outputAttributeTypes: Map<IndexableOID, ResultAttribute> = new Map();
        for (const out_attr of governing_search_rule.outputAttributeTypes ?? []) {
            outputAttributeTypes.set(out_attr.attributeType.toString(), out_attr);
        }
        state.outputAttributeTypes = outputAttributeTypes;
    }
    const { service: effective_service_opts } = getEffectiveControlsFromSearchRule(
        governing_search_rule,
        data.hierarchySelections,
        data.searchControlOptions,
        data.serviceControls?.options,
        false,
    );
    state.effectiveServiceControls = effective_service_opts;
    if (governing_search_rule.familyReturn !== undefined) {
        // ITU X.501 (2019), Section 16.10.6 states that the search
        // rule shall have precedence when setting memberSelect, but
        // not familySelect.
        const familySelect = data.selection?.familyReturn?.familySelect
            ?? governing_search_rule.familyReturn.familySelect;
        const memberSelect = governing_search_rule.familyReturn.memberSelect
            ?? data.selection?.familyReturn?.memberSelect;
        state.effectiveFamilyReturn = new FamilyReturn(
            memberSelect,
            familySelect,
        );
    }
}

/**
 * @summary Update search operation state with a search rule
 * @description
 *
 * This function updates the search operation state with the restrictions
 * imposed by a governing search rule.
 *
 * @param data The unsigned search argument data
 * @param searchState The search state to be updated
 * @param governing_search_rule The governing search rule
 *
 * @function
 * @see {@link update_operation_dispatcher_state_with_search_rule}
 */
export
function update_search_state_with_search_rule (
    data: SearchArgumentData,
    searchState: SearchState,
    governing_search_rule: SearchRule,
): void {
    searchState.governingSearchRule = governing_search_rule;
    if (governing_search_rule.outputAttributeTypes) {
        const outputAttributeTypes: Map<IndexableOID, ResultAttribute> = new Map();
        for (const out_attr of governing_search_rule.outputAttributeTypes ?? []) {
            outputAttributeTypes.set(out_attr.attributeType.toString(), out_attr);
        }
        searchState.outputAttributeTypes = outputAttributeTypes;
    }
    const {
        hs: effective_hs,
        search: effective_search_opts,
        service: effective_service_opts,
    } = getEffectiveControlsFromSearchRule(
        governing_search_rule,
        data.hierarchySelections,
        data.searchControlOptions,
        data.serviceControls?.options,
        true,
    );
    searchState.effectiveHierarchySelections = effective_hs;
    searchState.effectiveSearchControls = effective_search_opts;
    searchState.effectiveServiceControls = effective_service_opts;

    const useSubset: boolean = (effective_search_opts[SearchControlOptions_useSubset] === TRUE_BIT);
    searchState.effectiveSubset = (useSubset
        ? data.subset
        : (governing_search_rule.imposedSubset ?? data.subset))
        ?? SearchArgumentData._default_value_for_subset;

    if (governing_search_rule.entryLimit) {
        if (data.serviceControls?.sizeLimit) {
            searchState.effectiveEntryLimit = Math.min(
                Number(data.serviceControls.sizeLimit),
                Number(governing_search_rule.entryLimit.max),
            );
        } else {
            searchState.effectiveEntryLimit = Number(governing_search_rule.entryLimit.default_);
        }
    }
    if (governing_search_rule.familyGrouping !== undefined) {
        searchState.effectiveFamilyGrouping = governing_search_rule.familyGrouping;
    }
    if (governing_search_rule.familyReturn !== undefined) {
        // ITU X.501 (2019), Section 16.10.6 states that the search
        // rule shall have precedence when setting memberSelect, but
        // not familySelect.
        const familySelect = data.selection?.familyReturn?.familySelect
            ?? governing_search_rule.familyReturn.familySelect;
        const memberSelect = governing_search_rule.familyReturn.memberSelect
            ?? data.selection?.familyReturn?.memberSelect;
        searchState.effectiveFamilyReturn = new FamilyReturn(
            memberSelect,
            familySelect,
        );
    }
}

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
async function search_i(
    ctx: MeerkatContext,
    assn: ClientAssociation,
    state: OperationDispatcherState,
    argument: SearchArgument,
    searchState: SearchState,
): Promise<void> {
    const data = getOptionallyProtectedValue(argument);
    searchState.effectiveFilter = searchState.effectiveFilter ?? data.extendedFilter ?? data.filter;
    searchState.effectiveEntryLimit = searchState.effectiveEntryLimit
        ?? Number(data.serviceControls?.sizeLimit ?? MAX_RESULTS);
    searchState.effectiveFamilyGrouping = searchState.effectiveFamilyGrouping ?? data.familyGrouping;
    searchState.effectiveFamilyReturn = searchState.effectiveFamilyReturn ?? data.selection?.familyReturn;

    // NOTE: This was copied to Search (II)
    if (state.chainingArguments.searchRuleId && !searchState.governingSearchRule) {
        const searchRuleId = state.chainingArguments.searchRuleId;
        const sap = getServiceAdminPoint(state.foundDSE);
        if (sap) {
            const governing_search_rule = (await ctx.db.attributeValue.findMany({
                where: {
                    entry: {
                        ...getEntryExistsFilter(),
                        immediate_superior_id: sap.dse.id,
                        subentry: true,
                    },
                    type_oid: searchRules["&id"].toBytes(),
                },
                select: {
                    tag_class: true,
                    constructed: true,
                    tag_number: true,
                    content_octets: true,
                },
            }))
                .map(attributeValueFromDB)
                .map(searchRules.decoderFor["&Type"]!)
                .find((sr) => (
                    (sr.id === searchRuleId.id)
                    && sr.dmdId.isEqualTo(searchRuleId.dmdId)
                ));
                ;
            if (governing_search_rule) {
                update_search_state_with_search_rule(data, searchState, governing_search_rule);
            } else {
                ctx.log.warn(ctx.i18n.t("log:unable_to_find_search_rule", {
                    dmd_id: searchRuleId.dmdId.toString(),
                    id: searchRuleId.id.toString(),
                }));
            }
        }
    }

    // TODO: Put all depth == 0 code here.
    return search_i_ex(
        ctx,
        assn,
        state,
        argument,
        searchState,
    );
}


export
async function search_i_ex (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    state: OperationDispatcherState,
    argument: SearchArgument,
    searchState: SearchState,
): Promise<void> {
    const target = state.foundDSE;
    const data = getOptionallyProtectedValue(argument);
    const signErrors: boolean = (
        (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed)
        && (assn.authorizedForSignedErrors)
    );
    const requestor: DistinguishedName | undefined = data
        .securityParameters
        ?.certification_path
        ?.userCertificate
        .toBeSigned
        .subject
        .rdnSequence
        ?? state.chainingArguments.originator
        ?? data.requestor
        ?? assn.boundNameAndUID?.dn;

    if (requestor && (searchState.depth === 0)) {
        ctx.log.debug(ctx.i18n.t("log:requester", {
            aid: assn.id,
            iid: printInvokeId(state.invokeId),
            r: stringifyDN(ctx, requestor).slice(0, 256),
            context: "search_i",
        }));
    }

    // #region Signature validation
    /**
     * Integrity of the signature SHOULD be evaluated at operation evaluation,
     * not before. Because the operation could get chained to a DSA that has a
     * different configuration of trust anchors. To be clear, this is not a
     * requirement of the X.500 specifications--just my personal assessment.
     *
     * Meerkat DSA allows operations with invalid signatures to progress
     * through all pre-operation-evaluation procedures leading up to operation
     * evaluation, but with `AuthenticationLevel.basicLevels.signed` set to
     * `FALSE` so that access controls are still respected. Therefore, if we get
     * to this point in the code, and the argument is signed, but the
     * authentication level has the `signed` field set to `FALSE`, we throw an
     * `invalidSignature` error.
     */
    if (
        (searchState.depth === 0)
        && ("signed" in argument)
        && state.chainingArguments.authenticationLevel
        && ("basicLevels" in state.chainingArguments.authenticationLevel)
        && !state.chainingArguments.authenticationLevel.basicLevels.signed
    ) {
        const remoteHostIdentifier = `${assn.socket.remoteFamily}://${assn.socket.remoteAddress}/${assn.socket.remotePort}`;
        const logInfo = {
            context: "arg",
            host: remoteHostIdentifier,
            aid: assn.id,
            iid: printInvokeId(state.invokeId),
            ap: stringifyDN(ctx, requestor ?? []),
        };
        ctx.log.warn(ctx.i18n.t("log:invalid_signature", logInfo), logInfo);
        throw new errors.SecurityError(
            ctx.i18n.t("err:invalid_signature", logInfo),
            new SecurityErrorData(
                SecurityProblem_invalidSignature,
                undefined,
                undefined,
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn?.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    // #endregion Signature validation
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
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_serviceError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
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
        ?? Boolean(searchState.effectiveSearchControls?.[SearchControlOptions_searchAliases])
        ?? SearchArgumentData._default_value_for_searchAliases;
    const matchedValuesOnly: boolean = data.matchedValuesOnly
        || Boolean(searchState.effectiveSearchControls?.[SearchControlOptions_matchedValuesOnly]);
    const searchRuleReturnsMatchedValuesOnly: boolean = searchState.governingSearchRule?.outputAttributeTypes
        ?.some((oat) => oat.outputValues && ("matchedValuesOnly" in oat.outputValues)) ?? false;
    // const checkOverspecified: boolean = Boolean(searchState.effectiveSearchControls?.[SearchControlOptions_checkOverspecified]);
    const performExactly: boolean = Boolean(searchState.effectiveSearchControls?.[SearchControlOptions_performExactly]);
    // const includeAllAreas: boolean = Boolean(searchState.effectiveSearchControls?.[SearchControlOptions_includeAllAreas]);
    // const noSystemRelaxation: boolean = Boolean(searchState.effectiveSearchControls?.[SearchControlOptions_noSystemRelaxation]);
    const dnAttribute: boolean = Boolean(searchState.effectiveSearchControls?.[SearchControlOptions_dnAttribute]);
    const matchOnResidualName: boolean = Boolean(searchState.effectiveSearchControls?.[SearchControlOptions_matchOnResidualName]);
    // const entryCount: boolean = Boolean(searchState.effectiveSearchControls?.[SearchControlOptions_entryCount]);
    // const useSubset: boolean = Boolean(searchState.effectiveSearchControls?.[SearchControlOptions_useSubset]);
    const separateFamilyMembers: boolean = Boolean(searchState.effectiveSearchControls?.[SearchControlOptions_separateFamilyMembers]);
    const searchFamily: boolean = Boolean(searchState.effectiveSearchControls?.[SearchControlOptions_searchFamily]);

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
    const targetACI = await getACIItems(
        ctx,
        accessControlScheme,
        target.immediateSuperior,
        target,
        relevantSubentries,
        Boolean(target.dse.subentry),
    );
    const acdfTuples: ACDFTuple[] = (targetACI ?? [])
        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
    const isMemberOfGroup = getIsGroupMember(ctx, NAMING_MATCHER);
    const user = requestor
        ? new NameAndOptionalUID(
            requestor,
            state.chainingArguments.uniqueIdentifier,
        )
        : undefined;
    const relevantTuples: ACDFTupleExtended[] = await preprocessTuples(
        accessControlScheme,
        acdfTuples,
        user,
        state.chainingArguments.authenticationLevel ?? UNTRUSTED_REQ_AUTH_LEVEL,
        targetDN,
        isMemberOfGroup,
        NAMING_MATCHER,
    );
    let cursorId: number | undefined = searchState.paging?.[1].cursorIds[searchState.depth];
    const manageDSAIT: boolean = (searchState.effectiveServiceControls?.[manageDSAITBit] === TRUE_BIT);
    if (!searchState.depth && data.pagedResults) { // This should only be done for the first recursion.
        const chainingProhibited = (
            (searchState.effectiveServiceControls?.[chainingProhibitedBit] === TRUE_BIT)
            || manageDSAIT
        );
        const preferChaining: boolean = (searchState.effectiveServiceControls?.[preferChainingBit] === TRUE_BIT);
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
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        id_errcode_serviceError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
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
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_errcode_serviceError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
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
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_errcode_serviceError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
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
                                signErrors,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                id_errcode_serviceError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                        signErrors,
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
                        invokeID: printInvokeId(state.invokeId),
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
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_errcode_serviceError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
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
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        abandoned["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        } else {
            throw new errors.ServiceError(
                ctx.i18n.t("err:unrecognized_paginated_query_syntax"),
                new ServiceErrorData(
                    ServiceProblem_unwillingToPerform,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        id_errcode_serviceError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
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
    const currentNumberOfResults: number = getCurrentNumberOfResults(searchState);
    if (currentNumberOfResults >= searchState.effectiveEntryLimit) {
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
    // TODO: REVIEW: How would this handle alias dereferencing, joins, hierarchy selection, etc?
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
                                signErrors,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                securityError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                        signErrors,
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
                                signErrors,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                nameError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                        signErrors,
                    );
                }
            }
        } else if (!authorizedToSearch) {
            return;
        }
    }
    const subset = Number(searchState.effectiveSubset ?? SearchArgumentData._default_value_for_subset);
    /**
     * NOTE: It is critical that entryOnly comes from ChainingArguments. The
     * default values are the OPPOSITE between ChainingArguments and CommonArguments.
     */
    const entryOnly = state.chainingArguments.entryOnly ?? ChainingArguments._default_value_for_entryOnly;
    const subentries: boolean = (searchState.effectiveServiceControls?.[subentriesBit] === TRUE_BIT);
    const filter: Filter = (matchOnResidualName && state.partialName)
        ? {
            and: [
                (searchState.effectiveFilter ?? SearchArgumentData._default_value_for_filter),
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
        : (searchState.effectiveFilter ?? SearchArgumentData._default_value_for_filter);
    const serviceControlOptions = searchState.effectiveServiceControls;
    // Service controls
    const noSubtypeMatch: boolean = (
        searchState.effectiveServiceControls?.[ServiceControlOptions_noSubtypeMatch] === TRUE_BIT);
    const noSubtypeSelection: boolean = (
        searchState.effectiveServiceControls?.[ServiceControlOptions_noSubtypeSelection] === TRUE_BIT);
    const dontSelectFriends: boolean = (
        searchState.effectiveServiceControls?.[ServiceControlOptions_dontSelectFriends] === TRUE_BIT);
    const dontMatchFriends: boolean = (
        searchState.effectiveServiceControls?.[ServiceControlOptions_dontMatchFriends] === TRUE_BIT);
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
        getEqualityMatcher: getEqualityMatcherGetter(ctx, searchState.matching_rule_substitutions),
        getOrderingMatcher: getOrderingMatcherGetter(ctx, searchState.matching_rule_substitutions),
        getSubstringsMatcher: getSubstringsMatcherGetter(ctx, searchState.matching_rule_substitutions),
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
        matchedValuesOnly: matchedValuesOnly || searchRuleReturnsMatchedValuesOnly,
        dnAttribute,
        requestAttributes: searchState.governingSearchRule?.inputAttributeTypes?.length
            ? (() => {
                const ret: Map<string, RequestAttribute> =
                new Map();
                for (const iat of searchState.governingSearchRule.inputAttributeTypes) {
                    ret.set(iat.attributeType.toString(), iat);
                }
                return ret;
            })()
            : undefined,
    };

    if (target.dse.cp) {
        if (data.exclusions?.some((x) => isPrefix(ctx, x, targetDN))) {
            return;
        } else {
            const suitable: boolean = await checkSuitabilityProcedure(
                ctx,
                state,
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
                signErrors,
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
                return;
            }
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
    const familyGrouping = searchState.effectiveFamilyGrouping ?? SearchArgumentData._default_value_for_familyGrouping;
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
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        id_errcode_serviceError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        }
    })();
    const familyReturn: FamilyReturn = searchState.effectiveFamilyReturn
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
                    invokeID: printInvokeId(state.invokeId),
                });
                continue; // This should never happen, but just handling it in case it does.
            }
            // TODO: Cache attributes from previous reads.
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
                                signErrors,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                id_errcode_serviceError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                        signErrors,
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
            const familySelect: Set<IndexableOID> | null = searchState.effectiveFamilyReturn?.familySelect?.length
                ? new Set(searchState.effectiveFamilyReturn.familySelect.map((oid) => oid.toString()))
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
                        .map(async (member): Promise<[ number, [ Vertex, BOOLEAN, EntryInformation_information_Item[], boolean ] ]> => {
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
                                    outputAttributeTypes: searchState.outputAttributeTypes,
                                },
                            );
                            return [
                                member.dse.id,
                                [
                                    member,
                                    permittedEntryReturn.incompleteEntry,
                                    permittedEntryReturn.information,
                                    permittedEntryReturn.discloseIncompleteEntry,
                                ],
                            ];
                        }),
                ),
            );
            if (
                (matchedValuesOnly || searchRuleReturnsMatchedValuesOnly)
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
                    // If !matchedValuesOnly because matchedValuesOnly acts on all attribute types.
                    if (searchRuleReturnsMatchedValuesOnly && !matchedValuesOnly) { // Therefore...
                        // If the condition above is true, only some attributes
                        // will be filtered for matched values.
                        const oats = searchState.governingSearchRule?.outputAttributeTypes ?? [];
                        for (const oat of oats) {
                            if (!oat.outputValues || !("matchedValuesOnly" in oat.outputValues)) {
                                matchedValuesTypes.delete(oat.attributeType.toString());
                            }
                        }
                    }
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
                const separateResults: [ id: number, info: EntryInformation ][] = Array.from(resultsById.values())
                    .filter(([ vertex ]) => (
                        !searchState.excludedById.has(vertex.dse.id)
                        && !searchState.paging?.[1].alreadyReturnedById.has(vertex.dse.id)
                    ))
                    .map(([ vertex, incompleteEntry, info, discloseIncompleteness ]): [ id: number, info: EntryInformation ] => [
                        vertex.dse.id,
                        new EntryInformation(
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
                        ),
                    ]);
                const ancestorEntryIncluded = separateResults.some((sr) => (sr[0] === target.dse.id));
                if (searchState.effectiveHierarchySelections && ancestorEntryIncluded && target.dse.hierarchy) {
                    await hierarchySelectionProcedure(
                        ctx,
                        assn,
                        target,
                        separateResults,
                        data,
                        searchState,
                        searchState.effectiveHierarchySelections,
                        timeLimitEndTime,
                        separateFamilyMembers,
                    );
                } else {
                    for (const [id] of separateResults) {
                        searchState.excludedById.add(id);
                        searchState.paging?.[1].alreadyReturnedById.add(id);
                    }
                    searchState.results.push(...separateResults.map(s => s[1]));
                }
            } else {
                const rootResult = resultsById.get(familySubsetToReturn.dse.id)!;
                const rootResultIsAncestor: boolean = (rootResult[0].dse.id === target.dse.id);
                const rootEntryInfo = new EntryInformation(
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
                );
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
                /**
                 * If the ancestor is not selected, we do not perform hierarchy
                 * selections, since child entries are not permitted to be a
                 * part of a hierarchical group. ITU Recommendation X.511
                 * (2019), Section 7.13 states this another way:
                 *
                 * > If the ancestor of the compound entry is marked as
                 * > participating (and possibly also as contributing), all
                 * > referenced entries of the hierarchical group that are not
                 * > compound entries shall be selected, otherwise they shall be
                 * > excluded.
                 */
                if (searchState.effectiveHierarchySelections && rootResultIsAncestor && target.dse.hierarchy) {
                    await hierarchySelectionProcedure(
                        ctx,
                        assn,
                        target,
                        [[rootResult[0].dse.id, rootEntryInfo]],
                        data,
                        searchState,
                        searchState.effectiveHierarchySelections,
                        timeLimitEndTime,
                        separateFamilyMembers,
                    );
                } else {
                    if (
                        !searchState.excludedById.has(rootResult[0].dse.id)
                        && !searchState.paging?.[1].alreadyReturnedById.has(rootResult[0].dse.id)
                    ) {
                        searchState.results.push(rootEntryInfo);
                    }
                    searchState.excludedById.add(rootResult[0].dse.id);
                    searchState.paging?.[1].alreadyReturnedById.add(rootResult[0].dse.id);
                }
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
                                signErrors,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                id_errcode_serviceError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                        signErrors,
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
            const familySelect: Set<IndexableOID> | null = searchState.effectiveFamilyReturn?.familySelect?.length
                ? new Set(searchState.effectiveFamilyReturn.familySelect.map((oid) => oid.toString()))
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
                (matchedValuesOnly || searchRuleReturnsMatchedValuesOnly)
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
                    // If !matchedValuesOnly because matchedValuesOnly acts on all attribute types.
                    if (searchRuleReturnsMatchedValuesOnly && !matchedValuesOnly) { // Therefore...
                        // If the condition above is true, only some attributes
                        // will be filtered for matched values.
                        const oats = searchState.governingSearchRule?.outputAttributeTypes ?? [];
                        for (const oat of oats) {
                            if (!oat.outputValues || !("matchedValuesOnly" in oat.outputValues)) {
                                matchedValuesTypes.delete(oat.attributeType.toString());
                            }
                        }
                    }
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
                const separateResults: [ id: number, info: EntryInformation ][] = Array.from(resultsById.values())
                    .filter(([ vertex ]) => (
                        !searchState.excludedById.has(vertex.dse.id)
                        && !searchState.paging?.[1].alreadyReturnedById.has(vertex.dse.id)
                    ))
                    .map(([ vertex, incompleteEntry, info, discloseIncompleteness ]): [ id: number, info: EntryInformation ] => [
                        vertex.dse.id,
                        new EntryInformation(
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
                        ),
                    ]);
                const ancestorEntryIncluded = separateResults.some((sr) => (sr[0] === target.dse.id));
                if (searchState.effectiveHierarchySelections && ancestorEntryIncluded && target.dse.hierarchy) {
                    await hierarchySelectionProcedure(
                        ctx,
                        assn,
                        target,
                        separateResults,
                        data,
                        searchState,
                        searchState.effectiveHierarchySelections,
                        timeLimitEndTime,
                        separateFamilyMembers,
                    );
                } else {
                    for (const [id] of separateResults) {
                        searchState.excludedById.add(id);
                        searchState.paging?.[1].alreadyReturnedById.add(id);
                    }
                    searchState.results.push(...separateResults.map(s => s[1]));
                }
            } else {
                const rootResult = resultsById.get(familySubsetToReturn.dse.id)!;
                const rootResultIsAncestor: boolean = (rootResult[0].dse.id === target.dse.id);
                const rootEntryInfo = new EntryInformation(
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
                );
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
                /**
                 * If the ancestor is not selected, we do not perform hierarchy
                 * selections, since child entries are not permitted to be a
                 * part of a hierarchical group. ITU Recommendation X.511
                 * (2019), Section 7.13 states this another way:
                 *
                 * > If the ancestor of the compound entry is marked as
                 * > participating (and possibly also as contributing), all
                 * > referenced entries of the hierarchical group that are not
                 * > compound entries shall be selected, otherwise they shall be
                 * > excluded.
                 */
                if (searchState.effectiveHierarchySelections && rootResultIsAncestor && target.dse.hierarchy) {
                    await hierarchySelectionProcedure(
                        ctx,
                        assn,
                        target,
                        [[rootResult[0].dse.id, rootEntryInfo]],
                        data,
                        searchState,
                        searchState.effectiveHierarchySelections,
                        timeLimitEndTime,
                        separateFamilyMembers,
                    );
                } else {
                    if (
                        !searchState.excludedById.has(rootResult[0].dse.id)
                        && !searchState.paging?.[1].alreadyReturnedById.has(rootResult[0].dse.id)
                    ) {
                        searchState.results.push(rootEntryInfo);
                    }
                    searchState.excludedById.add(rootResult[0].dse.id);
                    searchState.paging?.[1].alreadyReturnedById.add(rootResult[0].dse.id);
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
        );
        state.SRcontinuationList.push(cr);
    }

    const entriesPerSubordinatesPage: number = (
        !entryOnly
        && (data.subset === SearchArgumentData_subset_oneLevel)
        && isMatchAllFilter(searchState.effectiveFilter)
    )
        ? Math.min(searchState.effectiveEntryLimit, ctx.config.entriesPerSubordinatesPage * 10)
        : ctx.config.entriesPerSubordinatesPage;

    const getNextBatchOfSubordinates = async (): Promise<Vertex[]> => {
        if ( // If we are using Meerkat DSA's deviation for searches...
            !ctx.config.principledServiceAdministration
            && (searchState.depth > 0) // ...and we are beneath the baseObject...
            && !subentries // ...and we are not searching for subentries only...
            && ( // ...and we are in a new service admin area...
                ( /* Which can happen if the search was already within a service
                    admin area and it is now in a new one...  */
                    searchState.governingSearchRule // (search was already within admin area)
                    && ( // (search is in a new area)
                        target.dse.admPoint?.administrativeRole.has(ID_AR_SERVICE)
                        || target.dse.admPoint?.administrativeRole.has(ID_AUTONOMOUS)
                    )
                )
                /* Or if the search was _not_ within a service admin area to
                begin with, and we have now encountered a service admin point. */
                || (
                    !searchState.governingSearchRule
                    && target.dse.admPoint?.administrativeRole.has(ID_AR_SERVICE)
                )
            )
        ) { // ...return no subordinates.
            return [];
        }
        return readSubordinates(
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
            entriesPerSubordinatesPage,
            undefined,
            cursorId,
            {
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
                // This stops recursion into different service administrative areas.
                AttributeValue: ctx.config.principledServiceAdministration
                    ? {
                        none: {
                            type_oid: administrativeRole["&id"].toBytes(),
                            content_octets: searchState.governingSearchRule
                                ? {
                                    in: [
                                        id_ar_autonomousArea.toBytes(),
                                        id_ar_serviceSpecificArea.toBytes(),
                                    ],
                                }
                                : id_ar_serviceSpecificArea.toBytes(),
                        },
                    }
                    : undefined,
                /**
                 * You can only use the pre-filtering optimization for oneLevel
                 * searches, because, if using subtree searches, you still have to
                 * recurse into the subordinates of results that don't match; that
                 * is not the case with oneLevel searches because there is no
                 * recursion.
                 *
                 * This also goes in an `AND` so that it does not overwrite the
                 * `EntryObjectClass` that comes earlier.
                 *
                 * For this to work, familyGrouping must also be entryOnly (the
                 * default), because this will not recurse into the child entries to
                 * check for matching values.
                 */
                AND: (
                    searchState.effectiveFilter
                    && (searchState.effectiveSubset === SearchArgumentData_subset_oneLevel)
                    && (familyGrouping === FamilyGrouping_entryOnly)
                )
                    ? convertFilterToPrismaSelect(
                        ctx,
                        searchState.effectiveFilter,
                        relevantSubentries,
                        !dontSelectFriends,
                        searchState.matching_rule_substitutions,
                        filterOptions["requestAttributes"],
                    )
                    : undefined,

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
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            abandoned["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
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
                /**
                 * What follows is a DEVIATION from the specification.
                 * ITU Recommendation X.518 does NOT say anything about checking
                 * access controls on a subr DSE. The name of the subr DSE may
                 * be returned in a search result's POQ.unexplored as a
                 * continuation reference, regardless of authorization to
                 * discover it!
                 */
                const adminPoints: Vertex[] = (subordinate.dse.admPoint
                    ? [ ...state.admPoints, subordinate ]
                    : [ ...state.admPoints ])
                // Array.reverse() works in-place, so we create a new array.
                const subAccessControlScheme = [ ...adminPoints ].reverse()
                    .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
                if ( // If an access control scheme is defined, and...
                    subAccessControlScheme
                    && ( // ...if there are any attributes that suggest that this DSE is subject to access control...
                        !!(await ctx.db.attributeValue.findFirst(({
                            where: {
                                entry_id: subordinate.dse.id,
                                type_oid: {
                                    in: [
                                        entryACI["&id"].toBytes(),
                                        subentryACI["&id"].toBytes(),
                                        prescriptiveACI["&id"].toBytes(),
                                    ],
                                },
                            },
                            select: { id: true },
                        })))
                        // Rule-based access control is not supported yet, so if
                        // this next line were enabled, it would simply make the
                        // subr DSE unavailable to all users.
                        // || subordinate.dse.clearances?.length
                    )
                ) {
                    const relevantSubentries: Vertex[] = (await Promise.all(
                        adminPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
                    )).flat();
                    const targetACI = await getACIItems(
                        ctx,
                        subAccessControlScheme,
                        target,
                        subordinate,
                        relevantSubentries,
                        Boolean(subordinate.dse.subentry),
                    );
                    const acdfTuples: ACDFTuple[] = (targetACI ?? [])
                        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
                    const isMemberOfGroup = getIsGroupMember(ctx, NAMING_MATCHER);
                    const relevantTuples: ACDFTupleExtended[] = await preprocessTuples(
                        subAccessControlScheme,
                        acdfTuples,
                        user,
                        state.chainingArguments.authenticationLevel ?? UNTRUSTED_REQ_AUTH_LEVEL,
                        [ ...targetDN, subordinate.dse.rdn ],
                        isMemberOfGroup,
                        NAMING_MATCHER,
                    );
                    const { authorized: authorizedToDiscoverSubordinate } = bacACDF(
                        relevantTuples,
                        user,
                        {
                            entry: Array.from(subordinate.dse.objectClass).map(ObjectIdentifier.fromString),
                        },
                        [
                            PERMISSION_CATEGORY_BROWSE,
                            PERMISSION_CATEGORY_RETURN_DN,
                        ],
                        bacSettings,
                        true,
                    );
                    if (!authorizedToDiscoverSubordinate) {
                        continue;
                    }
                }

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
            await search_i_ex(
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
