import type { Context, IndexableOID } from "@wildboar/meerkat-types";
import type { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import {
    ObjectClassKind_structural,
    ObjectClassKind_abstract,
    ObjectClassKind_auxiliary,
} from "@wildboar/x500/InformationFramework";
import { top } from "@wildboar/x500/InformationFramework";
import getAncestorObjectClasses from "./getAncestorObjectClasses";

/**
 * @summary Determine whether a group of object classes are invalid
 * @description
 *
 * This function returns `true` if the object classes given by the
 * `objectClasses` argument are valid. They can be invalid if there are multiple
 * structural object class chains, auxiliary object classes missing a
 * superclass, or merely if there is an unrecognized object class.
 *
 * @param ctx The context object
 * @param objectClasses The object identifiers of the object classes that are to be validated together
 * @returns A boolean indicating whether the group of object classes are valid
 *
 * @function
 */
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
    for (const structuralMember of chain) {
        const MEMBER: string = structuralMember.toString();
        if (!structural.has(MEMBER) && !abstract_.has(MEMBER)) {
            return false;
        }
    }
    for (const s of structural.values()) {
        if (!chainIndex.has(s)) {
            return false; // There is an extraneous structural class outside of the chain.
        }
    }
    for (const a of auxiliary.values()) {
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
    /**
     * Object class kind `abstract` is not just used for inheritance. It can be
     * used for computed classes, among which `parent` is an example
     * specifically named in ITU Recommendation X.501:
     *
     * > In addition to its use for deriving other object classes, an abstract
     * > object class value can be a derived value; that is, its presence is
     * > computed or inferred by the Directory. For example, the parent object
     * > class value for a particular entry is computed or inferred from the
     * > presence of a family member, of auxiliary object class child,
     * > immediately subordinate to the entry.
     *
     * I removed this check because entries having class `parent` were failing
     * validation because the abstract class `parent` was not used as a
     * superclass.
     */
    // for (const a of abstract_.values()) {
    //     if (!parents.has(a)) {
    //         return false; // We have an abstract class that is not the parent of another class present.
    //     }
    // }
    return true;
}

export default validateObjectClasses;
