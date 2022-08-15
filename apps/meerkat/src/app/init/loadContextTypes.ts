import type { Context } from "@wildboar/meerkat-types";
import { BERElement, ObjectIdentifier, TRUE } from "asn1-ts";
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
import compareElements from "@wildboar/x500/src/lib/comparators/compareElements";
import {
    dl_administrator_annotation,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/dl-administrator-annotation.oa";
import {
    dl_nested_dl,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/dl-nested-dl.oa";
import {
    dl_reset_originator,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/dl-reset-originator.oa";
import { evaluateDLAdministratorAnnotationContext } from "../matching/context/dl-administrator-annotation";

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
async function loadContextTypes (ctx: Context): Promise<void> {
    const contextTypes: [ CONTEXT, ContextMatcher, string, string? ][] = [
        [ x500c.languageContext, evaluateLanguageContext, "LanguageContextSyntax" ],
        [ x500c.ldapAttributeOptionContext, evaluateLDAPAttributeOptionContext, "AttributeOptionList" ],
        [ x500c.localeContext, evaluateLocaleContext, "LocaleContextSyntax" ],
        [ x500c.temporalContext, evaluateTemporalContext, "TimeSpecification", "TimeAssertion" ],
        [
            dl_administrator_annotation,
            evaluateDLAdministratorAnnotationContext,
            "CHOICE {bmpstring BMPString, universalstring UniversalString}",
        ],
        [ dl_nested_dl, () => true, "NULL" ],
        [ dl_reset_originator, () => true, "NULL" ],
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

    const cts = await ctx.db.contextDescription.findMany({
        where: {
            entry_id: null,
        },
    });
    for (const ct of cts) {
        ctx.contextTypes.set(ct.identifier, {
            id: ObjectIdentifier.fromString(ct.identifier),
            name: ct.name?.split("|"),
            description: ct.description ?? undefined,
            obsolete: ct.obsolete,
            /**
             * For some reason, you cannot specify ABSENT-MATCH in
             * `ContextDescription`.
             */
            absentMatch: ct.absentMatch,
            /**
             * ...you also cannot specify a DEFAULT-VALUE.
             */
            defaultValue: ct.defaultValue
                ? () => {
                    const el = new BERElement();
                    el.fromBytes(ct.defaultValue!);
                    return el;
                }
                : undefined,
            validator: undefined,
            syntax: ct.syntax,
            assertionSyntax: ct.assertionSyntax ?? undefined,
            matcher: compareElements, // FIXME:
        });
    }
}

export default loadContextTypes;
