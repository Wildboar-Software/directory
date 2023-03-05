import { Context, Vertex, ServiceError, ClientAssociation, AttributeError, IndexableOID } from "@wildboar/meerkat-types";
import type { OperationDispatcherState } from "./OperationDispatcher";
import { ACDFTupleExtended, ACDFTuple, getACDFTuplesFromACIItem, bacACDF } from "@wildboar/x500";
import {
    serviceAdminSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/serviceAdminSubentry.oa";
import {
    OperationProgress_nameResolutionPhase_completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import {
    AttributeCombination,
    RequestAttribute,
    SearchRule,
} from "@wildboar/x500/src/lib/modules/ServiceAdministration/SearchRule.ta";
import { SearchArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import { compareElements } from "@wildboar/x500";
import {
    ASN1Element,
    BERElement,
    BIT_STRING,
    ObjectIdentifier,
    OBJECT_IDENTIFIER,
    TRUE_BIT,
} from "asn1-ts";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_requestedServiceNotAvailable,
    ServiceProblem_unwillingToPerform,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import createSecurityParameters from "../x500/createSecurityParameters";
import printInvokeId from "../utils/printInvokeId";
import {
    searchServiceProblem,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/searchServiceProblem.oa";
import {
    serviceType,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/serviceType.oa";
import {
    id_pr_unidentifiedOperation,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-unidentifiedOperation.va";
import {
    id_pr_unavailableOperation,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-unavailableOperation.va";
import {
    id_pr_missingSearchContext,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-missingSearchContext.va";
import {
    id_pr_missingSearchAttribute,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-missingSearchAttribute.va";
import {
    id_pr_hierarchySelectForbidden,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-hierarchySelectForbidden.va";
import {
    id_pr_invalidSearchValue,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-invalidSearchValue.va";
import {
    id_pr_invalidServiceControlOptions,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-invalidServiceControlOptions.va";
// import {
//     id_pr_attributeMatchingViolation,
// } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-attributeMatchingViolation.va";
// import {
//     id_pr_invalidContextSearchValue,
// } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-invalidContextSearchValue.va";
// import {
//     id_pr_matchingUseViolation,
// } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-matchingUseViolation.va";
// import {
//     id_pr_relaxationNotSupported,
// } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-relaxationNotSupported.va";
import {
    id_pr_searchValueRequired,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-searchValueRequired.va";
import {
    id_pr_searchContextValueViolation,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-searchContextValueViolation.va";
import {
    id_pr_invalidSearchControlOptions,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-invalidSearchControlOptions.va";
import {
    id_pr_invalidHierarchySelect,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-invalidHierarchySelect.va";
import {
    id_pr_unavailableHierarchySelect,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-unavailableHierarchySelect.va";
import {
    id_pr_searchContextViolation,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-searchContextViolation.va";
import {
    id_pr_searchValueNotAllowed,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-searchValueNotAllowed.va";
import {
    id_pr_searchAttributeViolation,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-searchAttributeViolation.va";
import {
    id_pr_attributeNegationViolation,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-attributeNegationViolation.va";
import {
    id_pr_searchContextCombinationViolation,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-searchContextCombinationViolation.va";
import {
    id_pr_searchAttributeCombinationViolation,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-searchAttributeCombinationViolation.va";
import { DER } from "asn1-ts/dist/node/functional";
import {
    AttributeErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import {
    AttributeProblem_inappropriateMatching,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import {
    attributeError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/attributeError.oa";
import getDistinguishedName from "../x500/getDistinguishedName";
import {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import { AttributeErrorData_problems_Item } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData-problems-Item.ta";
import type { Filter } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Filter.ta";
import type { FilterItem } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FilterItem.ta";
import { ContextProfile } from "@wildboar/x500/src/lib/modules/ServiceAdministration/ContextProfile.ta";
import { ContextAssertion } from "@wildboar/x500/src/lib/modules/InformationFramework/ContextAssertion.ta";
import { ContextCombination } from "@wildboar/x500/src/lib/modules/ServiceAdministration/ContextCombination.ta";
import getEqualityMatcherGetter from "../x500/getEqualityMatcherGetter";
import {
    HierarchySelections,
    HierarchySelections_all,
    HierarchySelections_children,
    HierarchySelections_hierarchy,
    HierarchySelections_parent,
    HierarchySelections_siblingChildren,
    HierarchySelections_siblingSubtree,
    HierarchySelections_siblings,
    HierarchySelections_subtree,
    HierarchySelections_top,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/HierarchySelections.ta";
import {
    SearchControlOptions,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchControlOptions.ta";
import {
    ServiceControlOptions,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    attributeTypeList,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/attributeTypeList.oa";
import {
    contextTypeList,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/contextTypeList.oa";
import {
    attributeCombinations,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/attributeCombinations.oa";
import {
    contextCombinations,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/contextCombinations.oa";
import {
    contextList,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/contextList.oa";
import {
    filterItem,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/filterItem.oa";
import {
    hierarchySelectList,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/hierarchySelectList.oa";
import {
    searchControlOptionsList,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/searchControlOptionsList.oa";
import {
    serviceControlOptionsList,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/serviceControlOptionsList.oa";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import { searchRules } from "@wildboar/x500/src/lib/collections/attributes";
import { attributeValueFromDB } from "../database/attributeValueFromDB";
import { _decode_SearchRuleDescription } from "@wildboar/x500/src/lib/modules/InformationFramework/SearchRuleDescription.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import getAdministrativePoints from "../dit/getAdministrativePoints";
import { ID_AC_SPECIFIC, ID_AUTONOMOUS } from "../../oidstr";
import getACIItems from "../authz/getACIItems";
import getIsGroupMember from "../authz/getIsGroupMember";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import preprocessTuples from "../authz/preprocessTuples";
import { UNTRUSTED_REQ_AUTH_LEVEL } from "../constants";
import { PERMISSION_CATEGORY_INVOKE } from "@wildboar/x500/src/lib/bac/bacACDF";
import { bacSettings } from "../authz/bacSettings";
import { AttributeTypeAndValue } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AttributeTypeAndValue.ta";
import { getServiceAdminPoint } from "../dit/getServiceAdminPoint";
import {
    ControlOptions,
} from "@wildboar/x500/src/lib/modules/ServiceAdministration/ControlOptions.ta";
import accessControlSchemesThatUseACIItems from "../authz/accessControlSchemesThatUseACIItems";

const SEARCH_RULE_BYTES: Buffer = searchRules["&id"].toBytes();

export
function getAttributeTypeNegationFromFilterItem (
    item: FilterItem,
    non_negated: boolean,
    ret: Map<IndexableOID, boolean>,
): void {
    let type_oid: OBJECT_IDENTIFIER | undefined;
    if ("equality" in item) {
        type_oid = item.equality.type_;
    }
    else if ("substrings" in item) {
        type_oid = item.substrings.type_;
    }
    else if ("greaterOrEqual" in item) {
        type_oid = item.greaterOrEqual.type_;
    }
    else if ("lessOrEqual" in item) {
        type_oid = item.lessOrEqual.type_;
    }
    else if ("present" in item) {
        type_oid = item.present;
    }
    else if ("approximateMatch" in item) {
        type_oid = item.approximateMatch.type_;
    }
    else if ("extensibleMatch" in item) {
        type_oid = item.extensibleMatch.type_;
    }
    else if ("contextPresent" in item) {
        type_oid = item.contextPresent.type_;
    }
    if (!type_oid) {
        return;
    }
    const key = type_oid.toString();
    const current_non_negated = ret.get(key);
    // These next two lines can only upgrade from undefined -> true or
    // false -> true for a given type.
    if (current_non_negated === undefined) {
        ret.set(key, non_negated);
    }
    else if (current_non_negated === false) {
        ret.set(key, non_negated);
    }
}

/**
 * @summary Gets each attribute type from a filter and whether it was only negated
 * @description
 *
 * This function populates a mapping of string-form attribute type object
 * identifiers (e.g. `2.5.4.3`) to a boolean indicating whether the given
 * attribute type was _ever_ present in the filter in a non-negated filter item.
 *
 * @param filter
 * @param non_negated
 * @param ret
 */
export
function getAttributeTypeNegationFromFilter (
    filter: Filter,
    non_negated: boolean,
    ret: Map<IndexableOID, boolean>,
): void {
    if ("item" in filter) {
        getAttributeTypeNegationFromFilterItem(filter.item, non_negated, ret);
    } else if ("and" in filter) {
        for (const sub of filter.and) {
            getAttributeTypeNegationFromFilter(sub, non_negated, ret);
        }
    } else if ("or" in filter) {
        for (const sub of filter.or) {
            getAttributeTypeNegationFromFilter(sub, non_negated, ret);
        }
    } else if ("not" in filter) {
        getAttributeTypeNegationFromFilter(filter.not, !non_negated, ret);
    }
}

export
function getRequiredAttributesFromAttributeCombination (
    combo: AttributeCombination,
    non_negated: boolean,
    ret: Set<IndexableOID>,
): void {
    if ("attribute" in combo) {
        ret.add(combo.attribute.toString());
    } else if ("and" in combo) {
        // Required attributes are any required by any subfilter.
        for (const sub of combo.and) {
            getRequiredAttributesFromAttributeCombination(sub, non_negated, ret);
        }
    } else if ("or" in combo) {
        // Required attributes are those that are required by all subfilters.
        const subrets: Set<IndexableOID>[] = [];
        for (const sub of combo.or) {
            const subret: Set<IndexableOID> = new Set();
            getRequiredAttributesFromAttributeCombination(sub, non_negated, subret);
            subrets.push(subret);
        }
        if (subrets.length === 0) {
            return;
        }
        const first = subrets[0];
        for (const attr of first.values()) {
            for (const subret of subrets.slice(1)) {
                if (!subret.has(attr)) {
                    first.delete(attr);
                    break;
                }
            }
        }
        // These are the attributes that were required by every subfilter.
        for (const attr of first.values()) {
            ret.add(attr);
        }
    } else if ("not" in combo) {
        getRequiredAttributesFromAttributeCombination(combo.not, !non_negated, ret);
    }
}

export
function checkAttributeCombination (
    filter: Filter,
    combo: AttributeCombination,
    non_negated: boolean,
    violations: AttributeCombination[],
): void {
    if (("item" in filter) && ("attribute" in combo)) {
        const item = filter.item;
        let type_oid: OBJECT_IDENTIFIER | undefined;
        if ("equality" in item) {
            type_oid = item.equality.type_;
        }
        else if ("substrings" in item) {
            type_oid = item.substrings.type_;
        }
        else if ("greaterOrEqual" in item) {
            type_oid = item.greaterOrEqual.type_;
        }
        else if ("lessOrEqual" in item) {
            type_oid = item.lessOrEqual.type_;
        }
        else if ("present" in item) {
            type_oid = item.present;
        }
        else if ("approximateMatch" in item) {
            type_oid = item.approximateMatch.type_;
        }
        else if ("extensibleMatch" in item) {
            type_oid = item.extensibleMatch.type_;
        }
        else if ("contextPresent" in item) {
            type_oid = item.contextPresent.type_;
        }
        if (!type_oid || !type_oid.isEqualTo(combo.attribute)) {
            violations.push(combo);
            return;
        }
    } else if (("and" in filter) && ("and" in combo)) {
        if (filter.and.length !== combo.and.length) {
            violations.push(combo);
            return;
        }
        /* TODO:
            Yes this is an O^2 comparison, but its max size is constrained
            by the search filter, which the administrators control. In the long
            run, maybe you can create an algorithm to pre-sort filters and
            combinations, which should solve this.
        */
        for (const subcombo of combo.and) {
            let matched: boolean = false;
            for (const subfilter of filter.and) {
                const subviolations: AttributeCombination[] = [];
                checkAttributeCombination(subfilter, subcombo, non_negated, subviolations);
                if (subviolations.length === 0) {
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                violations.push(combo);
                return;
            }
        }
    } else if (("or" in filter) && ("or" in combo)) {
        if (filter.or.length !== combo.or.length) {
            violations.push(combo);
            return;
        }
        /* TODO:
            Yes this is an O^2 comparison, but its max size is constrained
            by the search filter, which the administrators control. In the long
            run, maybe you can create an algorithm to pre-sort filters and
            combinations, which should solve this.
        */
        for (const subcombo of combo.or) {
            let matched: boolean = false;
            for (const subfilter of filter.or) {
                const subviolations: AttributeCombination[] = [];
                checkAttributeCombination(subfilter, subcombo, non_negated, subviolations);
                if (subviolations.length === 0) {
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                violations.push(combo);
                return;
            }
        }
    } else if (("not" in filter) && ("not" in combo)) {
        checkAttributeCombination(filter.not, combo.not, !non_negated, violations);
    } else {
        violations.push(combo);
    }
}

function check_for_disallowed_search_values (
    filter: Filter,
    disallowed: Map<IndexableOID, boolean>,
    violations: FilterItem[],
): void {
    if ("item" in filter) {
        const item = filter.item;
        let type_oid: OBJECT_IDENTIFIER | undefined;
        if ("equality" in item) {
            type_oid = item.equality.type_;
        }
        else if ("substrings" in item) {
            type_oid = item.substrings.type_;
        }
        else if ("greaterOrEqual" in item) {
            type_oid = item.greaterOrEqual.type_;
        }
        else if ("lessOrEqual" in item) {
            type_oid = item.lessOrEqual.type_;
        }
        else if ("present" in item) {
            type_oid = item.present;
        }
        else if ("approximateMatch" in item) {
            type_oid = item.approximateMatch.type_;
        }
        else if ("extensibleMatch" in item) {
            type_oid = item.extensibleMatch.type_;
        }
        else if ("contextPresent" in item) {
            type_oid = item.contextPresent.type_;
        }
        if (!type_oid) {
            return;
        }
        const contexts: boolean | undefined = disallowed.get(type_oid.toString());
        if (contexts === undefined) {
            // If no contexts, we can use whatever filter item we want.
            return;
        }
        if (contexts && !("contextPresent" in item)) {
            violations.push(item);
        } else if (!contexts && !("present" in item)) {
            violations.push(item);
        }
    }
    else if ("and" in filter) {
        for (const sub of filter.and) {
            check_for_disallowed_search_values(sub, disallowed, violations);
        }
    }
    else if ("or" in filter) {
        for (const sub of filter.or) {
            check_for_disallowed_search_values(sub, disallowed, violations);
        }
    }
    else if ("not" in filter) {
        check_for_disallowed_search_values(filter.not, disallowed, violations);
    }
}

function check_for_disallowed_contexts (
    ctx: Context,
    filter: Filter,
    profiles: Map<IndexableOID, Map<IndexableOID, ContextProfile>>,
    violating_context_types: Set<IndexableOID>,
): void {
    if ("item" in filter) {
        let type_oid: OBJECT_IDENTIFIER | undefined;
        let asserted_contexts: ContextAssertion[] | undefined;
        const item = filter.item;
        if ("equality" in item) {
            type_oid = item.equality.type_;
            if (item.equality.assertedContexts && ("selectedContexts" in item.equality.assertedContexts)) {
                asserted_contexts = item.equality.assertedContexts.selectedContexts;
            }
        }
        else if ("substrings" in item) {
            type_oid = item.substrings.type_;
        }
        else if ("greaterOrEqual" in item) {
            type_oid = item.greaterOrEqual.type_;
            if (item.greaterOrEqual.assertedContexts && ("selectedContexts" in item.greaterOrEqual.assertedContexts)) {
                asserted_contexts = item.greaterOrEqual.assertedContexts.selectedContexts;
            }
        }
        else if ("lessOrEqual" in item) {
            type_oid = item.lessOrEqual.type_;
            if (item.lessOrEqual.assertedContexts && ("selectedContexts" in item.lessOrEqual.assertedContexts)) {
                asserted_contexts = item.lessOrEqual.assertedContexts.selectedContexts;
            }
        }
        else if ("present" in item) {
            type_oid = item.present;
        }
        else if ("approximateMatch" in item) {
            type_oid = item.approximateMatch.type_;
            if (
                item.approximateMatch.assertedContexts
                && ("selectedContexts" in item.approximateMatch.assertedContexts)
            ) {
                asserted_contexts = item.approximateMatch.assertedContexts.selectedContexts;
            }
        }
        else if ("extensibleMatch" in item) {
            type_oid = item.extensibleMatch.type_;
        }
        else if ("contextPresent" in item) {
            type_oid = item.contextPresent.type_;
        }
        if (!type_oid) {
            return;
        }

        const applicable_profiles = profiles.get(type_oid.toString());
         // If there are no context profiles for this type, we don't need to check anything.
        if (!applicable_profiles) {
            return;
        }
        for (const asserted of asserted_contexts ?? []) {
            const context_type = asserted.contextType.toString();
            const profile = applicable_profiles.get(context_type);
            if (!profile) { // If no profile, this context is not explicitly allowed.
                violating_context_types.add(context_type);
                continue;
            }
            if (profile.contextValue) {
                const matcher = ctx.contextTypes.get(context_type)?.matcher ?? compareElements;
                for (const asserted_value of asserted.contextValues) {
                    let matched: boolean = false;
                    for (const allowed_value of profile.contextValue) {
                        // FIXME: This matcher has the wrong type. It compares an assertion and value, rather than
                        // two assertions.
                        if (matcher(asserted_value, allowed_value)) {
                            matched = true;
                            break;
                        }
                    }
                    if (!matched) {
                        violating_context_types.add(context_type);
                        return;
                    }
                }
            }
        }
    }
    else if ("and" in filter) {
        for (const sub of filter.and) {
            check_for_disallowed_contexts(ctx, sub, profiles, violating_context_types);
        }
    }
    else if ("or" in filter) {
        for (const sub of filter.or) {
            check_for_disallowed_contexts(ctx, sub, profiles, violating_context_types);
        }
    }
    else if ("not" in filter) {
        check_for_disallowed_contexts(ctx, filter.not, profiles, violating_context_types);
    }
}

function is_empty_search_rule (sr: SearchRule): boolean {
    return ((sr.id === 0) && !sr.serviceType);
}

interface SearchRuleGeneralCheckState {
    // TODO: Make more of these sets instead of arrays.
    searchAttributeViolations: OBJECT_IDENTIFIER[],
    attributeNegationViolations: OBJECT_IDENTIFIER[],
    missingSearchAttributes: OBJECT_IDENTIFIER[],
    searchAttributeCombinationViolations: AttributeCombination[],
    searchValuesDisallowed: FilterItem[],
    searchContextViolations: Set<IndexableOID>,
}

// Described in X.511, Section 15.1
function general_check_of_search_filter (
    ctx: Context,
    search: SearchArgumentData,
    rule: SearchRule,
): [number, SearchRuleGeneralCheckState] {
    const state: SearchRuleGeneralCheckState = {
        searchAttributeViolations: [],
        attributeNegationViolations: [],
        missingSearchAttributes: [],
        searchAttributeCombinationViolations: [],
        searchValuesDisallowed: [],
        searchContextViolations: new Set(),
    };
    // This behavior is specified in X.501, Section 16.10.2.
    if (!rule.inputAttributeTypes) { // TODO: Is this correct?
        return [0, state];
    }
    const filter = search.extendedFilter ?? search.filter;
    // TODO: You might have to normalize the filter.

    // This behavior is specified in X.501, Section 16.10.2.
    if (
        (rule.inputAttributeTypes.length === 0)
        && (
            filter
            && (
                !("and" in filter)
                || (filter.and.length !== 0)
            )
        )
    ) {
        return [0, state];
    }
    const permitted_attrs: Map<IndexableOID, RequestAttribute> = new Map();
    for (const attr of rule.inputAttributeTypes) {
        permitted_attrs.set(attr.attributeType.toString(), attr);
    }
    const non_negated: Map<IndexableOID, boolean> = new Map();
    getAttributeTypeNegationFromFilter(filter ?? { and: [] }, true, non_negated);

    const required_attrs: Set<IndexableOID> = new Set();
    if (rule.attributeCombination) {
        getRequiredAttributesFromAttributeCombination(rule.attributeCombination, true, required_attrs);
    }

    for (const [attr, is_non_neg] of non_negated.entries()) {
        const is_permitted = permitted_attrs.get(attr);
        if (!is_permitted) {
            state.searchAttributeViolations.push(ObjectIdentifier.fromString(attr));
        }
        /* WARNING: The specification is not clear as to whether this is true
        for all attributes at all, or just those present in the input attrs. */
        if (!is_non_neg) {
            state.attributeNegationViolations.push(ObjectIdentifier.fromString(attr));
        }
        required_attrs.delete(attr);
    }

    if (rule.attributeCombination) {
        state.missingSearchAttributes.push(...Array
            .from(required_attrs.values())
            .map((s) => ObjectIdentifier.fromString(s)));

        if (filter) {
            checkAttributeCombination(
                filter,
                rule.attributeCombination,
                true,
                state.searchAttributeCombinationViolations,
            );
        }
    }

    const zero_select_values_attrs: Map<IndexableOID, boolean> = new Map();
    for (const attr of rule.inputAttributeTypes ?? []) {
        if (attr.selectedValues && (attr.selectedValues.length === 0)) {
            zero_select_values_attrs.set(attr.attributeType.toString(), !!attr.contexts);
        }
    }
    if (filter && zero_select_values_attrs.size > 0) {
        check_for_disallowed_search_values(filter, zero_select_values_attrs, state.searchValuesDisallowed);
    }

    const attrs_with_contexts: Map<IndexableOID, Map<IndexableOID, ContextProfile>> = new Map();
    for (const attr of rule.inputAttributeTypes ?? []) {
        if (attr.contexts) {
            const context_map: Map<IndexableOID, ContextProfile> = new Map();
            for (const context of attr.contexts) {
                context_map.set(context.contextType.toString(), context);
            }
            attrs_with_contexts.set(attr.attributeType.toString(), context_map);
        }
    }

    if (filter && attrs_with_contexts.size > 0) {
        check_for_disallowed_contexts(ctx, filter, attrs_with_contexts, state.searchContextViolations);
    }

    if (state.searchAttributeViolations.length > 0) {
        return [1, state]; // id-pr-searchAttributeViolation & serviceType & attributeTypeList
    }
    if (state.attributeNegationViolations.length > 0) {
        return [2, state]; // id-pr-attributeNegationViolation & serviceType & attributeTypeList
    }
    if (state.missingSearchAttributes.length > 0) {
        return [3, state]; // id-pr-missingSearchAttribute & serviceType & attributeTypeList
    }
    if (state.searchAttributeCombinationViolations.length > 0) {
        return [4, state]; // id-pr-searchAttributeCombinationViolation & serviceType & attributeCombinations
    }
    if (state.searchValuesDisallowed.length > 0) {
        return [4, state]; // id-pr-searchValueNotAllowed & serviceType & filterItem
    }
    if (state.searchContextViolations.size > 0) {
        return [5, state]; // id-pr-searchContextViolation & serviceType & contextTypeList
    }

    if (rule.allowedSubset) {
        const subset = search.subset ?? SearchArgumentData._default_value_for_subset;
        if (rule.allowedSubset[Number(subset)] !== TRUE_BIT) {
            return [6, state]; // id-pr-searchSubsetViolation & serviceType
        }
    }

    return [0, state];
}

export
function getRequiredContextsFromContextCombination (
    combo: ContextCombination,
    non_negated: boolean,
    ret: Set<IndexableOID>,
): void {
    if ("context" in combo) {
        ret.add(combo.context.toString());
    } else if ("and" in combo) {
        // Required attributes are any required by any subfilter.
        for (const sub of combo.and) {
            getRequiredContextsFromContextCombination(sub, non_negated, ret);
        }
    } else if ("or" in combo) {
        // Required attributes are those that are required by all subfilters.
        const subrets: Set<IndexableOID>[] = [];
        for (const sub of combo.or) {
            const subret: Set<IndexableOID> = new Set();
            getRequiredContextsFromContextCombination(sub, non_negated, subret);
            subrets.push(subret);
        }
        if (subrets.length === 0) {
            return;
        }
        const first = subrets[0];
        for (const attr of first.values()) {
            for (const subret of subrets.slice(1)) {
                if (!subret.has(attr)) {
                    first.delete(attr);
                    break;
                }
            }
        }
        // These are the attributes that were required by every subfilter.
        for (const attr of first.values()) {
            ret.add(attr);
        }
    } else if ("not" in combo) {
        getRequiredContextsFromContextCombination(combo.not, !non_negated, ret);
    }
}

export
function checkContextCombination (
    contexts: Map<IndexableOID, ContextAssertion>,
    combo: ContextCombination,
    violations: ContextCombination[],
): void {
    if ("context" in combo) {
        if (!contexts.has(combo.context.toString())) {
            violations.push(combo);
        }
    } else if ("and" in combo) {
        for (const sub of combo.and) {
            const subviolations: ContextCombination[] = [];
            checkContextCombination(contexts, sub, subviolations);
            if (subviolations.length !== 0) {
                violations.push(combo);
                return;
            }
        }
    } else if ("or" in combo) {
        for (const sub of combo.or) {
            const subviolations: ContextCombination[] = [];
            checkContextCombination(contexts, sub, subviolations);
            if (subviolations.length === 0) {
                return;
            }
        }
        violations.push(combo);
    } else if ("not" in combo) {
        const subviolations: ContextCombination[] = [];
        checkContextCombination(contexts, combo.not, subviolations);
        if (subviolations.length === 0) {
            violations.push(combo);
        }
    } else {
        violations.push(combo);
    }
}

function check_of_request_attribute_profile_in_filter (
    ctx: Context,
    state: CheckRequestAttributeState,
    filter: Filter,
    attr_profiles: Map<IndexableOID, RequestAttribute>,
): void {
    if ("item" in filter) {
        let type_oid: OBJECT_IDENTIFIER | undefined;
        let asserted_value: ASN1Element | undefined;
        let asserted_contexts: ContextAssertion[] | undefined;
        const item = filter.item;
        if ("equality" in item) {
            type_oid = item.equality.type_;
            asserted_value = item.equality.assertion;
            if (item.equality.assertedContexts && ("selectedContexts" in item.equality.assertedContexts)) {
                asserted_contexts = item.equality.assertedContexts.selectedContexts;
            }
        }
        else if ("substrings" in item) {
            type_oid = item.substrings.type_;
        }
        else if ("greaterOrEqual" in item) {
            type_oid = item.greaterOrEqual.type_;
            asserted_value = item.greaterOrEqual.assertion;
            if (item.greaterOrEqual.assertedContexts && ("selectedContexts" in item.greaterOrEqual.assertedContexts)) {
                asserted_contexts = item.greaterOrEqual.assertedContexts.selectedContexts;
            }
        }
        else if ("lessOrEqual" in item) {
            type_oid = item.lessOrEqual.type_;
            asserted_value = item.lessOrEqual.assertion;
            if (item.lessOrEqual.assertedContexts && ("selectedContexts" in item.lessOrEqual.assertedContexts)) {
                asserted_contexts = item.lessOrEqual.assertedContexts.selectedContexts;
            }
        }
        else if ("present" in item) {
            type_oid = item.present;
        }
        else if ("approximateMatch" in item) {
            type_oid = item.approximateMatch.type_;
            asserted_value = item.approximateMatch.assertion;
            if (
                item.approximateMatch.assertedContexts
                && ("selectedContexts" in item.approximateMatch.assertedContexts)
            ) {
                asserted_contexts = item.approximateMatch.assertedContexts.selectedContexts;
            }
        }
        else if ("extensibleMatch" in item) {
            type_oid = item.extensibleMatch.type_;
            asserted_value = item.extensibleMatch.matchValue;
        }
        else if ("contextPresent" in item) {
            type_oid = item.contextPresent.type_;
        }
        if (!type_oid) {
            return;
        }
        const profile = attr_profiles.get(type_oid.toString());
        if (!profile) {
            return;
        }
        // Step 1
        if (
            (!profile.selectedValues || (profile.selectedValues.length > 0))
            && (
                !("equality" in item)
                && !("substrings" in item)
                && !("approximateMatch" in item)
                && !("extensibleMatch" in item)
                // NOTE: This excludes other filter item types I think it should include...
            )
        ) {
            state.searchValuesRequired.push(type_oid);
        }
        // Step 2
        if (profile.selectedValues?.length && asserted_value) {
            let matched: boolean = false;
            const matcher = getEqualityMatcherGetter(ctx)(type_oid) ?? (() => true);
            for (const permitted_value of profile.selectedValues) {
                matched = matcher(permitted_value, asserted_value);
                if (matched) {
                    break;
                }
            }
            if (!matched) {
                state.invalidSearchValues.push(item);
            }
        }
        // Step 3 is a NOOP for our purposes.
        if (profile.contexts) {
            // This is specified in 16.10.2.
            if ((profile.contexts.length === 0) && asserted_contexts && (asserted_contexts.length > 0)) {
                state.serviceProblem = id_pr_searchContextViolation;
                state.searchContextViolationsAttr = type_oid;
                state.searchContextViolations.push(...asserted_contexts.map((ac) => ac.contextType));
                return;
            }
            // Step 4
            const asserted_context_set: Map<IndexableOID, ContextAssertion> = new Map();
            for (const context of asserted_contexts ?? []) {
                asserted_context_set.set(context.contextType.toString(), context);
            }
            if (profile.contextCombination) {

                // Check for required contexts
                const required_contexts: Set<IndexableOID> = new Set();
                getRequiredContextsFromContextCombination(
                    profile.contextCombination,
                    true,
                    required_contexts,
                );
                for (const mc of required_contexts.values()) {
                    if (!asserted_context_set.has(mc)) {
                        state.serviceProblem = id_pr_missingSearchContext;
                        state.searchContextViolationsAttr = type_oid;
                        state.searchContextViolations.push(ObjectIdentifier.fromString(mc));
                    }
                }
                if (state.serviceProblem) {
                    return;
                }

                // Check context combinations
                checkContextCombination(asserted_context_set, profile.contextCombination, state.contextComboViolations);
                if (state.contextComboViolations.length > 0) {
                    state.contextComboViolationAttr = type_oid;
                    state.serviceProblem = id_pr_searchContextCombinationViolation;
                    return;
                }
            }
            // Step 5
            const context_map: Map<IndexableOID, ContextProfile> = new Map();
            for (const context of profile.contexts) {
                context_map.set(context.contextType.toString(), context);
            }
            for (const asserted_context of asserted_contexts ?? []) {
                const key = asserted_context.contextType.toString();
                const profile = context_map.get(key);
                if (!profile) {
                    state.searchContextViolationsAttr = type_oid;
                    state.searchContextViolations.push(asserted_context.contextType); // TODO: Change to a set.
                } else if (profile.contextValue) {
                    // Step 6
                    const matcher = ctx.contextTypes.get(key)?.matcher ?? compareElements;
                    const non_matching_assertions: ASN1Element[] = [];
                    for (const context_value of asserted_context.contextValues) {
                        let matched: boolean = false;
                        for (const permitted_value of profile.contextValue) {
                            matched = matcher(permitted_value, context_value);
                            if (matched) {
                                break;
                            }
                        }
                        if (!matched) {
                            non_matching_assertions.push(context_value);
                            state.searchContextValueViolationAttr = type_oid;
                            state.searchContextValueViolations.push(new ContextAssertion(
                                asserted_context.contextType,
                                non_matching_assertions,
                            ));
                        }
                    }
                }
            }
        }
    } else if ("and" in filter) {
        for (const sub of filter.and) {
            check_of_request_attribute_profile_in_filter(ctx, state, sub, attr_profiles);
        }
    } else if ("or" in filter) {
        for (const sub of filter.or) {
            check_of_request_attribute_profile_in_filter(ctx, state, sub, attr_profiles);
        }
    } else if ("not" in filter) {
        check_of_request_attribute_profile_in_filter(ctx, state, filter.not, attr_profiles);
    }
}

interface CheckRequestAttributeState {
    serviceProblem?: OBJECT_IDENTIFIER,
    searchValuesRequired: AttributeType[], // FIXME: Change to a set
    invalidSearchValues: FilterItem[],
    missingSearchContextAttr?: AttributeType,
    missingSearchContexts: OBJECT_IDENTIFIER[], // FIXME: Change to a set
    contextComboViolationAttr?: AttributeType;
    contextComboViolations: ContextCombination[],
    searchContextViolationsAttr?: AttributeType,
    searchContextViolations: OBJECT_IDENTIFIER[],
    searchContextValueViolationAttr?: AttributeType,
    searchContextValueViolations: ContextAssertion[],
}

// Described in X.511, Section 15.2
function check_of_request_attribute_profiles (
    ctx: Context,
    search: SearchArgumentData,
    rule: SearchRule,
): [number, CheckRequestAttributeState] {
    const state: CheckRequestAttributeState = {
        searchValuesRequired: [],
        invalidSearchValues: [],
        missingSearchContexts: [],
        contextComboViolations: [],
        searchContextViolations: [],
        searchContextValueViolations: [],
    };
    const filter = search.extendedFilter ?? search.filter;
    if (!filter) {
        return [0, state];
    }
    const permitted_attrs: Map<IndexableOID, RequestAttribute> = new Map();
    for (const attr of rule.inputAttributeTypes ?? []) {
        permitted_attrs.set(attr.attributeType.toString(), attr);
    }
    check_of_request_attribute_profile_in_filter(ctx, state, filter, permitted_attrs);
    if (state.searchValuesRequired.length > 0) {
        return [1, state];
    }
    if (state.invalidSearchValues.length > 0) {
        return [2, state];
    }
    if (state.missingSearchContexts.length > 0) {
        return [4, state];
    }
    if (state.contextComboViolations.length > 0) {
        return [4, state];
    }
    if (state.searchContextViolations.length > 0) {
        return [5, state];
    }
    if (state.searchContextValueViolations.length > 0) {
        return [6, state];
    }
    return [0, state];
}

interface CheckControlsAndHSReturn {
    step_failed?: number;
    hierarchySelectList?: HierarchySelections;
    searchControlOptionsList?: SearchControlOptions;
    serviceControlOptionsList?: ServiceControlOptions;
}

function get_int32_from_bit_string (bs?: BIT_STRING): number {
    if (!bs) {
        return 0;
    }
    let ret: number = 0;
    const len: number = Math.min(bs.length, 32);
    for (let i = 0; i < len; i++) {
        if (bs[i] === TRUE_BIT) {
            ret |= (1 << (31 - i));
        }
    }
    return ret;
}

function get_bit_string_from_int32 (int: number): BIT_STRING {
    let last_set: number = -1;
    const ret: BIT_STRING = new Uint8ClampedArray(32);
    for (let i = 0; i < 32; i++) {
        if (int & (1 << (31 - i))) {
            ret[i] = TRUE_BIT;
            last_set = i;
        }
    }
    return ret.subarray(0, last_set + 1);
}

// NOTE: This is NOT a deviation from the spec.
const DEFAULT_HS: BIT_STRING = new Uint8ClampedArray([ TRUE_BIT ]); // Just self

// Described in X.511, Section 15.3
function check_of_controls_and_hierarchy_selections (
    search: SearchArgumentData,
    rule: SearchRule,
): CheckControlsAndHSReturn {
    if (!rule.defaultControls || !rule.defaultControls.hierarchyOptions) {
        const hs_other_than_self: boolean = !!search.hierarchySelections && (
            (search.hierarchySelections[HierarchySelections_all] === TRUE_BIT)
            || (search.hierarchySelections[HierarchySelections_children] === TRUE_BIT)
            || (search.hierarchySelections[HierarchySelections_hierarchy] === TRUE_BIT)
            || (search.hierarchySelections[HierarchySelections_parent] === TRUE_BIT)
            // || (search.hierarchySelections[HierarchySelections_self] === TRUE_BIT)
            || (search.hierarchySelections[HierarchySelections_siblingChildren] === TRUE_BIT)
            || (search.hierarchySelections[HierarchySelections_siblingSubtree] === TRUE_BIT)
            || (search.hierarchySelections[HierarchySelections_siblings] === TRUE_BIT)
            || (search.hierarchySelections[HierarchySelections_subtree] === TRUE_BIT)
            || (search.hierarchySelections[HierarchySelections_top] === TRUE_BIT)
        );
        if (hs_other_than_self) {
            return {
                step_failed: 1,
            };
        }
    }

    // Step 2
    if (rule.mandatoryControls?.hierarchyOptions) {
        const user_hs = get_int32_from_bit_string(search.hierarchySelections ?? rule.defaultControls?.hierarchyOptions ?? DEFAULT_HS);
        const mandatory_hs = get_int32_from_bit_string(rule.mandatoryControls.hierarchyOptions);
        const default_hs = get_int32_from_bit_string(rule.defaultControls?.hierarchyOptions ?? DEFAULT_HS);
        const non_default_bits = user_hs ^ default_hs;
        const non_compliant_bits = non_default_bits ^ mandatory_hs;
        if (non_compliant_bits !== 0) {
            return {
                step_failed: 2,
                hierarchySelectList: get_bit_string_from_int32(non_compliant_bits),
            };
        }
    }

    // Step 3 does not apply, because Meerkat DSA supports all hierarchy selections.

    // Step 4
    if (rule.mandatoryControls?.searchOptions) {
        const user_sco = get_int32_from_bit_string(search.searchControlOptions ?? rule.defaultControls?.searchOptions ?? ControlOptions._default_value_for_searchOptions);
        const mandatory_sco = get_int32_from_bit_string(rule.mandatoryControls.searchOptions);
        const default_sco = get_int32_from_bit_string(rule.defaultControls?.searchOptions ?? ControlOptions._default_value_for_searchOptions);
        const non_default_bits = user_sco ^ default_sco;
        const non_compliant_bits = non_default_bits ^ mandatory_sco;
        if (non_compliant_bits !== 0) {
            return {
                step_failed: 4,
                searchControlOptionsList: get_bit_string_from_int32(non_compliant_bits),
            };
        }
    }

    // Step 5
    if (rule.mandatoryControls?.serviceControls) {
        const user_sco = get_int32_from_bit_string(search.serviceControls?.options ?? rule.defaultControls?.serviceControls ?? ControlOptions._default_value_for_serviceControls);
        const mandatory_sco = get_int32_from_bit_string(rule.mandatoryControls.serviceControls);
        const default_sco = get_int32_from_bit_string(rule.defaultControls?.serviceControls ?? ControlOptions._default_value_for_serviceControls);
        const non_default_bits = user_sco ^ default_sco;
        const non_compliant_bits = non_default_bits ^ mandatory_sco;
        if (non_compliant_bits !== 0) {
            return {
                step_failed: 5,
                serviceControlOptionsList: get_bit_string_from_int32(non_compliant_bits),
            };
        }
    }

    return {};
}

interface CheckMatchingUseReturn {
    problem?: OBJECT_IDENTIFIER,
    violatingAttributes: AttributeType[];
}

// Described in X.511, Section 15.4
function check_of_matching_use (): CheckMatchingUseReturn {
    // DEVIATION: this is not checked, because it is checked during the actual search operation.
    return {
        violatingAttributes: [],
    };
}

export
interface SearchRuleCheckResult {
    clause_and_step_failed?: [ number, number ];
    notification: Attribute[];
}

export
function check_search_rule (
    ctx: Context,
    search: SearchArgumentData,
    rule: SearchRule,
): SearchRuleCheckResult {
    const state: SearchRuleCheckResult = {
        notification: [],
    };
    const [general_result_step, general_result_state] = general_check_of_search_filter(ctx, search, rule);
    if (general_result_step !== 0) {
        if (search.serviceControls?.serviceType) {
            state.notification.push(new Attribute(
                serviceType["&id"],
                [serviceType.encoderFor["&Type"]!(search.serviceControls.serviceType, DER)],
            ));
        }
        if (general_result_state.searchAttributeViolations.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_searchAttributeViolation, DER)],
            ));
            state.notification.push(new Attribute(
                attributeTypeList["&id"],
                general_result_state.searchAttributeViolations
                    .map((oid) => attributeTypeList.encoderFor["&Type"]!(oid, DER)),
            ));
        }
        if (general_result_state.attributeNegationViolations.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_attributeNegationViolation, DER)],
            ));
            state.notification.push(new Attribute(
                attributeTypeList["&id"],
                general_result_state.attributeNegationViolations
                    .map((oid) => attributeTypeList.encoderFor["&Type"]!(oid, DER)),
            ));
        }
        if (general_result_state.missingSearchAttributes.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_missingSearchAttribute, DER)],
            ));
            state.notification.push(new Attribute(
                attributeTypeList["&id"],
                general_result_state.missingSearchAttributes
                    .map((oid) => attributeTypeList.encoderFor["&Type"]!(oid, DER)),
            ));
        }
        if (general_result_state.searchAttributeCombinationViolations.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_searchAttributeCombinationViolation, DER)],
            ));
            state.notification.push(new Attribute(
                attributeCombinations["&id"],
                general_result_state.searchAttributeCombinationViolations
                    .map((combo) => attributeCombinations.encoderFor["&Type"]!(combo, DER)),
            ));
        }
        if (general_result_state.searchValuesDisallowed.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_searchValueNotAllowed, DER)],
            ));
            state.notification.push(new Attribute(
                filterItem["&id"],
                general_result_state.searchValuesDisallowed
                    .map((item) => filterItem.encoderFor["&Type"]!(item, DER)),
            ));
        }
        if (general_result_state.searchContextViolations.size > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_searchContextViolation, DER)],
            ));
            state.notification.push(new Attribute(
                contextTypeList["&id"],
                Array.from(general_result_state.searchContextViolations)
                    .map((ct) => contextTypeList.encoderFor["&Type"]!(ObjectIdentifier.fromString(ct), DER)),
            ));
        }
        state.clause_and_step_failed = [1, general_result_step];
        return state;
    }
    const [request_attrs_step, request_attrs_state] = check_of_request_attribute_profiles(ctx, search, rule);
    if (request_attrs_step !== 0) {
        if (search.serviceControls?.serviceType) {
            state.notification.push(new Attribute(
                serviceType["&id"],
                [serviceType.encoderFor["&Type"]!(search.serviceControls.serviceType, DER)],
            ));
        }
        if (request_attrs_state.searchValuesRequired.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_searchValueRequired, DER)],
            ));
            state.notification.push(new Attribute(
                attributeTypeList["&id"],
                request_attrs_state.searchValuesRequired
                    .map((oid) => attributeTypeList.encoderFor["&Type"]!(oid, DER)),
            ));
        }
        if (request_attrs_state.invalidSearchValues.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_invalidSearchValue, DER)],
            ));
            state.notification.push(new Attribute(
                attributeTypeList["&id"],
                request_attrs_state.invalidSearchValues
                    .map((item) => filterItem.encoderFor["&Type"]!(item, DER)),
            ));
        }
        if (request_attrs_state.missingSearchContexts.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_missingSearchContext, DER)],
            ));
            if (request_attrs_state.missingSearchContextAttr) {
                state.notification.push(new Attribute(
                    attributeTypeList["&id"],
                    [attributeTypeList.encoderFor["&Type"]!(request_attrs_state.missingSearchContextAttr, DER)],
                ));
            }
            state.notification.push(new Attribute(
                contextTypeList["&id"],
                request_attrs_state.missingSearchContexts
                    .map((oid) => contextTypeList.encoderFor["&Type"]!(oid, DER)),
            ));
        }
        if (request_attrs_state.contextComboViolations.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_searchContextCombinationViolation, DER)],
            ));
            if (request_attrs_state.contextComboViolationAttr) {
                state.notification.push(new Attribute(
                    attributeTypeList["&id"],
                    [attributeTypeList.encoderFor["&Type"]!(request_attrs_state.contextComboViolationAttr, DER)],
                ));
            }
            state.notification.push(new Attribute(
                contextCombinations["&id"],
                request_attrs_state.contextComboViolations
                    .map((combo) => contextCombinations.encoderFor["&Type"]!(combo, DER)),
            ));
        }
        if (request_attrs_state.searchContextViolations.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_searchContextViolation, DER)],
            ));
            if (request_attrs_state.searchContextViolationsAttr) {
                state.notification.push(new Attribute(
                    attributeTypeList["&id"],
                    [attributeTypeList.encoderFor["&Type"]!(request_attrs_state.searchContextViolationsAttr, DER)],
                ));
            }
            state.notification.push(new Attribute(
                contextTypeList["&id"],
                request_attrs_state.searchContextViolations
                    .map((oid) => contextTypeList.encoderFor["&Type"]!(oid, DER)),
            ));
        }
        if (request_attrs_state.searchContextValueViolations.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_searchContextValueViolation, DER)],
            ));
            if (request_attrs_state.searchContextValueViolationAttr) {
                state.notification.push(new Attribute(
                    attributeTypeList["&id"],
                    [attributeTypeList.encoderFor["&Type"]!(request_attrs_state.searchContextValueViolationAttr, DER)],
                ));
            }
            state.notification.push(new Attribute(
                contextList["&id"],
                request_attrs_state.searchContextValueViolations
                    .map((c) => contextList.encoderFor["&Type"]!(c, DER)),
            ));
        }
        state.clause_and_step_failed = [2, request_attrs_step];
        return state;
    }
    const controls_result = check_of_controls_and_hierarchy_selections(search, rule);
    if (controls_result.step_failed) {
        if (search.serviceControls?.serviceType) {
            state.notification.push(new Attribute(
                serviceType["&id"],
                [serviceType.encoderFor["&Type"]!(search.serviceControls.serviceType, DER)],
            ));
        }
        switch (controls_result.step_failed) {
            case (1): {
                state.notification.push(new Attribute(
                    searchServiceProblem["&id"],
                    [searchServiceProblem.encoderFor["&Type"]!(id_pr_hierarchySelectForbidden, DER)],
                ));
                break;
            }
            case (2): {
                state.notification.push(new Attribute(
                    searchServiceProblem["&id"],
                    [searchServiceProblem.encoderFor["&Type"]!(id_pr_invalidHierarchySelect, DER)],
                ));
                break;
            }
            case (3): {
                state.notification.push(new Attribute(
                    searchServiceProblem["&id"],
                    [searchServiceProblem.encoderFor["&Type"]!(id_pr_unavailableHierarchySelect, DER)],
                ));
                break;
            }
            case (4): {
                state.notification.push(new Attribute(
                    searchServiceProblem["&id"],
                    [searchServiceProblem.encoderFor["&Type"]!(id_pr_invalidSearchControlOptions, DER)],
                ));
                break;
            }
            case (5): {
                state.notification.push(new Attribute(
                    searchServiceProblem["&id"],
                    [searchServiceProblem.encoderFor["&Type"]!(id_pr_invalidServiceControlOptions, DER)],
                ));
                break;
            }
        }
        if (controls_result.hierarchySelectList) {
            state.notification.push(new Attribute(
                hierarchySelectList["&id"],
                [hierarchySelectList.encoderFor["&Type"]!(controls_result.hierarchySelectList, DER)],
            ));
        }
        if (controls_result.searchControlOptionsList) {
            state.notification.push(new Attribute(
                searchControlOptionsList["&id"],
                [searchControlOptionsList.encoderFor["&Type"]!(controls_result.searchControlOptionsList, DER)],
            ));
        }
        if (controls_result.serviceControlOptionsList) {
            state.notification.push(new Attribute(
                serviceControlOptionsList["&id"],
                [serviceControlOptionsList.encoderFor["&Type"]!(controls_result.serviceControlOptionsList, DER)],
            ));
        }
        state.clause_and_step_failed = [3, controls_result.step_failed];
        return state;
    }
    // TODO: Set effective controls.
    const matching_result = check_of_matching_use();
    if (matching_result.problem) {
        state.notification.push(new Attribute(
            searchServiceProblem["&id"],
            [searchServiceProblem.encoderFor["&Type"]!(matching_result.problem, DER)],
        ));
        if (search.serviceControls?.serviceType) {
            state.notification.push(new Attribute(
                serviceType["&id"],
                [serviceType.encoderFor["&Type"]!(search.serviceControls.serviceType, DER)],
            ));
        }
        if (matching_result.violatingAttributes) {
            state.notification.push(new Attribute(
                attributeTypeList["&id"],
                matching_result.violatingAttributes
                    .map((attr) => attributeTypeList.encoderFor["&Type"]!(attr, DER)),
            ));
        }
        state.clause_and_step_failed = [4, 1];
        return state;
    }
    return {
        notification: [],
    };
}

