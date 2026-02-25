import type { SearchRule } from "@wildboar/x500/ServiceAdministration";
import type { SearchArgumentData } from "@wildboar/x500/DirectoryAbstractService";
import { FALSE_BIT, TRUE_BIT, type BIT_STRING } from "@wildboar/asn1";
import {
    HierarchySelections_all,
    HierarchySelections_children,
    HierarchySelections_hierarchy,
    HierarchySelections_parent,
    HierarchySelections_siblingChildren,
    HierarchySelections_siblingSubtree,
    HierarchySelections_siblings,
    HierarchySelections_subtree,
    HierarchySelections_top
} from "@wildboar/x500/DirectoryAbstractService";
import { ControlOptions } from "@wildboar/x500/ServiceAdministration";
import type {
    HierarchySelections,
    SearchControlOptions,
    ServiceControlOptions,
} from "@wildboar/x500/DirectoryAbstractService";

/**
 * @summary Return type of `check_of_controls_and_hierarchy_selections()`
 * @interface
 * @see {@link check_of_controls_and_hierarchy_selections}
 */
export interface CheckControlsAndHSReturn {

    /**
     * The step of the procedure described in
     * [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en)
     * on which controls or hierarchy selection validation failed. This will be
     * `undefined` if there was no failure.
     */
    step_failed?: number;

    /**
     * If successful (step_failed is undefined), the effective
     * `hierarchySelection` after the `defaultControls` are applied and after
     * `searchRuleControls` overrides user-supplied bits.
     * 
     * If validation failed (step_failed is a `number`), the
     * hierarchy selections that failed validation, for use in the
     * `hierarchySelectList` notification attribute.
     */
    hierarchySelectList?: HierarchySelections;

    /**
     * If successful (step_failed is undefined), the effective
     * `searchControlOptions` after the `defaultControls` are applied and after
     * `searchRuleControls` overrides user-supplied bits.
     * 
     * If validation failed (step_failed is a `number`), the search control
     * options that failed validation, for use in the
     * `searchControlOptionsList` notification attribute.
     */
    searchControlOptionsList?: SearchControlOptions;

    /**
     * If successful (step_failed is undefined), the effective
     * `serviceControlOptions` after the `defaultControls` are applied and after
     * `searchRuleControls` overrides user-supplied bits.
     * 
     * If validation failed (step_failed is a `number`), the service control
     * options that failed validation, for use in the
     * `serviceControlOptionsList` notification attribute.
     */
    serviceControlOptionsList?: ServiceControlOptions;
}

// NOTE: This is NOT a deviation from the spec.
const DEFAULT_HS: BIT_STRING = new Uint8ClampedArray([ TRUE_BIT ]); // Just self

/* At the time of writing, there are only 14 service control options, nine
hierarchy selections, and 11 search control options, so 16 bits is enough for
all three of the following functions. */
const BITS_WE_USE = 16;

function concatenate_default_bits(
    user_bits: BIT_STRING,
    default_bits: BIT_STRING,
): number {
    let ret: number = 0;
    for (let i = 0; i < BITS_WE_USE; i++) {
        const bit = user_bits[i] ?? default_bits[i] ?? 0;
        if (bit === TRUE_BIT) {
            ret |= 1 << i;
        }
    }
    return ret;
}

function bits_to_int(bits: BIT_STRING): number {
    let ret: number = 0;
    for (let i = 0; i < BITS_WE_USE; i++) {
        if (bits[i] === TRUE_BIT) {
            ret |= 1 << i;
        }
    }
    return ret;
}

function int_to_bits(int: number): BIT_STRING {
    const ret = new Uint8ClampedArray(BITS_WE_USE);
    for (let i = 0; i < BITS_WE_USE; i++) {
        ret[i] = (int & (1 << i)) ? TRUE_BIT : FALSE_BIT;
    }
    return ret;
}

/**
 * @summary Check a search request for permitted control options and hierarchy selections.
 * @description
 *
 * This function implements the procedure defined in
 * [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
 * Section 15.3. It validates the search control options, service control
 * options, and hierarchy selections present (or not) in a search request
 * against a governing search rule. If any validation fails, the step of the
 * procedure on which validation failed will be returned along with additional
 * information that can be used to construct notification attributes.
 * 
 * Variable naming within this function is based on the NOTE at the bottom of
 * ITU-T X.501 (2019), Section 16.10.5. C is user-supplied bits concatenated
 * with defaults. D is the default bits. S is the search rule control bits.
 * M is the mandatory bits.
 *
 * @param search The unsigned search argument data
 * @param rule The governing search rule
 * @returns An object containing information about what specifically failed
 *  validation.
 *
 * @function
 * @see {@link CheckControlsAndHSReturn}
 */
