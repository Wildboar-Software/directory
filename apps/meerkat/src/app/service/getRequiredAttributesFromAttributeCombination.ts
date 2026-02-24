import { IndexableOID } from "../types/index.js";
import { AttributeCombination } from "@wildboar/x500/ServiceAdministration";

/**
 * @summary Extract the required attribute types from a attribute combination
 * @description
 *
 * This function extracts the required attribute types from a given attribute
 * combination and adds the string-form object identifiers for those attribute
 * types to the `ret` set.
 *
 * @param combo The attribute combination from which to extract required
 *  attribute types
 * @param non_negated {Boolean} Whether this iteration is for a filter item that
 *  is not negated
 * @param ret The set of object identifiers of attribute types that were found
 *  to be required
 * @returns Nothing. This function modifies `ret` by reference.
 *
 * @function
 */
export
    function getRequiredAttributesFromAttributeCombination(
        combo: AttributeCombination,
        non_negated: boolean,
        ret: Set<IndexableOID>
    ): void {
    if ("attribute" in combo) {
        non_negated && ret.add(combo.attribute.toString());
    } else if ("and" in combo) {
        // Required attributes are any required by any subfilter.
        for (const sub of combo.and) {
            getRequiredAttributesFromAttributeCombination(sub, non_negated, ret);
        }
    } else if ("or" in combo) {
        // Required attributes are those that are required by all subfilters.
        const subrets: Set<IndexableOID>[] = [];
        for (const sub of combo.or) {
            const subret: Set<IndexableOID> = new Set();
            getRequiredAttributesFromAttributeCombination(sub, non_negated, subret);
            subrets.push(subret);
        }
        if (subrets.length === 0) {
            return;
        }
        const first = subrets[0];
        for (const attr of first.values()) {
            for (const subret of subrets.slice(1)) {
                if (!subret.has(attr)) {
                    first.delete(attr);
                    break;
                }
            }
        }
        // These are the attributes that were required by every subfilter.
        for (const attr of first.values()) {
            ret.add(attr);
        }
    } else if ("not" in combo) {
        getRequiredAttributesFromAttributeCombination(combo.not, !non_negated, ret);
    }
}
