import type { Context, IndexableOID } from "../types"
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
import {
    ObjectClassKind_structural,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";

const MAX_ITERATIONS: number = 100;

/**
 * NOTE: There may only be one structural object class chain in an entry.
 *
 * @param ctx
 * @param objectClasses
 * @returns
 */
export
function getStructuralObjectClass (
    ctx: Context,
    objectClasses: OBJECT_IDENTIFIER[],
): OBJECT_IDENTIFIER {
    let i: number = 0;
    let parent: OBJECT_IDENTIFIER | undefined = top["&id"];
    while (parent && (i < MAX_ITERATIONS)) {
        i++;
        const PARENT_OC: string = parent.toString();
        for (const oc of objectClasses) {
            const spec = ctx.objectClasses.get(oc.toString());
            if (
                (spec?.kind === ObjectClassKind_structural)
                && (spec.superclasses.has(PARENT_OC))
            ) {
                parent = spec.id;
                break;
            }
        }
    }
    return parent;
}

export default getStructuralObjectClass;