export function check_of_controls_and_hierarchy_selections(
    search: SearchArgumentData,
    rule: SearchRule): CheckControlsAndHSReturn {

    // FIXME: This function should take all the search fields separately so it can be used for read and modify operations.

    // Step 1
    if (!rule.defaultControls?.hierarchyOptions) {
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

    const c_service_controls: number = concatenate_default_bits(
        search.serviceControls?.options ?? new Uint8ClampedArray(0),
        rule.defaultControls?.serviceControls ?? new Uint8ClampedArray(0),
    );
    const c_search_options: number = concatenate_default_bits(
        search.searchControlOptions ?? new Uint8ClampedArray(0),
        rule.defaultControls?.searchOptions ?? ControlOptions._default_value_for_searchOptions,
    );
    const c_hierarchy_selections: number = concatenate_default_bits(
        search.hierarchySelections ?? DEFAULT_HS,
        rule.defaultControls?.hierarchyOptions ?? DEFAULT_HS,
    );

    const d_hierarchy_selections = bits_to_int(rule.defaultControls?.hierarchyOptions
        ?? DEFAULT_HS);
    const d_search_options = bits_to_int(rule.defaultControls?.searchOptions
        ?? ControlOptions._default_value_for_searchOptions);
    const d_service_controls = bits_to_int(rule.defaultControls?.serviceControls
        ?? ControlOptions._default_value_for_serviceControls);

    // TODO:
    // If all the hierarchyOptions subcomponent is absent in defaultControls , or the defaultControls is absent,
    // hierarchy selection shall not be used.

    // Step 2
    if (rule.mandatoryControls?.hierarchyOptions) {
        const mandatory = bits_to_int(rule.mandatoryControls.hierarchyOptions);
        /* ITU-T X.501 (2019), Section 16.10.5: "The search validation against
        this search-rule fails if the bitstring C&M is not equal to D&M."
        XOR'ing gives you a diff instead of just using ==. */
        const non_compliant_bits = (c_hierarchy_selections & mandatory)
            ^ (d_hierarchy_selections & mandatory);
        if (non_compliant_bits !== 0) {
            return {
                step_failed: 2,
                hierarchySelectList: int_to_bits(non_compliant_bits),
            };
        }
    }

    // Step 3 does not apply, because Meerkat DSA supports all hierarchy selections.
    // Step 4
    if (rule.mandatoryControls?.searchOptions) {
        const mandatory = bits_to_int(rule.mandatoryControls.searchOptions);
        /* ITU-T X.501 (2019), Section 16.10.5: "The search validation against
        this search-rule fails if the bitstring C&M is not equal to D&M."
        XOR'ing gives you a diff instead of just using ==. */
        const non_compliant_bits = (c_search_options & mandatory)
            ^ (d_search_options & mandatory);
        if (non_compliant_bits !== 0) {
            return {
                step_failed: 4,
                searchControlOptionsList: int_to_bits(non_compliant_bits),
            };
        }
    }

    // Step 5
    if (rule.mandatoryControls?.serviceControls) {
        const mandatory = bits_to_int(rule.mandatoryControls.serviceControls);
        /* ITU-T X.501 (2019), Section 16.10.5: "The search validation against
        this search-rule fails if the bitstring C&M is not equal to D&M."
        XOR'ing gives you a diff instead of just using ==. */
        const non_compliant_bits = (c_service_controls & mandatory)
            ^ (d_service_controls & mandatory);
        if (non_compliant_bits !== 0) {
            return {
                step_failed: 5,
                serviceControlOptionsList: int_to_bits(non_compliant_bits),
            };
        }
    }

    // Validation is complete. Just calculate the effective controls and return.

    if (!rule.searchRuleControls) {
        return {
            hierarchySelectList: int_to_bits(c_hierarchy_selections),
            searchControlOptionsList: int_to_bits(c_search_options),
            serviceControlOptionsList: int_to_bits(c_service_controls),
        };
    }
    const s_hierarchy_selections = bits_to_int(rule.searchRuleControls.hierarchyOptions
        ?? DEFAULT_HS);
    const s_search_opts = bits_to_int(rule.searchRuleControls.searchOptions
        ?? ControlOptions._default_value_for_searchOptions);
    const s_service_opts = bits_to_int(rule.searchRuleControls.serviceControls
        ?? ControlOptions._default_value_for_serviceControls);

    const effective_hierarchy_selections = (c_hierarchy_selections & ~s_hierarchy_selections)
        | (d_hierarchy_selections & s_hierarchy_selections);
    const effective_search_opts = (c_search_options & ~s_search_opts)
        | (d_search_options & s_search_opts);
    const effective_service_opts = (c_service_controls & ~s_service_opts)
        | (d_service_controls & s_service_opts);

    return {
        hierarchySelectList: int_to_bits(effective_hierarchy_selections),
        searchControlOptionsList: int_to_bits(effective_search_opts),
        serviceControlOptionsList: int_to_bits(effective_service_opts),
    };
}
