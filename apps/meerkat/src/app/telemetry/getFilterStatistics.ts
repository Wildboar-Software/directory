import type {
    FilterStatistics,
    FilterItemStatistics,
    FilterItemSubstringsStatistics,
    MatchingRuleAssertionStatistics,
    AttributeTypeAssertionStatistics,
} from "../types";
import type { Filter } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Filter.ta";
import type { FilterItem } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FilterItem.ta";
import type { FilterItem_substrings } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FilterItem-substrings.ta";
import type { MatchingRuleAssertion } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/MatchingRuleAssertion.ta";
import type { AttributeTypeAssertion } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAssertion.ta";
import getStatisticsFromAttributeValueAssertion from "./getStatisticsFromAttributeValueAssertion";

function getMatchingRuleAssertionStatistics (mra: MatchingRuleAssertion): MatchingRuleAssertionStatistics {
    return {
        type: mra.type_?.toString(),
        matchingRule: mra.matchingRule?.map((mr) => mr.toString()),
        dnAttributes: mra.dnAttributes,
    };
}

function getFilterItemSubstringsStatistics (fis: FilterItem_substrings): FilterItemSubstringsStatistics {
    return {
        type: fis.type_.toString(),
        strings: fis.strings.map((str) => {
            if ("initial" in str) {
                return {
                    type: "initial",
                };
            } else if ("any" in str) {
                return {
                    type: "any",
                };
            } else if ("final" in str) {
                return {
                    type: "final",
                };
            } else if ("control" in str) {
                return {
                    type: "control",
                    controlType: str.control.type_.toString(),
                };
            } else {
                return {
                    type: "other",
                };
            }
        }),
    };
}

function getAttributeTypeAssertionStatistics (ata: AttributeTypeAssertion): AttributeTypeAssertionStatistics {
    return {
        type: ata.type_.toString(),
        assertionContexts: ata.assertedContexts?.map((ac) => ({
            contextType: ac.contextType.toString(),
            contextValuesLength: ac.contextValues.length,
        })),
    };
}


function getFilterItemStatistics (fi: FilterItem): FilterItemStatistics {
    if ("equality" in fi) {
        return {
            equality: getStatisticsFromAttributeValueAssertion(fi.equality),
        };
    }
    else if ("substrings" in fi) {
        return {
            substrings: getFilterItemSubstringsStatistics(fi.substrings),
        };
    }
    else if ("greaterOrEqual" in fi) {
        return {
            greaterOrEqual: getStatisticsFromAttributeValueAssertion(fi.greaterOrEqual),
        };
    }
    else if ("lessOrEqual" in fi) {
        return {
            lessOrEqual: getStatisticsFromAttributeValueAssertion(fi.lessOrEqual),
        };
    }
    else if ("present" in fi) {
        return {
            present: fi.present.toString(),
        };
    }
    else if ("approximateMatch" in fi) {
        return {
            approximateMatch: getStatisticsFromAttributeValueAssertion(fi.approximateMatch),
        };
    }
    else if ("extensibleMatch" in fi) {
        return {
            extensibleMatch: getMatchingRuleAssertionStatistics(fi.extensibleMatch),
        };
    }
    else if ("contextPresent" in fi) {
        return {
            contextPresent: getAttributeTypeAssertionStatistics(fi.contextPresent),
        };
    }
    else {
        return {
            other: null,
        };
    }
}

export
function getFilterStatistics (filter: Filter): FilterStatistics {
    if ("and" in filter) {
        return {
            and: filter.and.map((sub) => getFilterStatistics(sub)),
        };
    } else if ("or" in filter) {
        return {
            or: filter.or.map((sub) => getFilterStatistics(sub)),
        };
    } else if ("not" in filter) {
        return {
            not: getFilterStatistics(filter.not),
        };
    } else if ("item" in filter) {
        return {
            item: getFilterItemStatistics(filter.item),
        };
    } else {
        return {
            other: null,
        };
    }
}

export default getFilterStatistics;
