import type {
    Vertex,
    DIT,
    IndexableOID,
} from "@wildboar/meerkat-types";
import { strict as assert } from "assert";

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
