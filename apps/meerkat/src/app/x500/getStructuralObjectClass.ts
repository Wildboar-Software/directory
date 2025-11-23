import type { Context, IndexableOID } from "@wildboar/meerkat-types"
import { ObjectIdentifier, OBJECT_IDENTIFIER } from "@wildboar/asn1";
import { top } from "@wildboar/x500/InformationFramework";
import {
    ObjectClassKind_structural,
    ObjectClassKind_abstract,
} from "@wildboar/x500/InformationFramework";

/**
 * @summary Get the structural object class among a set of object classes
 * @description
 *
 * This function takes a set of object identifiers that refer to object classes
 * and identifies the structural object class among them.
 *
 * NOTE: There may only be one structural object class chain in an entry.
 *
 * @param ctx The context object
 * @param objectClasses An array of object identifiers of the object classes of
 *  the entry whose structural object class is sought
 * @returns An object identifier that identifies the structural object class of
 *  the entry
 *
 * @function
 */
export
function getStructuralObjectClass (
    ctx: Context,
    objectClasses: OBJECT_IDENTIFIER[],
): OBJECT_IDENTIFIER {
    const structural: Set<IndexableOID> = new Set();
    const abstract_: Set<IndexableOID> = new Set([ top["&id"].toString() ]);
    const parents: Set<IndexableOID> = new Set();
    for (const objectClass of objectClasses) {
        const OC: string = objectClass.toString();
        const spec = ctx.objectClasses.get(OC);
        if (!spec) {
            // We treat an unrecognized object class as invalid ALWAYS.
            return top["&id"];
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
        }
    }
    // The structural object class of the entry is the structural object class that is not the parent of any other.
    const soc = Array.from(structural).find((oc) => !parents.has(oc));
    return soc
        ? ObjectIdentifier.fromString(soc)
        : top["&id"];
}

export default getStructuralObjectClass;
