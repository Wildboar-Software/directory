import type { Filter } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Filter.ta";
import type { FilterItem } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FilterItem.ta";
import type { AttributeType } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";

export
function getAttributeTypesFromFilterItem (item: FilterItem): AttributeType[] {
    if ("equality" in item) {
        return [ item.equality.type_ ];
    }
    else if ("substrings" in item) {
        return [ item.substrings.type_ ];
    }
    else if ("greaterOrEqual" in item) {
        return [ item.greaterOrEqual.type_ ];
    }
    else if ("lessOrEqual" in item) {
        return [ item.lessOrEqual.type_ ];
    }
    else if ("present" in item) {
        return [ item.present ];
    }
    else if ("approximateMatch" in item) {
        return [ item.approximateMatch.type_ ];
    }
    else if ("extensibleMatch" in item) {
        // NOTE: This has no way of extracting the relevant attribute types to which the matching rules may apply.
        return item.extensibleMatch.type_
            ? [ item.extensibleMatch.type_ ]
            : [];
    }
    else if ("contextPresent" in item) {
        return [ item.contextPresent.type_ ];
    }
    else {
        return [];
    }
}

export
function getAttributeTypesFromFilter (filter: Filter): AttributeType[] {
    if ("item" in filter) {
        return getAttributeTypesFromFilterItem(filter.item);
    } else if ("and" in filter) {
        return filter.and.flatMap(getAttributeTypesFromFilter);
    } else if ("or" in filter) {
        return filter.or.flatMap(getAttributeTypesFromFilter);
    } else if ("not" in filter) {
        return getAttributeTypesFromFilter(filter.not);
    } else {
        return [];
    }
}

export default getAttributeTypesFromFilter;
