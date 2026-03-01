import { type BIT_STRING, FALSE_BIT, TRUE_BIT } from "@wildboar/asn1";
import type {
    SearchRule,
} from "@wildboar/x500/ServiceAdministration";
import { ControlOptions } from "@wildboar/x500/ServiceAdministration";
import {
    HierarchySelections,
    SearchControlOptions,
    ServiceControlOptions,
} from "@wildboar/x500/DirectoryAbstractService";

export
interface EffectiveControls {
    service: ServiceControlOptions;
    search: SearchControlOptions;
    hs: HierarchySelections;
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

// This code was copied from check_of_controls_and_hierarchy_selections.ts.
/**
 * @summary Get the effective controls from a search rule
 * @description
 *
 * This function determines the effective controls based on the user-supplied
 * controls and an applicable search rule.
 *
 * @param rule The search rule to get the effective controls from
 * @param user_hs The user's hierarchy selections
 * @param user_search_opts The user's search options
 * @param user_service_opts The user's service options
 * @returns The effective controls
 * 
 * @function
 */
export
function getEffectiveControlsFromSearchRule (
    rule: SearchRule,
    user_hs?: HierarchySelections,
    user_search_opts?: SearchControlOptions,
    user_service_opts?: ServiceControlOptions,
): EffectiveControls {
    const c_service_controls: number = concatenate_default_bits(
        user_service_opts ?? new Uint8ClampedArray(0),
        rule.defaultControls?.serviceControls ?? new Uint8ClampedArray(16),
    );
    const c_search_options: number = concatenate_default_bits(
        user_search_opts ?? new Uint8ClampedArray(0),
        rule.defaultControls?.searchOptions ?? ControlOptions._default_value_for_searchOptions,
    );
    const c_hierarchy_selections: number = concatenate_default_bits(
        user_hs ?? DEFAULT_HS,
        rule.defaultControls?.hierarchyOptions ?? DEFAULT_HS,
    );

    const d_hierarchy_selections = bits_to_int(rule.defaultControls?.hierarchyOptions
        ?? DEFAULT_HS);
    const d_search_options = bits_to_int(rule.defaultControls?.searchOptions
        ?? ControlOptions._default_value_for_searchOptions);
    const d_service_controls = bits_to_int(rule.defaultControls?.serviceControls
        ?? ControlOptions._default_value_for_serviceControls);

    const s_hierarchy_selections = bits_to_int(rule.searchRuleControls?.hierarchyOptions
        ?? DEFAULT_HS);
    const s_search_opts = bits_to_int(rule.searchRuleControls?.searchOptions
        ?? ControlOptions._default_value_for_searchOptions);
    const s_service_opts = bits_to_int(rule.searchRuleControls?.serviceControls
        ?? ControlOptions._default_value_for_serviceControls);

    const effective_hierarchy_selections = (c_hierarchy_selections & ~s_hierarchy_selections)
        | (d_hierarchy_selections & s_hierarchy_selections);
    const effective_search_opts = (c_search_options & ~s_search_opts)
        | (d_search_options & s_search_opts);
    const effective_service_opts = (c_service_controls & ~s_service_opts)
        | (d_service_controls & s_service_opts);

    return {
        hs: int_to_bits(effective_hierarchy_selections),
        search: int_to_bits(effective_search_opts),
        service: int_to_bits(effective_service_opts),
    };
}
