import { IndexableOID } from "@wildboar/meerkat-types";
import { Filter } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Filter.ta";
import { OBJECT_IDENTIFIER } from "asn1-ts";
import { FilterItem } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FilterItem.ta";

/**
 * @summary Extract the attribute type from a filter and whether it was present in a non-negated filter item.
 * @description
 *
 * This function modifies the parameter `ret` by reference, adding to its keys
 * the string-form object identifier of the attribute type it identifies in the
 * filter item, and setting the value to a boolean indicating whether such an
 * attribute is present in a non-negated fashion.
 *
 * The absence of an attribute type from the keys of `ret` indicates that this
 * attribute type was never present in the filter. If the value is set to
 * `false`, it means that the attribute type was only found in a negated filter
 * item so far, and if the value is set to `true`, it means that the attribute
 * type was found in a non-negated filter item at least once. This value will
 * only transition from `false` to `true` as the filter is explored by this
 * function.
 *
 * @param item The current filter item
 * @param non_negated {Boolean} Whether the current filter item is not negated
 * @param ret A mapping of string-form attribute type object identifiers to
 *  booleans indicating whether the type was present in any non-negated filter item.
 * @returns Nothing. This function modifies `ret` by reference.
 *
 * @function
 */
export
    function getAttributeTypeNegationFromFilterItem(
        item: FilterItem,
        non_negated: boolean,
        ret: Map<IndexableOID, boolean>
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
 * attribute type was _ever_ present in the filter in a non-negated filter
 * item.
 *
 * @param filter The filter to analyze
 * @param non_negated Whether the current filter is non-negated
 * @param ret A mapping of string-form attribute type object identifiers to
 *  booleans indicating whether the type was present in any non-negated filter item.
 * @returns Nothing. This function modifies `ret` by reference.
 *
 * @function
 * @see {@link getAttributeTypeNegationFromFilterItem} Which is called for individual filter items
 */
export
    function getAttributeTypeNegationFromFilter(
        filter: Filter,
        non_negated: boolean,
        ret: Map<IndexableOID, boolean>
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
