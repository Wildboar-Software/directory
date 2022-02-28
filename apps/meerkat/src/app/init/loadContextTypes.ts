import type { Context } from "@wildboar/meerkat-types";
import contextTypeFromInformationObject from "./contextTypeFromInformationObject";
import * as x500c from "@wildboar/x500/src/lib/collections/contexts";
import type {
    CONTEXT,
} from "@wildboar/x500/src/lib/modules/InformationFramework/CONTEXT.oca";
import type ContextMatcher from "@wildboar/x500/src/lib/types/ContextMatcher";
import {
    evaluateLanguageContext,
} from "@wildboar/x500/src/lib/matching/context/languageContext";
import {
    evaluateLDAPAttributeOptionContext,
} from "@wildboar/x500/src/lib/matching/context/ldapAttributeOptionContext";
import {
    evaluateLocaleContext,
} from "@wildboar/x500/src/lib/matching/context/localeContext";
import {
    evaluateTemporalContext,
} from "@wildboar/x500/src/lib/matching/context/temporalContext";

/**
 * @summary Initialize Meerkat DSA's internal index of known context types.
 * @description
 *
 * Initialize Meerkat DSA's internal index of known context types.
 *
 * @param ctx The context object
 *
 * @function
 */
export
function loadContextTypes (ctx: Context): void {
    const contextTypes: [ CONTEXT, ContextMatcher, string, string? ][] = [
        [ x500c.languageContext, evaluateLanguageContext, "LanguageContextSyntax" ],
        [ x500c.ldapAttributeOptionContext, evaluateLDAPAttributeOptionContext, "AttributeOptionList" ],
        [ x500c.localeContext, evaluateLocaleContext, "LocaleContextSyntax" ],
        [ x500c.temporalContext, evaluateTemporalContext, "TimeSpecification", "TimeAssertion" ],
    ];
    contextTypes
        .forEach(([ ct, matcher, valueSyntax, assertionSyntax ]) => {
            ctx.contextTypes.set(
                ct["&id"].toString(),
                contextTypeFromInformationObject(
                    ct,
                    matcher,
                    valueSyntax,
                    assertionSyntax,
                ),
            );
        });
}

export default loadContextTypes;
