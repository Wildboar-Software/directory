import { Context, IndexableOID } from "../types/index.js";
import {
    SearchRule,
} from "@wildboar/x500/ServiceAdministration";
import {
    RequestAttribute,
} from "@wildboar/x500/ServiceAdministration";
import { SearchArgumentData } from "@wildboar/x500/DirectoryAbstractService";
import { ObjectIdentifier, TRUE_BIT } from "@wildboar/asn1";
import { ContextProfile } from "@wildboar/x500/ServiceAdministration";
import getAttributeParentTypes from "../x500/getAttributeParentTypes.js";
import { getAttributeTypeNegationFromFilter } from "./getAttributeTypeNegationFromFilter.js";
import { getRequiredAttributesFromAttributeCombination } from "./getRequiredAttributesFromAttributeCombination.js";
import { checkAttributeCombination } from "./checkAttributeCombination.js";
import { check_for_disallowed_search_values } from "./check_for_disallowed_search_values.js";
import { check_for_disallowed_contexts } from "./check_for_disallowed_contexts.js";
import { AttributeCombination } from "@wildboar/x500/ServiceAdministration";
import { FilterItem } from "@wildboar/x500/DirectoryAbstractService";
import type { AttributeType } from "@wildboar/x500/InformationFramework";

/**
 * The internal state of `general_check_of_search_filter()`.
 * The properties of this interface take their names from the notification
 * attribute types defined in
 * [ITU Recommendation X.520 (2019)](https://www.itu.int/rec/T-REC-X.520/en).
 *
 * @see {@link general_check_of_search_filter}
 */
export interface SearchRuleGeneralCheckState {
    // TODO: Make more of these sets instead of arrays.

    /**
     * Attribute types that were not permitted by the `inputAttributeTypes`
     * component of the governing search rule.
     */
    searchAttributeViolations: AttributeType[],

    /**
     * Attribute types that were only present negated.
     */
    attributeNegationViolations: AttributeType[],

    /**
     * Attributes that were required by the governing search rule, but not
     * provided in the search filter.
     */
    missingSearchAttributes: AttributeType[],

    /**
     * Attribute combinations that were violated by the search filter.
     */
    searchAttributeCombinationViolations: AttributeCombination[],

    /**
     * Filter items that contained value assertions that were not permitted by
     * the governing search rule.
     */
    searchValuesDisallowed: FilterItem[],

    /**
     * A set of string-form context type object identifiers that were not
     * permitted, but present in the search filter.
     */
    searchContextViolations: Set<IndexableOID>,

}

/**
 * @summary The "General check of search filter" procedure described in X.511
 * @description
 *
 * This function is an implementation of the procedure described in
 * [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
 * Section 15.1.
 *
 * @param ctx The context object
 * @param search The unsigned search argument data
 * @param rule The governing search rule
 * @returns A tuple containing the step this function failed on, followed by the
 *  function's internal state, in that order. The first value will be 0 if no
 *  steps failed.
 *
 * @function
 * @see {@link SearchRuleGeneralCheckState}
 */
export function general_check_of_search_filter(
    ctx: Context,
    search: SearchArgumentData,
    rule: SearchRule): [number, SearchRuleGeneralCheckState] {
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
    if ((rule.inputAttributeTypes.length === 0)
        && (
            filter
            && (
                !("and" in filter)
                || (filter.and.length !== 0)
            )
        )) {
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
        const oid = ObjectIdentifier.fromString(attr);
        let is_permitted: boolean = false;
        for (const attr_type of getAttributeParentTypes(ctx, oid)) {
            const key = attr_type.toString();
            const profile = permitted_attrs.get(attr_type.toString());
            if (profile) {
                const is_subtype: boolean = (key !== attr);
                if (!is_subtype || profile.includeSubtypes) {
                    is_permitted = true;
                } else {
                    break;
                }
            } else {
                continue;
            }
            /* WARNING: The specification is not clear as to whether this is true
            for all attributes at all, or just those present in the input attrs. */
            if (!is_non_neg) {
                state.attributeNegationViolations.push(oid);
                break;
            }
        }
        if (!is_permitted) {
            state.searchAttributeViolations.push(oid);
            continue;
        }
        required_attrs.delete(attr);
    }

    // If attribute combo is defined AND it is not the default value.
    if (rule.attributeCombination && !(
        ("and" in rule.attributeCombination)
        && (rule.attributeCombination.and.length === 0)
    )) {
        state.missingSearchAttributes.push(...Array
            .from(required_attrs.values())
            .map((s) => ObjectIdentifier.fromString(s)));

        if (filter) {
            checkAttributeCombination(
                filter,
                rule.attributeCombination,
                true,
                state.searchAttributeCombinationViolations
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
