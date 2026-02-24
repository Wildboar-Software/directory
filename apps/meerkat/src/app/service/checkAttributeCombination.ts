import type { AttributeCombination } from "@wildboar/x500/ServiceAdministration";
import type { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import type { Filter } from "@wildboar/x500/DirectoryAbstractService";
import type { AttributeType } from "@wildboar/x500/InformationFramework";

// TODO: Limit recursion depth.
function checkRequiredAttributeInFilter(
    filter: Filter,
    non_negated: boolean,
    attribute: AttributeType,
): boolean {
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
        return non_negated === !!(type_oid && type_oid.isEqualTo(attribute));
    } else if ("and" in filter) {
        // Match if any subfilter requires the attribute.
        return filter.and.some((subfilter) => checkRequiredAttributeInFilter(subfilter, non_negated, attribute));
    } else if ("or" in filter) {
        // Match if all subfilters require the attribute.
        return filter.or.every((subfilter) => checkRequiredAttributeInFilter(subfilter, non_negated, attribute));
    } else if ("not" in filter) {
        // TODO: Document this.
        /* I'm not sure how to interpret this case: does a not in the combination
        mean that we have to proactively ensure that any negated attributes do
        NOT appear, or do we merely check that the subcombination is not met?
        
        These are two slightly different interpretations. In the latter case, I
        think, there is no way to exclude an attribute from matching; as such,
        I went with the former case. */
        return checkRequiredAttributeInFilter(filter.not, !non_negated, attribute);
    }
    return true;
}


/**
 * @summary Check attribute combinations in a search filter
 * @description
 *
 * This function validates a search filter according to an
 * `attributeCombination` imposed by a governing search rule, thereby
 * implementing step 3 of the procedure defined in
 * [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
 * Section 15.1. As combinations are violated, they are added to the
 * `violations` array, which the callee is expected to check once this function
 * returns.
 *
 * @param filter The search filter to be validated
 * @param combo The attribute combination permitted
 * @param non_negated Whether the current attribute combination is negated
 * @param violations A mutable array of violating combinations
 * @returns Nothing. This function modifies `violations` by reference.
 *
 * @function
 */
export
    function checkAttributeCombination(
        filter: Filter,
        combo: AttributeCombination,
        non_negated: boolean,
        violations: AttributeCombination[]
    ): void {
    if ("attribute" in combo) {
        if (!checkRequiredAttributeInFilter(filter, non_negated, combo.attribute)) {
            violations.push(combo);
            return;
        }
    } else if ("and" in combo) {
        let matched: boolean = true;
        for (const subcombo of combo.and) {
            const subviolations: AttributeCombination[] = [];
            checkAttributeCombination(filter, subcombo, non_negated, subviolations);
            if (subviolations.length > 0) {
                matched = false;
                break;
            }
        }
        if (!matched) {
            violations.push(combo);
            return;
        }
    } else if ("or" in combo) {
        let matched: boolean = false;
        for (const subcombo of combo.or) {
            const subviolations: AttributeCombination[] = [];
            checkAttributeCombination(filter, subcombo, non_negated, subviolations);
            if (subviolations.length === 0) {
                matched = true;
                break;
            }
        }
        if (!matched) {
            violations.push(combo);
            return;
        }
    } else if ("not" in combo) {
        checkAttributeCombination(filter, combo.not, !non_negated, violations);
    } else {
        violations.push(combo);
    }
}
