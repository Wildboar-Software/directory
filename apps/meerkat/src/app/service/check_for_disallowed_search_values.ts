import { IndexableOID } from "@wildboar/meerkat-types";
import { OBJECT_IDENTIFIER } from "asn1-ts";
import { Filter } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Filter.ta";
import { FilterItem } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FilterItem.ta";

/**
 * @summary Check a filter for filter items that assert values when prohibited
 * @description
 *
 * This function implements step 4 of the procedure described in
 * [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
 * Section 15.1.
 *
 * This function recurses into a search filter to identify filter items that
 * assert values when all value assertions are prohibited for a given attribute
 * type per the governing search rule. (This is indicated in a search rule by
 * an input attribute type using an empty `selectedValues`.)
 *
 * @param filter The search filter to be checked
 * @param disallowed A mapping of string-form attribute type object identifiers
 *  to whether the `contexts` component of the request attribute type was
 *  present in the search rule.
 * @param violations The filter items that have violated the search rule
 * @returns Nothing. This function pushes filter items to `violations` by
 *  reference.
 *
 * @function
 */
export function check_for_disallowed_search_values(
    filter: Filter,
    disallowed: Map<IndexableOID, boolean>,
    violations: FilterItem[]): void {
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
