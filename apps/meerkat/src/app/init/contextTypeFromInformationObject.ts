import type { ContextTypeInfo } from "@wildboar/meerkat-types";
import { ASN1Element, TRUE } from "asn1-ts";
import type ContextMatcher from "@wildboar/x500/src/lib/types/ContextMatcher";
import type {
    CONTEXT,
} from "@wildboar/x500/src/lib/modules/InformationFramework/CONTEXT.oca";

/**
 * @summary Convert a `CONTEXT` information object into `ContextTypeInfo`.
 * @description
 *
 * Converts a `CONTEXT` information object into `ContextTypeInfo`.
 *
 * @param io The `CONTEXT` information object, as produced by the Wildboar
 *  ASN.1 compiler.
 * @param matcher A function that takes two ASN.1 elements, the first being of
 *  the context's assertion syntax, and the second being of the context's value
 *  syntax, and which returns a `boolean` if the value matches the assertion per
 *  the matching rules innate to the context type.
 * @param syntax The ASN.1 syntax of the context type.
 * @returns An `ContextTypeInfo` as used by Meerkat DSA's internal index of known
 *  context types.
 *
 * @function
 */
export
function contextTypeFromInformationObject (io: CONTEXT, matcher: ContextMatcher, syntax?: string): ContextTypeInfo {
    return {
        id: io["&id"],
        absentMatch: io["&absentMatch"] ?? TRUE,
        matcher,
        syntax: syntax ?? "", // FIXME: You need two syntaxes. One for values and one for assertions. See ITU Recommendation X.501, Section 15.7.10.
        validator: io.decoderFor["&Type"]
            ? (value: ASN1Element) => io.decoderFor["&Type"]!(value)
            : undefined,
    };
}

export default contextTypeFromInformationObject;
