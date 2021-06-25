import type { Context } from "../types";
import { ObjectIdentifier, OBJECT_IDENTIFIER } from "asn1-ts";

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
        const attrInfo = ctx.attributes.get(CRIT_OID);
        if (!attrInfo) {
            return undefined;
        }
        crit = attrInfo.parent
            ? new ObjectIdentifier(attrInfo.parent.id.split(".").map((node) => Number.parseInt(node)))
            : null;
    } while (crit);
    return undefined;
}

export default isAttributeSubtype;
