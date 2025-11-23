import type { Filter } from "@wildboar/x500/DirectoryAbstractService";
import { objectClass } from "@wildboar/x500/InformationFramework";

/**
 * @summary Determine whether a filter is a "match-all" filter
 * @description
 *
 * This function returns a boolean indicating whether a filter will match all
 * entries. Examples of such filters include `and:{}`.
 *
 * @param filter The filter to be evaluated
 * @returns A boolean indicating whether the filter will match all entries
 *
 * @function
 */
export
function isMatchAllFilter (filter?: Filter): boolean {
    if (!filter) {
        return true;
    }
    if ("item" in filter) {
        return (("present" in filter.item)
            && filter.item.present.isEqualTo(objectClass["&id"]));
    } else if ("and" in filter) {
        return filter.and.every(isMatchAllFilter);
    } else if ("or" in filter) {
        return filter.or.some(isMatchAllFilter);
    } else {
        return false;
    }
}

export default isMatchAllFilter;
