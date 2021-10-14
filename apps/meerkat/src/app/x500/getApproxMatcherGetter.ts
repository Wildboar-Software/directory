import type { Context } from "@wildboar/meerkat-types";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";

export
function getApproxMatcherGetter (
    ctx: Context,
): (attributeType: AttributeType) => EqualityMatcher | undefined {
    const ret = function (attributeType: AttributeType): EqualityMatcher | undefined {
        const spec = ctx.attributes.get(attributeType.toString());
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
