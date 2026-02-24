import type { Context, IndexableOID } from "../types/index.js";
import { compareElements } from "@wildboar/x500";
import { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import { Filter } from "@wildboar/x500/DirectoryAbstractService";
import { ContextProfile } from "@wildboar/x500/ServiceAdministration";
import { ContextAssertion } from "@wildboar/x500/InformationFramework";

/**
 * @summary Identify any disallowed context types in a search filter
 * @description
 *
 * This function recurses into a search filter and identifies prohibited
 * context types, thereby implementing step 5 of the procedure described in
 * [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
 * Section 15.1.
 *
 * The `profiles` argument provides a mapping by string-form attribute type
 * object identifiers to another mapping of string-form context types to context
 * profiles (as found in search rules). This data structure is used to
 * efficiently look up the rules that apply for a given attribute type's
 * context types.
 *
 * @param ctx The context object
 * @param filter The filter to be checked for disallowed contexts
 * @param profiles A mapping of attribute types to maps of context types to
 *  context profiles provided by the search rule
 * @param violating_context_types A mutable set of string-form object
 *  identifiers of context types that were present and prohibited
 * @returns Nothing. This function modifies `violating_context_types` by
 *  reference.
 *
 * @function
 */
export function check_for_disallowed_contexts(
    ctx: Context,
    filter: Filter,
    profiles: Map<IndexableOID, Map<IndexableOID, ContextProfile>>,
    violating_context_types: Set<IndexableOID>): void {
    if ("item" in filter) {
        let type_oid: OBJECT_IDENTIFIER | undefined;
        let asserted_contexts: ContextAssertion[] | undefined;
        const item = filter.item;
        if ("equality" in item) {
            type_oid = item.equality.type_;
            if (item.equality.assertedContexts && ("selectedContexts" in item.equality.assertedContexts)) {
                asserted_contexts = item.equality.assertedContexts.selectedContexts;
            }
        }
        else if ("substrings" in item) {
            type_oid = item.substrings.type_;
        }
        else if ("greaterOrEqual" in item) {
            type_oid = item.greaterOrEqual.type_;
            if (item.greaterOrEqual.assertedContexts && ("selectedContexts" in item.greaterOrEqual.assertedContexts)) {
                asserted_contexts = item.greaterOrEqual.assertedContexts.selectedContexts;
            }
        }
        else if ("lessOrEqual" in item) {
            type_oid = item.lessOrEqual.type_;
            if (item.lessOrEqual.assertedContexts && ("selectedContexts" in item.lessOrEqual.assertedContexts)) {
                asserted_contexts = item.lessOrEqual.assertedContexts.selectedContexts;
            }
        }
        else if ("present" in item) {
            type_oid = item.present;
        }
        else if ("approximateMatch" in item) {
            type_oid = item.approximateMatch.type_;
            if (item.approximateMatch.assertedContexts
                && ("selectedContexts" in item.approximateMatch.assertedContexts)) {
                asserted_contexts = item.approximateMatch.assertedContexts.selectedContexts;
            }
        }
        else if ("extensibleMatch" in item) {
            type_oid = item.extensibleMatch.type_;
        }
        else if ("contextPresent" in item) {
            type_oid = item.contextPresent.type_;
        }
        if (!type_oid) {
            return;
        }

        const applicable_profiles = profiles.get(type_oid.toString());
        // If there are no context profiles for this type, we don't need to check anything.
        if (!applicable_profiles) {
            return;
        }
        for (const asserted of asserted_contexts ?? []) {
            const context_type = asserted.contextType.toString();
            const profile = applicable_profiles.get(context_type);
            if (!profile) { // If no profile, this context is not explicitly allowed.
                violating_context_types.add(context_type);
                continue;
            }
            // We don't check context values here. That is done in another procedure.
        }
    }
    else if ("and" in filter) {
        for (const sub of filter.and) {
            check_for_disallowed_contexts(ctx, sub, profiles, violating_context_types);
        }
    }
    else if ("or" in filter) {
        for (const sub of filter.or) {
            check_for_disallowed_contexts(ctx, sub, profiles, violating_context_types);
        }
    }
    else if ("not" in filter) {
        check_for_disallowed_contexts(ctx, filter.not, profiles, violating_context_types);
    }
}
