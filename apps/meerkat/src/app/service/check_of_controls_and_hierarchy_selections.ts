import { SearchRule } from "@wildboar/x500/ServiceAdministration";
import { SearchArgumentData } from "@wildboar/x500/DirectoryAbstractService";
import { TRUE_BIT, BIT_STRING } from "@wildboar/asn1";
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
import { get_bit_string_from_int32, get_int32_from_bit_string } from "../utils/bits2int.js";
import type {
    HierarchySelections,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    SearchControlOptions,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
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
     * The hierarchy selections that failed validation, for use in the
     * `hierarchySelectList` notification attribute.
     */
    hierarchySelectList?: HierarchySelections;

    /**
     * The search control options that failed validation, for use in the
     * `searchControlOptionsList` notification attribute.
     */
    searchControlOptionsList?: SearchControlOptions;

    /**
     * The service control options that failed validation, for use in the
     * `serviceControlOptionsList` notification attribute.
     */
    serviceControlOptionsList?: ServiceControlOptions;

}

// NOTE: This is NOT a deviation from the spec.
const DEFAULT_HS: BIT_STRING = new Uint8ClampedArray([ TRUE_BIT ]); // Just self

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
