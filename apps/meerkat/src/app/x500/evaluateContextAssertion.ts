import type { Context, StoredAttributeValueWithContexts } from "../types";
import type {
    ContextAssertion,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ContextAssertion.ta";

/**
 * @deprecated
 */
export
function evaluateContextAssertion (
    ctx: Context,
    assertion: ContextAssertion,
    value: StoredAttributeValueWithContexts,
): boolean {
    const CONTEXT_ID: string = assertion.contextType.toString();
    const matcher = ctx.contextMatchers.get(CONTEXT_ID);
    if (!matcher) {
        return true; // FIXME: What to do here?
    }
    const contexts = value.contexts.get(CONTEXT_ID);

    // A ContextAssertion is true for a particular attribute value if:
    // ...the attribute value contains no contexts of the asserted contextType
    if (!contexts) {
        return true;
    }

    return assertion.contextValues
        // any of the stored contextValues of that context...
        // matches with any of the asserted contextValues.
        .some((assertion): boolean => {
            return contexts.values
                .some((c): boolean => matcher(assertion, c));
        });
}

export default evaluateContextAssertion;

