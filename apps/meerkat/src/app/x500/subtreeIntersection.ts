import {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import {
    Refinement,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Refinement.ta";
import isPrefix from "./isPrefix";
import { Context } from "@wildboar/meerkat-types";

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
    const prefix_dn = a_is_prefix ? a_base_dn : b_base_dn;
    const inner_dn  = a_is_prefix ? b_base_dn : a_base_dn;
    const root_dn   = a_is_prefix ? b_root    : a_root;

    const prefix_subtree = a_is_prefix ? a : b;
    const inner_subtree  = a_is_prefix ? b : a;

    // These need to be relative to the full Base DN so that they are comparable.
    const a_min = a_base_dn.length + Number(a.minimum ?? 0);
    const b_min = b_base_dn.length + Number(b.minimum ?? 0);
    const a_max = a_base_dn.length + Number(a.maximum ?? Number.MAX_SAFE_INTEGER);
    const b_max = b_base_dn.length + Number(b.maximum ?? Number.MAX_SAFE_INTEGER);

    // Theoretically, this shouldn't go negative, but we Math.max(..., 0) just to be sure.
    const minimum = Math.max(Math.max(a_min, b_min) - inner_dn.length, 0);
    const maximum = Math.min(a_max, b_max);

    // TODO: Should this be >=?
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
            const chop = [ ...prefix_dn, ...spex.chopBefore ];
            if (isPrefix(ctx, chop, inner_dn)) {
                return null;
            }
            if (isPrefix(ctx, inner_dn, chop)) {
                const adjusted_chop = chop.slice(inner_dn.length);
                prefix_specific_exclusions.push({
                    chopBefore: adjusted_chop,
                });
            }
        }
        else if ("chopAfter" in spex) {
            const chop = [ ...prefix_dn, ...spex.chopAfter ];
            const parent_dn = inner_dn.slice(0, -1);
            if ((parent_dn.length > 0) && isPrefix(ctx, chop, parent_dn)) {
                return null;
            }
            if (isPrefix(ctx, inner_dn, chop)) {
                const adjusted_chop = chop.slice(inner_dn.length);
                prefix_specific_exclusions.push({
                    chopBefore: adjusted_chop,
                });
            }
        }
        else {
            prefix_specific_exclusions.push(spex);
        }
    }


    // TODO: If the object class selection is innately incompatbile, return null.
    // This isn't totally necessary. You could just produce a subtree that yields no results.
    // if (a.specificationFilter && b.specificationFilter) {
    // }

    const refinement: Refinement | undefined = a.specificationFilter && b.specificationFilter
        ? {
            and: [ // There may be duplicated conditions here, but that does not matter.
                a.specificationFilter,
                b.specificationFilter,
            ]
        }
        : a.specificationFilter ?? b.specificationFilter;
    const adjusted_specific_exclusions = [
        ...inner_subtree.specificExclusions ?? [], // The inner subtree SEs can remain.
        ...prefix_specific_exclusions, // The prefix subtree SEs can only be included after having been "re-based."
    ];
    return [
        new SubtreeSpecification(
            inner_dn.slice(root_dn.length),
            adjusted_specific_exclusions.length > 0
                ? adjusted_specific_exclusions
                : undefined,
            minimum,
            maximum,
            refinement,
        ),
        root_dn,
    ];
}

export default subtreeIntersection;
