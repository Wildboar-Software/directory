import type { Context } from "@wildboar/meerkat-types";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";

/**
 * @summary Higher-order function that returns a naming matcher function if it can be determined
 * @description
 *
 * This higher-order function takes a context object and returns a function that
 * can be used to get a naming matcher function from an attribute type
 * object identifier. If such a matcher function cannot be determined for the
 * input type, the returned function returns `undefined`.
 *
 * "Naming matching" is a "pseudo-matching rule type" defined internall by
 * Meerkat DSA. The X.500 specifications forbid attribute types whose equality
 * matching rules use an assertion syntax that differs from the value syntax to
 * be used in naming. Hence, the matching rules that may be suitable for naming
 * are strictly a subset of the equality matching rules. Meerkat DSA handles
 * this discrepancy within this function.
 *
 * @param ctx The context object
 * @returns A function that takes an attrbute type and returns another function
 *  that can perform naming matching with an assertion and value encoded
 *  as `ASN1Element`s and return a `boolean` indicating whether they match, or
 *  `undefined` if such a function cannot be determined
 *
 * @function
 */
export
function getNamingMatcherGetter (
    ctx: Context,
): (attributeType: AttributeType) => EqualityMatcher | undefined {
    const ret = function (attributeType: AttributeType): EqualityMatcher | undefined {
        const spec = ctx.attributeTypes.get(attributeType.toString());
        if (!spec) {
            return undefined;
        }
        if (!spec.equalityMatchingRule) {
            if (spec.parent) { // Recurse into parent, searching for a potential equality matcher.
                return ret(spec.parent);
            } else {
                return undefined;
            }
        }
        const info = ctx.equalityMatchingRules.get(spec.equalityMatchingRule.toString());
        if (!info?.matcher) {
            return undefined;
        }
        if (!ctx.matchingRulesSuitableForNaming.has(info.id.toString())) {
            return undefined;
        }
        return info.matcher;
    };
    return ret;
}

export default getNamingMatcherGetter;
