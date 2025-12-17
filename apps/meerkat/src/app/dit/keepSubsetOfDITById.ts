import type {
    Vertex,
    DIT,
    IndexableOID,
} from "../types/index.js";
import { strict as assert } from "assert";

/**
 * @summary Keep a subset of a tree of entries by their database ID
 * @description
 *
 * This function takes a subtree of vertices and returns a new subtree of
 * vertices whose members are exclusively those vertices whose IDs are present
 * in the `idsToKeep` set, with the exception of the case where the inclusion of
 * the root of the DIT is necessary to include two or more subordinates which
 * are themselves included by this selection, as described in
 * [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
 * Section 7.7.2.
 *
 * NOTE: This was made for producing the `family-information` attribute, which
 * is precisely such a subtree of entries.
 *
 * @param dit The root of some subset of the DIT
 * @param idsToKeep The set of database IDs of entries to keep from the DIT
 *  given by the `dit` parameter
 * @param familySelect The set of string-formatted dot-delimited object
 *  identifiers of the object classes selected by the `familySelect`, or `null`
 *  if there is no such selection
 * @param depth The depth of the current recursion
 * @returns
 *
 * @function
 */
export
function keepSubsetOfDITById (
    dit: DIT,
    idsToKeep: Set<number> | null,
    familySelect: Set<IndexableOID> | null,
    depth: number = 0,
): DIT | null {
    assert(depth >= 0);
    if (!idsToKeep) {
        return dit;
    }
    const subordinatesThatMustBeKept: Vertex[] = dit.subordinates
        ?.map((sub) => keepSubsetOfDITById(sub, idsToKeep, familySelect, depth + 1))
        .filter((sub): sub is Vertex => !!sub) ?? [];
    const ret: DIT = {
        ...dit,
        subordinates: subordinatesThatMustBeKept,
    };
    if (
        idsToKeep.has(dit.dse.id)
        || (
            familySelect
            && dit.dse.structuralObjectClass
            && familySelect.has(dit.dse.structuralObjectClass.toString())
        )
    ) {
        return ret;
    }
    if (subordinatesThatMustBeKept.length === 0) {
        return null;
    }
    if (depth === 0) {
        let newRoot: DIT = ret;
        while (
            (newRoot.subordinates?.length === 1)
            && !idsToKeep.has(newRoot.dse.id)
            && (
                !familySelect
                || !newRoot.dse.structuralObjectClass
                || familySelect.has(newRoot.dse.structuralObjectClass.toString())
            )
        ) {
            newRoot = newRoot.subordinates[0];
        }
        return newRoot;
    }
    return ret;
}

export default keepSubsetOfDITById;
