import type { Context } from "@wildboar/meerkat-types";
import type OrderingMatcher from "@wildboar/x500/src/lib/types/OrderingMatcher";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";

/**
 * @summary Higher-order function that returns an ordering matcher function if it can be determined
 * @description
 *
 * This higher-order function takes a context object and returns a function that
 * can be used to get an ordering matcher function from an attribute type
 * object identifier. If such a matcher function cannot be determined for the
 * input type, the returned function returns `undefined`.
 *
 * @param ctx The context object
 * @returns A function that takes an attrbute type and returns another function
 *  that can perform ordering matching with an assertion and value encoded
 *  as `ASN1Element`s and return a `boolean` indicating whether they match, or
 *  `undefined` if such a function cannot be determined
 *
 * @function
 */
export
function getOrderingMatcherGetter (
    ctx: Context,
): (attributeType: AttributeType) => OrderingMatcher | undefined {
    const ret = function (attributeType: AttributeType): OrderingMatcher | undefined {
        const spec = ctx.attributeTypes.get(attributeType.toString());
        if (!spec) {
            return undefined;
        }
        if (!spec.orderingMatchingRule) {
            if (spec.parent) { // Recurse into parent, searching for a potential equality matcher.
                return ret(spec.parent);
            } else {
                return undefined;
            }
        }
        const info = ctx.orderingMatchingRules.get(spec.orderingMatchingRule.toString());
        if (!info?.matcher) {
            return undefined;
        }
        return info.matcher;
    };
    return ret;
}

export default getOrderingMatcherGetter;
