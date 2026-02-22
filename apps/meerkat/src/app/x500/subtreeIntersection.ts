import {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import {
    SubtreeSpecification,
} from "@wildboar/x500/InformationFramework";
import {
    Refinement,
} from "@wildboar/x500/InformationFramework";
import isPrefix from "./isPrefix.js";
import { Context } from "../types/index.js";

/**
 * @summary Get a subtree specification that is the intersection of two subtrees
 * @description
 *
 * This function takes two subtree specifications and the distinguished names of
 * their roots and returns a single subtree specification that consitutes the
 * intersection of the aforementioned, as well as its root distinguished name.
 * If there is no intersection, `null` is returned.
 *
 * This function accounts for minimum, maximum, chops, base, and refinement.
 *
 * @param ctx The context object
 * @param a A subtree specification
 * @param b A subtree specification
 * @param a_root The context prefix of the first subtree specification
 * @param b_root The context prefix of the second subtree specification
 * @returns The subtree specification and the DN of the root of said subtree
 *  specification that constitutes of the intersection of the supplied subtrees,
 *  or `null` if there is no overlap.
 *
 * @function
 */
export
function subtreeIntersection (
    ctx: Context,
    a: SubtreeSpecification,
    b: SubtreeSpecification,
    a_root: DistinguishedName = [],
    b_root: DistinguishedName = [],
): [ SubtreeSpecification, DistinguishedName ] | null {
    const a_base_dn: DistinguishedName = [ ...a_root, ...(a.base ?? []) ];
    const b_base_dn: DistinguishedName = [ ...b_root, ...(b.base ?? []) ];
    const a_is_prefix = isPrefix(ctx, a_base_dn, b_base_dn);
    const b_is_prefix = isPrefix(ctx, b_base_dn, a_base_dn);
    if (!a_is_prefix && !b_is_prefix) {
        // If neither base is a prefix of each other, there is no overlap.
        return null;
    }
    const prefix_fqdn = a_is_prefix ? a_base_dn : b_base_dn;
    const inner_fqdn  = a_is_prefix ? b_base_dn : a_base_dn;

    const prefix_subtree = a_is_prefix ? a : b;
    const inner_subtree  = a_is_prefix ? b : a;

    // These need to be relative to the full Base DN so that they are comparable.
    const a_min = a_base_dn.length + Number(a.minimum ?? 0);
    const b_min = b_base_dn.length + Number(b.minimum ?? 0);
    const a_max = a_base_dn.length + Number(a.maximum ?? Number.MAX_SAFE_INTEGER);
    const b_max = b_base_dn.length + Number(b.maximum ?? Number.MAX_SAFE_INTEGER);

    // Get the globally strictest (largest) minimum.
    // then subtract the inner FQDN length to get the relative minimum.
    const minimum = Math.max(a_min, b_min) - inner_fqdn.length;
    const maximum = Math.min(a_max, b_max) - inner_fqdn.length;

    /* This should be >, not >=. Think about it: a minimum of 1 means the
    entries immediately below the base are included. A maximum of 1 means
    that the one RDN below the base is accepted (an inclusive bound). That
    means that there is overlap until minimum becomes 2 or more. */
    if (minimum > maximum) {
        // If minimum is greater than maximum, it means there is no "vertical"
        // overlap between the subtrees.
        return null;
    }

    // If any specific exclusion from the prefix subtree names the inner subtree, return null.
    // In addition, we adjust the specific exclusions to make them relative to the inner base.
    const prefix_specific_exclusions: SubtreeSpecification["specificExclusions"] = [];
    for (const spex of prefix_subtree.specificExclusions ?? []) {
        if ("chopBefore" in spex) {
            const chop_fqdn = [ ...prefix_fqdn, ...spex.chopBefore ];
            if (isPrefix(ctx, chop_fqdn, inner_fqdn)) {
                // If the chop excludes the whole intersection, return null.
                return null;
            }
            // We have to make sure the chop actually appears in the intersection still.
            if (isPrefix(ctx, inner_fqdn, chop_fqdn)) {
                const adjusted_chop = chop_fqdn.slice(inner_fqdn.length);
                if (adjusted_chop.length === 0) {
                    return null; // The whole intersection is excluded by a chop.
                }
                prefix_specific_exclusions.push({ chopBefore: adjusted_chop });
            }
        }
        else if ("chopAfter" in spex) {
            const chop_fqdn = [ ...prefix_fqdn, ...spex.chopAfter ];
            if (isPrefix(ctx, chop_fqdn, inner_fqdn.slice(0, -1))) {
                // If the chop excludes the whole intersection, return null.
                return null;
            }
            // We have to make sure the chop actually appears in the intersection still.
            if (isPrefix(ctx, inner_fqdn, chop_fqdn)) {
                const adjusted_chop = chop_fqdn.slice(inner_fqdn.length);
                prefix_specific_exclusions.push({ chopAfter: adjusted_chop });
            }
        }
        else {
            prefix_specific_exclusions.push(spex);
        }
    }

    const refinement: Refinement | undefined = a.specificationFilter && b.specificationFilter
        ? {
            and: [ // There may be duplicated conditions here, but that does not matter.
                a.specificationFilter,
                b.specificationFilter,
            ]
        }
        : a.specificationFilter ?? b.specificationFilter;
    const adjusted_specific_exclusions = [
        ...prefix_specific_exclusions, // The prefix subtree SEs can only be included after having been "re-based."
        ...inner_subtree.specificExclusions ?? [], // The inner subtree SEs can remain.
    ];
    
    return [
        new SubtreeSpecification(
            undefined,
            adjusted_specific_exclusions.length > 0
                ? adjusted_specific_exclusions
                : undefined,
            minimum === 0 ? undefined : minimum,
            maximum === Number.MAX_SAFE_INTEGER ? undefined : maximum,
            refinement,
        ),
        inner_fqdn,
    ];
}

export default subtreeIntersection;
