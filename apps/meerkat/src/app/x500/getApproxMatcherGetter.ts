import type { Context } from "../types/index.js";
import { type EqualityMatcher } from "@wildboar/x500";
import type {
    AttributeType,
} from "@wildboar/x500/InformationFramework";

/**
 * @summary Higher-order function that returns an approximate matcher function if it can be determined
 * @description
 *
 * This higher-order function takes a context object and returns a function that
 * can be used to get an approximate matcher function from an attribute type
 * object identifier. If such a matcher function cannot be determined for the
 * input type, the returned function returns `undefined`.
 *
 * If an approximate matcher cannot be determined, this function attempts to
 * return the equality matcher.
 *
 * @param ctx The context object
 * @returns A function that takes an attrbute type and returns another function
 *  that can perform approximate matching with an assertion and value encoded
 *  as `ASN1Element`s and return a `boolean` indicating whether they match, or
 *  `undefined` if such a function cannot be determined
 *
 * @function
 */
export
function getApproxMatcherGetter (
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
        const MR_OID: string = spec.equalityMatchingRule.toString();
        const approxMatcher = ctx.approxMatchingRules.get(MR_OID);
        if (approxMatcher) {
            return approxMatcher;
        }
        const info = ctx.equalityMatchingRules.get(MR_OID);
        if (!info?.matcher) {
            return undefined;
        }
        return info.matcher;
    };
    return ret;
}

export default getApproxMatcherGetter;
