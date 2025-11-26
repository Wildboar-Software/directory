import type { SearchRule } from "@wildboar/x500/ServiceAdministration";

/**
 * @summary Determine whether a search rule is the "empty search rule"
 * @description
 *
 * [ITU Recommendation X.501 (2019)](https://www.itu.int/rec/T-REC-X.501/en),
 * describes an "empty search rule" that imposes no restrictions on searches in
 * Section 16.3.
 *
 * As described in Section 16.10.1, the "empty search rule" is indicated by
 * having an `id` of 0 and a missing `serviceType` component.
 *
 * @param sr The search rule to be checked
 * @returns {Boolean} indicating whether the search rule is "empty"
 *
 * @function
 */
export function is_empty_search_rule(sr: SearchRule): boolean {
    return ((sr.id === 0) && !sr.serviceType);
}
