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

export
function loadContextTypes (ctx: Context): void {
    const contextTypes: [ CONTEXT, ContextMatcher ][] = [
        [ x500c.languageContext, evaluateLanguageContext ],
        [ x500c.ldapAttributeOptionContext, evaluateLDAPAttributeOptionContext ],
        [ x500c.localeContext, evaluateLocaleContext ],
        [ x500c.temporalContext, evaluateTemporalContext ],
    ];
    contextTypes
        .forEach(([ ct, matcher ]) => {
            ctx.contextTypes.set(ct["&id"].toString(), contextTypeFromInformationObject(ct, matcher));
        });
}

export default loadContextTypes;
