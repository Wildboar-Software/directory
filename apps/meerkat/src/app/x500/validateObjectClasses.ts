import type { Context, IndexableOID } from "@wildboar/meerkat-types";
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import {
    ObjectClassKind_structural,
    ObjectClassKind_abstract,
    ObjectClassKind_auxiliary,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
import getAncestorObjectClasses from "./getAncestorObjectClasses";

export
function validateObjectClasses (
    ctx: Context,
    objectClasses: OBJECT_IDENTIFIER[],
): boolean {
    const structural: Set<IndexableOID> = new Set();
    const abstract_: Set<IndexableOID> = new Set([ top["&id"].toString() ]);
    const auxiliary: Set<IndexableOID> = new Set();
    const parents: Set<IndexableOID> = new Set();
    for (const objectClass of objectClasses) {
        const OC: string = objectClass.toString();
        const spec = ctx.objectClasses.get(OC);
        if (!spec) {
            // We treat an unrecognized object class as invalid ALWAYS.
            return false;
        }
        switch (spec.kind) {
        case (ObjectClassKind_structural):
            structural.add(OC);
            Array.from(spec.superclasses).forEach((sc) => parents.add(sc));
            break;
        case (ObjectClassKind_abstract):
            abstract_.add(OC);
            Array.from(spec.superclasses).forEach((sc) => parents.add(sc));
            break;
        case (ObjectClassKind_auxiliary):
            auxiliary.add(OC);
            break;
        }
    }
    // The structural object class of the entry is the structural object class that is not the parent of any other.
    const soc = Array.from(structural).find((oc) => !parents.has(oc));
    if (!soc) {
        return false;
    }
    const chain = getAncestorObjectClasses(ctx, soc);
    const chainIndex: Set<IndexableOID> = new Set(chain);
    chainIndex.add(soc);
    for (const structuralMember of chain) {
        const MEMBER: string = structuralMember.toString();
        if (!structural.has(MEMBER) && !abstract_.has(MEMBER)) {
            return false;
        }
    }
    for (const s of structural) {
        if (!chainIndex.has(s)) {
            return false; // There is an extraneous structural class outside of the chain.
        }
    }
    for (const a of auxiliary) {
        const achain = getAncestorObjectClasses(ctx, a);
        for (const achainMember of achain) {
            if (
                !auxiliary.has(achainMember)
                && !abstract_.has(achainMember)
            ) {
                return false; // We have an auxiliary OC that is missing an ancestor.
            }
        }
    }
    for (const a of abstract_) {
        if (!parents.has(a)) {
            return false; // We have an abstract class that is not the parent of another class present.
        }
    }
    return true;
}

export default validateObjectClasses;
