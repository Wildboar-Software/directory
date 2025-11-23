import type { Context, IndexableOID } from "@wildboar/meerkat-types";
import { type EqualityMatcher } from "@wildboar/x500";
import type {
    AttributeType,
} from "@wildboar/x500/InformationFramework";
import { OBJECT_IDENTIFIER } from "@wildboar/asn1";

/**
 * @summary Higher-order function that returns an equality matcher function if it can be determined
 * @description
 *
 * This higher-order function takes a context object and returns a function that
 * can be used to get an equality matcher function from an attribute type
 * object identifier. If such a matcher function cannot be determined for the
 * input type, the returned function returns `undefined`.
 *
 * @param ctx The context object
 * @returns A function that takes an attrbute type and returns another function
 *  that can perform equality matching with an assertion and value encoded
 *  as `ASN1Element`s and return a `boolean` indicating whether they match, or
 *  `undefined` if such a function cannot be determined
 *
 * @function
 */
export
function getEqualityMatcherGetter (
    ctx: Context,
    substitutions?: Map<IndexableOID, OBJECT_IDENTIFIER>,
): (attributeType: AttributeType) => EqualityMatcher | undefined {
    const ret = function (attributeType: AttributeType): EqualityMatcher | undefined {
        const attr_oid = attributeType.toString();
        const spec = ctx.attributeTypes.get(attr_oid);
        if (!spec) {
            return undefined;
        }
        const mr_oid = substitutions?.get(attr_oid) ?? spec.equalityMatchingRule;
        if (!mr_oid) {
            if (spec.parent) { // Recurse into parent, searching for a potential equality matcher.
                return ret(spec.parent);
            } else {
                return undefined;
            }
        }

        const info = ctx.equalityMatchingRules.get(mr_oid.toString());
        if (!info?.matcher) {
            return undefined;
        }
        return info.matcher;
    };
    return ret;
}

export default getEqualityMatcherGetter;
