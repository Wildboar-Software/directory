import type { Context, ValueNormalizer } from "../types/index.js";
import { type EqualityMatcher } from "@wildboar/x500";
import type {
    AttributeType,
} from "@wildboar/x500/InformationFramework";

/**
 * @summary Higher-order function that returns a normalizer function if it can be determined
 * @description
 *
 * This higher-order function takes a context object and returns a function that
 * can be used to get a normalizer function from an attribute type
 * object identifier. If such a normalizer function cannot be determined for the
 * input type, the returned function returns `undefined`.
 *
 * @param ctx The context object
 * @returns A normalizer function
 *
 * @function
 */
export
function getEqualityNormalizer (
    ctx: Context,
): (attributeType: AttributeType) => ValueNormalizer | undefined {
    const ret = function (attributeType: AttributeType): ValueNormalizer | undefined {
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
        return info?.normalizer;
    };
    return ret;
}

export default getEqualityNormalizer;
