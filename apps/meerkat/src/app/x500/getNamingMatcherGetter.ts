import type { Context } from "../types";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";

export
function getNamingMatcherGetter (
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
