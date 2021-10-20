import type { Context } from "@wildboar/meerkat-types";
import type OrderingMatcher from "@wildboar/x500/src/lib/types/OrderingMatcher";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";

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
