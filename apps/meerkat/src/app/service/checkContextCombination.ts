import type { IndexableOID } from "../types/index.js";
import type { ContextAssertion } from "@wildboar/x500/InformationFramework";
import type { ContextCombination } from "@wildboar/x500/ServiceAdministration";

/**
 * @summary Validate context combinations
 * @description
 *
 * This function checks that context assertions are all present in a valid
 * combination. This is used to implememnt step 4 of the procedure defined in
 * [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
 * Section 15.2.
 *
 * @param contexts A mapping of string-form context type object identifiers to
 *  their context assertions
 * @param combo The constraining context combination
 * @param violations context combinations that have been violated
 * @returns Nothing. This function modifies `violations` by reference, adding
 *  offending context combinations as they are encountered.
 *
 * @function
 */
export
    function checkContextCombination(
        contexts: Map<IndexableOID, ContextAssertion>,
        combo: ContextCombination,
        violations: ContextCombination[]
    ): void {
    if ("context" in combo) {
        if (!contexts.has(combo.context.toString())) {
            violations.push(combo);
        }
    } else if ("and" in combo) {
        for (const sub of combo.and) {
            const subviolations: ContextCombination[] = [];
            checkContextCombination(contexts, sub, subviolations);
            if (subviolations.length !== 0) {
                violations.push(combo);
                return;
            }
        }
    } else if ("or" in combo) {
        for (const sub of combo.or) {
            const subviolations: ContextCombination[] = [];
            checkContextCombination(contexts, sub, subviolations);
            if (subviolations.length === 0) {
                return;
            }
        }
        violations.push(combo);
    } else if ("not" in combo) {
        const subviolations: ContextCombination[] = [];
        checkContextCombination(contexts, combo.not, subviolations);
        if (subviolations.length === 0) {
            violations.push(combo);
        }
    } else {
        violations.push(combo);
    }
}
