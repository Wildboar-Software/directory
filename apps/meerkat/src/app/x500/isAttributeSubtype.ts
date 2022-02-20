import type { Context } from "@wildboar/meerkat-types";
import type { OBJECT_IDENTIFIER } from "asn1-ts";

// REVIEW: This looks like it is incorrect...
/**
 * @summary Determine whether an attribute type is a subtype of another
 * @description
 *
 * This function takes a `candidate` and `criterion` object identifier that
 * identifies an attribute type an returns a truthy value if the `candidate`
 * attribute type is a subtype of the `criterion` attribute type.
 *
 * @param ctx The context object
 * @param candidate The object identifier of attribute type that is in question
 * @param criterion The potential supertype of the `candidate` attribute type
 * @returns
 *
 * @function
 */
export
function isAttributeSubtype (
    ctx: Context,
    candidate: OBJECT_IDENTIFIER,
    criterion: OBJECT_IDENTIFIER,
): OBJECT_IDENTIFIER | undefined {
    const cand: string = candidate.toString();
    let crit: OBJECT_IDENTIFIER | null = criterion;
    do {
        const CRIT_OID: string = crit.toString();
        if (cand === CRIT_OID) {
            return crit;
        }
        const attrInfo = ctx.attributeTypes.get(CRIT_OID);
        if (!attrInfo) {
            return undefined;
        }
        crit = attrInfo.parent
            ? attrInfo.parent
            : null;
    } while (crit);
    return undefined;
}

export default isAttributeSubtype;
