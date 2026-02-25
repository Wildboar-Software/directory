import { type BIT_STRING, FALSE_BIT, TRUE_BIT } from "@wildboar/asn1";
import type {
    SearchRule,
} from "@wildboar/x500/ServiceAdministration";
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

export
function getEffectiveControlsFromSearchRule (
    rule: SearchRule,
    user_hs?: HierarchySelections,
    user_search_opts?: SearchControlOptions,
    user_service_opts?: ServiceControlOptions,
    is_search: boolean = true,
): EffectiveControls {
    const supplied_hs = user_hs ?? rule.defaultControls?.hierarchyOptions ?? new Uint8ClampedArray([ TRUE_BIT ]);
    const supplied_search_opts = user_search_opts ?? rule.defaultControls?.searchOptions ?? new Uint8ClampedArray([ TRUE_BIT ]);
    const supplied_service_opts = user_service_opts ?? rule.defaultControls?.serviceControls ?? new Uint8ClampedArray();

    if (!is_search || !rule.searchRuleControls) {
        return {
            hs: supplied_hs,
            search: supplied_search_opts,
            service: supplied_service_opts,
        };
    }

    let effective_hs: BIT_STRING = new Uint8ClampedArray(32);
    let effective_search_opts: BIT_STRING = new Uint8ClampedArray(32);
    let effective_service_opts: BIT_STRING = new Uint8ClampedArray(32);

    if (rule.searchRuleControls.hierarchyOptions) {
        const defaults = rule.defaultControls?.hierarchyOptions ?? new Uint8ClampedArray([ TRUE_BIT ]);
        const src = rule.searchRuleControls.hierarchyOptions;
        for (let i = 0; i < 32; i++) {
            if (src[i] === TRUE_BIT) {
                effective_hs[i] = defaults[i] ?? FALSE_BIT;
            } else {
                effective_hs[i] = supplied_hs[i];
            }
        }
    } else {
        effective_hs = supplied_hs;
    }

    if (rule.searchRuleControls.searchOptions) {
        const defaults = rule.defaultControls?.searchOptions ?? new Uint8ClampedArray([ TRUE_BIT ]);
        const src = rule.searchRuleControls.searchOptions;
        for (let i = 0; i < 32; i++) {
            if (src[i] === TRUE_BIT) {
                effective_search_opts[i] = defaults[i] ?? FALSE_BIT;
            } else {
                effective_search_opts[i] = supplied_search_opts[i];
            }
        }
    } else {
        effective_search_opts = supplied_search_opts;
    }

    if (rule.searchRuleControls.serviceControls) {
        const defaults = rule.defaultControls?.serviceControls ?? new Uint8ClampedArray(0);
        const src = rule.searchRuleControls.serviceControls;
        for (let i = 0; i < 32; i++) {
            if (src[i] === TRUE_BIT) {
                effective_service_opts[i] = defaults[i] ?? FALSE_BIT;
            } else {
                effective_service_opts[i] = supplied_service_opts[i];
            }
        }
    } else {
        effective_service_opts = supplied_service_opts;
    }

    return {
        hs: effective_hs,
        search: effective_search_opts,
        service: effective_service_opts,
    };
}
