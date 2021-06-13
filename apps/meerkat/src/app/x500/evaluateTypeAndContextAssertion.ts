import type { Context, StoredAttributeValueWithContexts } from "../types";
import type {
    TypeAndContextAssertion,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/TypeAndContextAssertion.ta";
import {
    id_oa_allAttributeTypes,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-allAttributeTypes.va";
import evaluateContextAssertion from "./evaluateContextAssertion";
import isAttributeSubtype from "./isAttributeSubtype";

const ALL_ATTR_TYPES: string = id_oa_allAttributeTypes.toString();

export
function evaluateTypeAndContextAssertion (
    ctx: Context,
    taca: TypeAndContextAssertion,
    attr: StoredAttributeValueWithContexts,
): boolean {
    if (
        !isAttributeSubtype(ctx, attr.id, taca.type_)
        && (taca.type_.toString() !== ALL_ATTR_TYPES)
    ) {
        return false;
    }
    if ("all" in taca.contextAssertions) {
        return taca.contextAssertions.all
            .every((ca): boolean => evaluateContextAssertion(ctx, ca, attr));
    } else if ("preference" in taca.contextAssertions) {
        // REVIEW: I _think_ this is fine. See X.511, Section 7.6.3.
        return taca.contextAssertions.preference
            .some((ca): boolean => evaluateContextAssertion(ctx, ca, attr));
    } else {
        return false; // FIXME: Not understood. What to do?
    }
}

export default evaluateTypeAndContextAssertion;