export
async function searchRuleCheckProcedure_i (
    ctx: Context,
    assn: ClientAssociation,
    state: OperationDispatcherState,
    target: Vertex,
    searchArg: SearchArgumentData,
    signErrors: boolean,
): Promise<SearchRule | undefined> {
    const searchRuleId = state.chainingArguments.searchRuleId;
    const service_admin_point = getServiceAdminPoint(target);
    if (!service_admin_point) {
        if (searchRuleId) {
            throw new ServiceError(
                ctx.i18n.t("err:search_escaped_svc_admin_area", { iid: printInvokeId(state.invokeId) }),
                new ServiceErrorData(
                    ServiceProblem_unwillingToPerform,
                    undefined,
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                ),
            );
        } else {
            return;
        }
    }

    // If the target DSE is within a service-specific administrative area and the
    // traceInformation reveals that the operation has been in a previous
    // evaluation phase, return with an unwillingToPerform service error.
    for (const trace_item of state.chainingArguments.traceInformation) {
        if (trace_item.operationProgress.nameResolutionPhase === OperationProgress_nameResolutionPhase_completed) {
            throw new ServiceError(
                ctx.i18n.t("err:search_escaped_svc_admin_area", { iid: printInvokeId(state.invokeId) }),
                new ServiceErrorData(
                    ServiceProblem_unwillingToPerform,
                    undefined,
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                ),
            );
        }
    }

    const data = searchArg;
    let candidate_search_rules: SearchRule[] = [];

    const targetDN = getDistinguishedName(target);
    const target_subentries: Vertex[] = await getRelevantSubentries(ctx, target, targetDN, service_admin_point);

    // #region Access Control

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

    const user = requestor
        ? new NameAndOptionalUID(
            requestor,
            state.chainingArguments.uniqueIdentifier,
        )
        : undefined;

    /**
     * We get admin points of the subentries' admin point, because prescriptive
     * ACI within the same admin area does not apply to the subentries, but
     * those in superior admin areas do.
     */
    const adm_points = (
        service_admin_point.dse.admPoint?.administrativeRole.has(ID_AC_SPECIFIC)
        || service_admin_point.dse.admPoint?.administrativeRole.has(ID_AUTONOMOUS)
    )
        ? [ service_admin_point ]
        : getAdministrativePoints(service_admin_point.immediateSuperior!);
    const accessControlScheme = [ ...adm_points ] // Array.reverse() works in-place, so we create a new array.
        .reverse()
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const namingMatcher = getNamingMatcherGetter(ctx);
    const isMemberOfGroup = getIsGroupMember(ctx, namingMatcher);

    const db_subentries = await ctx.db.entry.findMany({
        where: {
            id: {
                in: target_subentries.map((s) => s.dse.id),
            },
            EntryObjectClass: {
                some: {
                    object_class: serviceAdminSubentry["&id"].toString(),
                },
            },
        },
        select: {
            id: true,
            AttributeValue: {
                where: {
                    type_oid: SEARCH_RULE_BYTES,
                },
                select: {
                    type_oid: true,
                    tag_class: true,
                    constructed: true,
                    tag_number: true,
                    content_octets: true,
                },
            },
        },
    });

    let chainedSearchRule: SearchRule | undefined;
    const search_rules_by_subentry_id: Map<Vertex["dse"]["id"], [BERElement, SearchRule][]> = new Map();
    for (const db_sub of db_subentries) {
        const search_rules: [BERElement, SearchRule][] = [];
        for (const attr of db_sub.AttributeValue) {
            const value = attributeValueFromDB(attr);
            const search_rule = _decode_SearchRuleDescription(value);
            search_rules.push([value, search_rule]);
            if (
                !chainedSearchRule
                && searchRuleId
                && search_rule.id === searchRuleId.id
                && search_rule.dmdId.isEqualTo(searchRuleId.dmdId)
            ) {
                chainedSearchRule = search_rule;
            }
        }
        search_rules_by_subentry_id.set(db_sub.id, search_rules);
    }

    if (searchRuleId) {
        if (chainedSearchRule) {
            return chainedSearchRule;
        } else {
            throw new ServiceError(
                ctx.i18n.t("err:unrecognized_search_rule", {
                    uuid: target.dse.uuid,
                    dmd_id: searchRuleId.dmdId.toString(),
                    id: searchRuleId.id.toString(),
                }),
                new ServiceErrorData(
                    ServiceProblem_unwillingToPerform,
                    undefined,
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                ),
            );
        }
    }

    const DeniedSR: SearchRule[] = [];
    if (accessControlScheme && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())) {
        for (const subentry of target_subentries) {
            const subentryDN = getDistinguishedName(subentry);
            const relevantSubentries: Vertex[] = (await Promise.all(
                adm_points.map((ap) => getRelevantSubentries(ctx, subentry, subentryDN, ap)),
            )).flat();
            const relevantACIItems = await getACIItems(
                ctx,
                accessControlScheme,
                subentry.immediateSuperior,
                subentry,
                relevantSubentries,
                Boolean(target.dse.subentry),
            );
            const acdfTuples: ACDFTuple[] = (relevantACIItems ?? [])
                .flatMap((aci) => getACDFTuplesFromACIItem(aci));
            const relevantTuples: ACDFTupleExtended[] = await preprocessTuples(
                accessControlScheme,
                acdfTuples,
                user,
                state.chainingArguments.authenticationLevel
                    ?? assn?.authLevel
                    ?? UNTRUSTED_REQ_AUTH_LEVEL,
                subentryDN,
                isMemberOfGroup,
                namingMatcher,
            );
            const search_rules = search_rules_by_subentry_id.get(subentry.dse.id);
            if (!search_rules?.length) {
                continue;
            }
            const { authorized: authorizedToInvokeSearchRules } = bacACDF(
                relevantTuples,
                user,
                {
                    attributeType: searchRules["&id"],
                },
                [PERMISSION_CATEGORY_INVOKE],
                bacSettings,
                true,
            );
            if (!authorizedToInvokeSearchRules) {
                continue;
            }
            for (const [ undecoded, sr ] of search_rules) {
                const { authorized: authorizedToInvokeThisSearchRule } = bacACDF(
                    relevantTuples,
                    user,
                    {
                        value: new AttributeTypeAndValue(
                            searchRules["&id"],
                            undecoded,
                        ),
                        operational: true,
                    },
                    [PERMISSION_CATEGORY_INVOKE],
                    bacSettings,
                    true,
                );
                if (authorizedToInvokeThisSearchRule) {
                    candidate_search_rules.push(sr);
                } else {
                    DeniedSR.push(sr);
                }
            }
        }
    } else {
        for (const subentry of target_subentries) {
            const search_rules = search_rules_by_subentry_id.get(subentry.dse.id);
            if (!search_rules?.length) {
                continue;
            }
            for (const [ , sr ] of search_rules) {
                candidate_search_rules.push(sr);
            }
        }
    }


    // #endregion Access Control

    if (candidate_search_rules.length === 0) {
        throw new ServiceError(
            ctx.i18n.t("err:requestedServiceNotAvailable", { iid: printInvokeId(state.invokeId) }),
            new ServiceErrorData(
                ServiceProblem_requestedServiceNotAvailable,
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                [
                    new Attribute(
                        searchServiceProblem["&id"],
                        [searchServiceProblem.encoderFor["&Type"]!(id_pr_unidentifiedOperation, DER)],
                    ),
                ],
            ),
        );
    }

    if (data.serviceControls?.userClass !== undefined) {
        const uc: number = Number(data.serviceControls.userClass);
        candidate_search_rules = candidate_search_rules
            .filter((sr) => sr.userClass === uc);
    }
    if (data.serviceControls?.serviceType) {
        const st = data.serviceControls.serviceType;
        candidate_search_rules = candidate_search_rules
            .filter((sr) => sr.serviceType?.isEqualTo(st));
    }
    if (candidate_search_rules.length === 0) {
        const notification: Attribute[] = [
            new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_unidentifiedOperation, DER)],
            ),
        ];
        if (data.serviceControls?.serviceType) {
            notification.push(new Attribute(
                serviceType["&id"],
                [serviceType.encoderFor["&Type"]!(data.serviceControls.serviceType, DER)],
            ));
        }
        throw new ServiceError(
            ctx.i18n.t("err:requestedServiceNotAvailable", { iid: printInvokeId(state.invokeId) }),
            new ServiceErrorData(
                ServiceProblem_requestedServiceNotAvailable,
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                notification,
            ),
        );
    }

    let GoodPermittedSR: SearchRule[] = [];
    const MatchProblemSR: SearchRule[] = [];
    let BadPermittedSR: SearchRule[] = [];
    // NOTE: DeniedSR is populated earlier.

    const search_rule_evals: Map<SearchRule, SearchRuleCheckResult> = new Map();
    for (const rule of candidate_search_rules) {
        const result = check_search_rule(ctx, data, rule);
        search_rule_evals.set(rule, result);
        if (result.clause_and_step_failed) {
            const [ clause ] = result.clause_and_step_failed;
            if (clause === 4) {
                MatchProblemSR.push(rule);
            } else {
                BadPermittedSR.push(rule);
            }
        } else {
            GoodPermittedSR.push(rule);
        }
    }

    // Step 4.
    const empty_search_rule: SearchRule | undefined = candidate_search_rules.find(is_empty_search_rule);
    if (empty_search_rule) {
        return empty_search_rule; // This is the governing search rule.
    }

    // Step 5.
    if (GoodPermittedSR.length > 0) {
        let highest_user_class: number = 0;
        for (const sr of GoodPermittedSR) {
            // "This component shall always be present, except for the empty search rule."
            if (sr.userClass === undefined) {
                continue;
            }
            highest_user_class = Math.max(Number(sr.userClass), highest_user_class);
        }
        GoodPermittedSR = GoodPermittedSR
            .filter((sr) => (sr.userClass ?? 0) === highest_user_class);

        // Step 6.
        if (GoodPermittedSR.length > 1) {
            /* "If in the list above there are several search-rules to select
            from, the implementation should log the incident for administrative
            attention, as the search-rule definitions probably need re-working."
            */
            ctx.log.warn(ctx.i18n.t("log:multiple_search_rules_of_same_user_class", {
                user_class: highest_user_class,
            }));
        }
        return GoodPermittedSR[0];

    }

    // Step 7
    if (MatchProblemSR.length > 0) {
        const badMatchingAttrs: AttributeType[] = [];
        throw new AttributeError(
            ctx.i18n.t("err:invalid_matching_use", {
                attrs: badMatchingAttrs
                    .map((oid) => oid.toString())
                    .join(","),
            }),
            new AttributeErrorData(
                {
                    rdnSequence: getDistinguishedName(target),
                },
                badMatchingAttrs
                    .map((attr) => new AttributeErrorData_problems_Item(
                        AttributeProblem_inappropriateMatching,
                        attr,
                    )),
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        )
    }

    // Step 8
    if (DeniedSR.length > 0) {
        const compliant_non_empty_but_denied_rules: SearchRule[] = DeniedSR
            .filter((sr) => (
                !is_empty_search_rule(sr)
                && !check_search_rule(ctx, searchArg, sr).clause_and_step_failed
            ));
        if (compliant_non_empty_but_denied_rules.length > 0) {
            const notification: Attribute[] = [
                new Attribute(
                    searchServiceProblem["&id"],
                    [searchServiceProblem.encoderFor["&Type"]!(id_pr_unavailableOperation, DER)],
                ),
            ];
            if (data.serviceControls?.serviceType) {
                notification.push(new Attribute(
                    serviceType["&id"],
                    [serviceType.encoderFor["&Type"]!(data.serviceControls.serviceType, DER)],
                ));
            }
            throw new ServiceError(
                ctx.i18n.t("err:requestedServiceNotAvailable", { iid: printInvokeId(state.invokeId) }),
                new ServiceErrorData(
                    ServiceProblem_requestedServiceNotAvailable,
                    undefined,
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    notification,
                ),
            );
        }
    }

    // WARNING: Step 9 is unreachable. I will report this defect.
    // if (BadPermittedSR.length === 0) {
    //     throw new ServiceError(
    //         ctx.i18n.t("err:requestedServiceNotAvailable", { iid: printInvokeId(state.invokeId) }),
    //         new ServiceErrorData(
    //             ServiceProblem_requestedServiceNotAvailable,
    //             undefined,
    //             createSecurityParameters(
    //                 ctx,
    //                 signErrors,
    //                 assn.boundNameAndUID?.dn,
    //                 undefined,
    //                 serviceError["&errorCode"],
    //             ),
    //             ctx.dsa.accessPoint.ae_title.rdnSequence,
    //             state.chainingArguments.aliasDereferenced,
    //             [
    //                 new Attribute(
    //                     searchServiceProblem["&id"],
    //                     [searchServiceProblem.encoderFor["&Type"]!(id_pr_unidentifiedOperation, DER)],
    //                 ),
    //             ],
    //         ),
    //     );
    // }

    // Step 10
    for (const asserted_step of [ 1, 2, 3, 4, 5, 6 ]) {
        BadPermittedSR = BadPermittedSR
            .filter((sr) => {
                const result = search_rule_evals.get(sr);
                if (!result?.clause_and_step_failed) {
                    return false; // This should never happen.
                }
                const [ clause, step ] = result.clause_and_step_failed;
                if (clause > 1) { // If it failed on a later clause...
                    return true; // The rule survives.
                }
                if (step > asserted_step) { // Or it failed on a later step...
                    return true; // The rule survives.
                }
                return false; // Otherwise, the rule is dropped.
            });
        if (BadPermittedSR.length === 1) {
            const result = search_rule_evals.get(BadPermittedSR[0]);
            // NOTE: The spec is somewhat vague as to what is supposed to happen here.
            if (result) {
                throw new ServiceError(
                    ctx.i18n.t("err:requestedServiceNotAvailable", { iid: printInvokeId(state.invokeId) }),
                    new ServiceErrorData(
                        ServiceProblem_requestedServiceNotAvailable,
                        undefined,
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            serviceError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        result.notification,
                    ),
                );
            }
        }
    }

    // Step 11
    const all_non_compliant_so_far: boolean = BadPermittedSR
        .every((sr) => {
            const result = search_rule_evals.get(sr);
            if (!result?.clause_and_step_failed) {
                return true;
            }
            const [ clause ] = result.clause_and_step_failed;
            return (clause === 1);
        });
    if (all_non_compliant_so_far) {
        const notification: Attribute[] = [
            new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_unidentifiedOperation, DER)],
            ),
        ];
        if (data.serviceControls?.serviceType) {
            notification.push(new Attribute(
                serviceType["&id"],
                [serviceType.encoderFor["&Type"]!(data.serviceControls.serviceType, DER)],
            ));
        }
        throw new ServiceError(
            ctx.i18n.t("err:requestedServiceNotAvailable", { iid: printInvokeId(state.invokeId) }),
            new ServiceErrorData(
                ServiceProblem_requestedServiceNotAvailable,
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                notification,
            ),
        );
    }

    // Step 12
    for (const asserted_step of [ 1, 2, 3, 4, 5, 6 ]) {
        BadPermittedSR = BadPermittedSR
            .filter((sr) => {
                const result = search_rule_evals.get(sr);
                if (!result?.clause_and_step_failed) {
                    return false; // This should never happen.
                }
                const [ clause, step ] = result.clause_and_step_failed;
                if (clause > 2) { // If it failed on a later clause...
                    return true; // The rule survives.
                }
                if (step > asserted_step) { // Or it failed on a later step...
                    return true; // The rule survives.
                }
                return false; // Otherwise, the rule is dropped.
            });
        if (BadPermittedSR.length === 1) {
            const result = search_rule_evals.get(BadPermittedSR[0]);
            // NOTE: The spec is somewhat vague as to what is supposed to happen here.
            if (result) {
                throw new ServiceError(
                    ctx.i18n.t("err:requestedServiceNotAvailable", { iid: printInvokeId(state.invokeId) }),
                    new ServiceErrorData(
                        ServiceProblem_requestedServiceNotAvailable,
                        undefined,
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            serviceError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        result.notification,
                    ),
                );
            }
        }
    }

    // Step 13
    for (const asserted_step of [ 1, 2, 3, 4, 5 ]) {
        BadPermittedSR = BadPermittedSR
            .filter((sr) => {
                const result = search_rule_evals.get(sr);
                if (!result?.clause_and_step_failed) {
                    return false; // This should never happen.
                }
                const [ clause, step ] = result.clause_and_step_failed;
                if (clause > 3) { // If it failed on a later clause...
                    return true; // The rule survives.
                }
                if (step > asserted_step) { // Or it failed on a later step...
                    return true; // The rule survives.
                }
                return false; // Otherwise, the rule is dropped.
            });
        if (BadPermittedSR.length === 1) {
            const result = search_rule_evals.get(BadPermittedSR[0]);
            // NOTE: The spec is somewhat vague as to what is supposed to happen here.
            if (result) {
                throw new ServiceError(
                    ctx.i18n.t("err:requestedServiceNotAvailable", { iid: printInvokeId(state.invokeId) }),
                    new ServiceErrorData(
                        ServiceProblem_requestedServiceNotAvailable,
                        undefined,
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            serviceError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        result.notification,
                    ),
                );
            }
        }
    }

    // Step 14
    const notification: Attribute[] = [
        new Attribute(
            searchServiceProblem["&id"],
            [searchServiceProblem.encoderFor["&Type"]!(id_pr_unidentifiedOperation, DER)],
        ),
    ];
    if (data.serviceControls?.serviceType) {
        notification.push(new Attribute(
            serviceType["&id"],
            [serviceType.encoderFor["&Type"]!(data.serviceControls.serviceType, DER)],
        ));
    }
    throw new ServiceError(
        ctx.i18n.t("err:requestedServiceNotAvailable", { iid: printInvokeId(state.invokeId) }),
        new ServiceErrorData(
            ServiceProblem_requestedServiceNotAvailable,
            undefined,
            createSecurityParameters(
                ctx,
                signErrors,
                assn.boundNameAndUID?.dn,
                undefined,
                serviceError["&errorCode"],
            ),
            ctx.dsa.accessPoint.ae_title.rdnSequence,
            state.chainingArguments.aliasDereferenced,
            notification,
        ),
    );

}
