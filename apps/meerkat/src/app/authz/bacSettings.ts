import type { EvaluateFilterSettings } from "@wildboar/x500/src/lib/utils/evaluateFilter";
import ctx from "../ctx";
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import type ContextMatcher from "@wildboar/x500/src/lib/types/ContextMatcher";
import getEqualityMatcherGetter from "../x500/getEqualityMatcherGetter";
import getOrderingMatcherGetter from "../x500/getOrderingMatcherGetter";
import getSubstringsMatcherGetter from "../x500/getSubstringsMatcherGetter";
import getApproxMatcherGetter from "../x500/getApproxMatcherGetter";
import getAttributeSubtypes from "../x500/getAttributeSubtypes";

/**
 * @summary A pre-assembled argument to bacACDF()
 * @description
 *
 * The `bacACDF()` function exposed by the `@wildboar/x500` package takes an
 * `EvaluateFilterSettings` object as a parameter. Creating this object is
 * pretty complicated, but this object is not mutated by this function, so there
 * is no reason that we could not assemble this argument one time and re-use it
 * many times. That's what this is: a pre-assembled argument.
 *
 * @constant
 */
export
const bacSettings: EvaluateFilterSettings = {
    getEqualityMatcher: getEqualityMatcherGetter(ctx),
    getOrderingMatcher: getOrderingMatcherGetter(ctx),
    getSubstringsMatcher: getSubstringsMatcherGetter(ctx),
    getApproximateMatcher: getApproxMatcherGetter(ctx),
    getContextMatcher: (contextType: OBJECT_IDENTIFIER): ContextMatcher | undefined => {
        return ctx.contextTypes.get(contextType.toString())?.matcher;
    },
    determineAbsentMatch: (contextType: OBJECT_IDENTIFIER): boolean => {
        return ctx.contextTypes.get(contextType.toString())?.absentMatch ?? true;
    },
    isMatchingRuleCompatibleWithAttributeType: (mr: OBJECT_IDENTIFIER, at: OBJECT_IDENTIFIER): boolean => {
        return !!ctx.attributeTypes.get(at.toString())?.compatibleMatchingRules.has(mr.toString());
    },
    isAttributeSubtype: (attributeType: OBJECT_IDENTIFIER, parentType: OBJECT_IDENTIFIER): boolean => {
        return (
            attributeType.isEqualTo(parentType)
            || getAttributeSubtypes(ctx, parentType).some((st) => st.isEqualTo(attributeType))
        );
    },
    getFriends: (): OBJECT_IDENTIFIER[] => [],
    permittedToMatch: (): boolean => true,
    performExactly: false,
    matchedValuesOnly: false,
    dnAttribute: false,
};

export default bacSettings;
