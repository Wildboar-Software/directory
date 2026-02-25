import type { IndexableOID } from "../types/index.js";
import type { ContextCombination } from "@wildboar/x500/ServiceAdministration";

/**
 * @summary Extract the required context types from a context combination
 * @description
 *
 * This function extracts the required context types from a given context
 * combination and adds the string-form object identifiers for those context
 * types to the `ret` set.
 *
 * @param combo The context combination from which to extract required contexts
 * @param non_negated {Boolean} Whether this iteration is being called from a negated
 *  filter item
 * @param ret The set of object identifiers of context types that were found
 *  to be required
 * @returns Nothing. This function modifies `ret` by reference.
 *
 * @function
 */
export
    function getRequiredContextsFromContextCombination(
        combo: ContextCombination,
        non_negated: boolean,
        ret: Set<IndexableOID>
    ): void {
    if ("context" in combo) {
        non_negated && ret.add(combo.context.toString());
    } else if ("and" in combo) {
        // Required attributes are any required by any subfilter.
        for (const sub of combo.and) {
            getRequiredContextsFromContextCombination(sub, non_negated, ret);
        }
    } else if ("or" in combo) {
        if (combo.or.length > 100) {
            // This is a heuristic to prevent denial-of-service, because the
            // algorithm below has bad time complexity, and it sounds like
            // there is no efficient way to do this.
            return;
        }
        // Required attributes are those that are required by all subfilters.
        const subrets: Set<IndexableOID>[] = [];
        for (const sub of combo.or) {
            const subret: Set<IndexableOID> = new Set();
            getRequiredContextsFromContextCombination(sub, non_negated, subret);
            subrets.push(subret);
        }
        if (subrets.length === 0) {
            return;
        }
        subrets.sort((a, b) => a.size - b.size);
        const [smallest, ...rest] = subrets;

        outer:
        for (const value of smallest.values()) {
            for (const set of rest) {
                if (!set.has(value)) {
                    continue outer;
                }
            }
            ret.add(value);
        }
    } else if ("not" in combo) {
        getRequiredContextsFromContextCombination(combo.not, !non_negated, ret);
    }
}
