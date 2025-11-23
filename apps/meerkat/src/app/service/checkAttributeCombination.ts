import { AttributeCombination } from "@wildboar/x500/ServiceAdministration";
import { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import { Filter } from "@wildboar/x500/DirectoryAbstractService";

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
    if (("item" in filter) && ("attribute" in combo)) {
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
        if (!type_oid || !type_oid.isEqualTo(combo.attribute)) {
            violations.push(combo);
            return;
        }
    } else if (("and" in filter) && ("and" in combo)) {
        if (filter.and.length !== combo.and.length) {
            violations.push(combo);
            return;
        }
        /* TODO:
            Yes this is an O^2 comparison, but its max size is constrained
            by the search filter, which the administrators control. In the long
            run, maybe you can create an algorithm to pre-sort filters and
            combinations, which should solve this.
        */
        for (const subcombo of combo.and) {
            let matched: boolean = false;
            for (const subfilter of filter.and) {
                const subviolations: AttributeCombination[] = [];
                checkAttributeCombination(subfilter, subcombo, non_negated, subviolations);
                if (subviolations.length === 0) {
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                violations.push(combo);
                return;
            }
        }
    } else if (("or" in filter) && ("or" in combo)) {
        if (filter.or.length !== combo.or.length) {
            violations.push(combo);
            return;
        }
        /* TODO:
            Yes this is an O^2 comparison, but its max size is constrained
            by the search filter, which the administrators control. In the long
            run, maybe you can create an algorithm to pre-sort filters and
            combinations, which should solve this.
        */
        for (const subcombo of combo.or) {
            let matched: boolean = false;
            for (const subfilter of filter.or) {
                const subviolations: AttributeCombination[] = [];
                checkAttributeCombination(subfilter, subcombo, non_negated, subviolations);
                if (subviolations.length === 0) {
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                violations.push(combo);
                return;
            }
        }
    } else if (("not" in filter) && ("not" in combo)) {
        checkAttributeCombination(filter.not, combo.not, !non_negated, violations);
    } else {
        violations.push(combo);
    }
}
