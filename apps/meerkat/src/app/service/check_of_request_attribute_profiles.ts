import { Context, IndexableOID } from "@wildboar/meerkat-types";
import {
    SearchRule
} from "@wildboar/x500/ServiceAdministration";
import { SearchArgumentData } from "@wildboar/x500/DirectoryAbstractService";
import { RequestAttribute } from "@wildboar/x500/ServiceAdministration";
import { compareElements } from "@wildboar/x500";
import {
    ASN1Element, ObjectIdentifier,
    OBJECT_IDENTIFIER
} from "@wildboar/asn1";
import { id_pr_missingSearchContext } from "@wildboar/x500/SelectedAttributeTypes";
import { id_pr_searchContextViolation } from "@wildboar/x500/SelectedAttributeTypes";
import { id_pr_searchContextCombinationViolation } from "@wildboar/x500/SelectedAttributeTypes";
import { Filter } from "@wildboar/x500/DirectoryAbstractService";
import { ContextProfile } from "@wildboar/x500/ServiceAdministration";
import getEqualityMatcherGetter from "../x500/getEqualityMatcherGetter.js";
import { getRequiredContextsFromContextCombination } from "./getRequiredContextsFromContextCombination.js";
import { checkContextCombination } from "./checkContextCombination.js";
import type { FilterItem } from "@wildboar/x500/DirectoryAbstractService";
import { ContextAssertion } from "@wildboar/x500/InformationFramework";
import { ContextCombination } from "@wildboar/x500/ServiceAdministration";
import { AttributeType } from "@wildboar/x500/InformationFramework";

/**
 * The return type of `check_of_request_attribute_profile_in_filter()`. The
 * fields of this object take their names from the search service problems
 * defined in
 * [ITU Recommendation X.520 (2019)](https://www.itu.int/rec/T-REC-X.520/en),
 * Section 6.16.2.
 *
 * @see {@link check_of_request_attribute_profile_in_filter}
 */
export interface CheckRequestAttributeState {

    /**
     * The object identifier identifying the problem (if any) that is to
     * populate the `searchServiceProblem` notification attribute described in
     * [ITU Recommendation X.520 (2019)](https://www.itu.int/rec/T-REC-X.520/en),
     * Section 6.16.2.
     */
    serviceProblem?: OBJECT_IDENTIFIER,

    /**
     * Attribute types that did not assert specific values in filter items when
     * doing so was forbidden, such as when using a `contextsPresent` filter
     * item.
     */
    searchValuesRequired: AttributeType[], // FIXME: Change to a set

    /**
     * The filter items that contain assertions of values that were not
     * permitted by the governing search rule.
     */
    invalidSearchValues: FilterItem[],

    /**
     * The attribute type that is lacking a context type that is required by
     * the governing search rule. The particular missing context types are
     * tracked in `missingSearchContexts`.
     */
    missingSearchContextAttr?: AttributeType,

    /**
     * The object identifiers of context types that were missing, yet required
     * by the governing search rule, in a filter item whose attribute type is
     * identified by `missingSearchContextAttr`.
     */
    missingSearchContexts: OBJECT_IDENTIFIER[], // FIXME: Change to a set

    /**
     * The attribute type of a filter item that contained an invalid context
     * combination according to the governing search rule. The particular
     * combination violations are tracked in `contextComboViolations`.
     */
    contextComboViolationAttr?: AttributeType;

    /**
     * The list of context combinations that were violated for the filter item
     * whose attribute type is identified by `contextComboViolationAttr`.
     */
    contextComboViolations: ContextCombination[],

    /**
     * The attribute type of a filter item that contained context types that
     * were not permitted by the governing search rule. The particular offending
     * context types are tracked in `searchContextViolations`.
     */
    searchContextViolationsAttr?: AttributeType,

    /**
     * Context types that violated the governing search rule in a filter item
     * whose attribute type is identified by `searchContextViolationsAttr`.
     */
    searchContextViolations: OBJECT_IDENTIFIER[],

    /**
     * The attribute type of a filter item that contained context assertions
     * that contained a prohibited assertion value. The particular offending
     * context assertions are tracked in `searchContextValueViolations`.
     */
    searchContextValueViolationAttr?: AttributeType,

    /**
     * Context values that violated the governing search rules in a filter item
     * whose attribute type is identified by `searchContextValueViolationAttr`.
     */
    searchContextValueViolations: ContextAssertion[],

}

/**
 * @summary Validate filters based on search-rule-imposed input attribute profiles
 * @description
 *
 * This function implements the procedure defined in
 * [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
 * Section 15.2. Specifically, it checks that filter items within a filter
 * comply with the applicable attribute profiles present in the governing
 * search filter. As problems are encountered, the `state` is modified by
 * reference. The callee is expected to inspect the fields of this object to
 * determine if any restrictions were violated.
 *
 * @param ctx The context object
 * @param state The current state of this function, which is passed recursively
 * @param filter The search filter to be checked
 * @param attr_profiles A mapping of input attribute types by their string-form
 *  attribute type object identifier
 * @returns Nothing. `state` is modified by reference.
 *
 * @function
 * @see {@link CheckRequestAttributeState}
 */
export function check_of_request_attribute_profile_in_filter(
    ctx: Context,
    state: CheckRequestAttributeState,
    filter: Filter,
    attr_profiles: Map<IndexableOID, RequestAttribute>): void {
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
            if (item.approximateMatch.assertedContexts
                && ("selectedContexts" in item.approximateMatch.assertedContexts)) {
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
        if ((!profile.selectedValues || (profile.selectedValues.length > 0))
            && (
                !("equality" in item)
                && !("substrings" in item)
                && !("approximateMatch" in item)
                && !("extensibleMatch" in item)
                // NOTE: This excludes other filter item types I think it should include...
            )) {
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
                    required_contexts
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
                                non_matching_assertions
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

/**
 * @summary Validate a search filter against input attribute type profiles
 * @description
 *
 * This function validates filter items within a search filter according to
 * `inputAttributeTypes` present in the governing search rule, as described by
 * the procedure defined in
 * [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
 * Section 15.2.
 *
 * @param ctx The context object
 * @param search The unsigned search argument data
 * @param rule The governing search rule
 * @returns The step on which validation failed and the internal function state
 *
 * @function
 * @see {@link CheckRequestAttributeState}
 */
export function check_of_request_attribute_profiles(
    ctx: Context,
    search: SearchArgumentData,
    rule: SearchRule): [number, CheckRequestAttributeState] {
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
