import type { Context } from "@wildboar/meerkat-types";
import type SubstringsMatcher from "@wildboar/x500/src/lib/types/SubstringsMatcher";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";

export
function getSubstringsMatcherGetter (
    ctx: Context,
): (attributeType: AttributeType) => SubstringsMatcher | undefined {
    const ret = function (attributeType: AttributeType): SubstringsMatcher | undefined {
        const spec = ctx.attributeTypes.get(attributeType.toString());
        if (!spec) {
            return undefined;
        }
        if (!spec.substringsMatchingRule) {
            if (spec.parent) { // Recurse into parent, searching for a potential equality matcher.
                return ret(spec.parent);
            } else {
                return undefined;
            }
        }
        const info = ctx.substringsMatchingRules.get(spec.substringsMatchingRule.toString());
        if (!info?.matcher) {
            return undefined;
        }
        return info.matcher;
    };
    return ret;
}

export default getSubstringsMatcherGetter;
