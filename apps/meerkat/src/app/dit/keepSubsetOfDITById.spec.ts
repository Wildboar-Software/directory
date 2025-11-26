import type { DIT, Vertex, DSE } from "../types/index.js";
import { strict as assert } from "assert";
import keepSubsetOfDITById from "./keepSubsetOfDITById.js";

function dse (id: number, subordinates?: Vertex[]): Vertex {
    return {
        dse: {
            id: id,
        } as DSE,
        subordinates: subordinates ?? [],
    };
}

describe("keepSubsetOfDITById", () => {
    it("keeps the whole DIT if a null selection is provided", () => {
        const dit: DIT = dse(1, [
            dse(2),
            dse(3),
        ]);
        const toKeep: Set<number> | null = null;
        const subset: DIT | null = keepSubsetOfDITById(dit, toKeep, null);
        assert(subset);
        assert(subset.subordinates);
        expect(subset.subordinates).toHaveLength(2);
        expect(subset.subordinates[0].dse.id).toBe(2);
        expect(subset.subordinates[1].dse.id).toBe(3);
    });

    it("filters out a single immediate subordinate of the root", () => {
        const dit: DIT = dse(1, [
            dse(2),
            dse(3),
        ]);
        const toKeep: Set<number> | null = new Set([ 1, 3 ]);
        const subset: DIT | null = keepSubsetOfDITById(dit, toKeep, null);
        assert(subset);
        assert(subset.subordinates);
        expect(subset.subordinates).toHaveLength(1);
        expect(subset.subordinates[0].dse.id).toBe(3);
    });

    it("filters out a single descendant", () => {
        const dit: DIT = dse(1, [
            dse(2),
            dse(3, [
                dse(4),
                dse(5),
            ]),
        ]);
        const toKeep: Set<number> | null = new Set([ 1, 2, 3, 5 ]);
        const subset: DIT | null = keepSubsetOfDITById(dit, toKeep, null);
        assert(subset);
        assert(subset.subordinates);
        expect(subset.subordinates).toHaveLength(2);
        expect(subset.subordinates[0].dse.id).toBe(2);
        expect(subset.subordinates[1].dse.id).toBe(3);
        assert(subset.subordinates[1].subordinates);
        expect(subset.subordinates[1].subordinates).toHaveLength(1);
        expect(subset.subordinates[1].subordinates[0].dse.id).toBe(5);
    });

    it("keeps a non-selected vertex in the result set because one of its subordinates are selected", () => {
        const dit: DIT = dse(1, [
            dse(2),
            dse(3, [
                dse(4),
                dse(5),
            ]),
        ]);
        const toKeep: Set<number> | null = new Set([ 1, 2, 4, 5 ]);
        const subset: DIT | null = keepSubsetOfDITById(dit, toKeep, null);
        assert(subset);
        assert(subset.subordinates);
        expect(subset.subordinates).toHaveLength(2);
        expect(subset.subordinates[0].dse.id).toBe(2);
        expect(subset.subordinates[1].dse.id).toBe(3);
        assert(subset.subordinates[1].subordinates);
        expect(subset.subordinates[1].subordinates).toHaveLength(2);
        expect(subset.subordinates[1].subordinates[0].dse.id).toBe(4);
        expect(subset.subordinates[1].subordinates[1].dse.id).toBe(5);
    });

    it("does not keep a non-selected vertex with no selected subordinates in the result set", () => {
        const dit: DIT = dse(1, [
            dse(2),
            dse(3, [
                dse(4),
                dse(5),
            ]),
        ]);
        const toKeep: Set<number> | null = new Set([ 1, 2 ]);
        const subset: DIT | null = keepSubsetOfDITById(dit, toKeep, null);
        assert(subset);
        assert(subset.subordinates);
        expect(subset.subordinates).toHaveLength(1);
        expect(subset.subordinates[0].dse.id).toBe(2);
    });

    it("returns a subtree of the results if the root vertex is neither selected nor needed", () => {
        const dit: DIT = dse(1, [
            dse(2),
            dse(3, [
                dse(4),
                dse(5),
            ]),
        ]);
        const toKeep: Set<number> | null = new Set([ 3, 4, 5 ]);
        const subset: DIT | null = keepSubsetOfDITById(dit, toKeep, null);
        assert(subset);
        assert(subset.subordinates);
        expect(subset.dse.id).toBe(3);
        expect(subset.subordinates).toHaveLength(2);
        expect(subset.subordinates[0].dse.id).toBe(4);
        expect(subset.subordinates[1].dse.id).toBe(5);
    });

    it("returns a subtree of the results if the root vertex is neither selected nor needed", () => {
        const dit: DIT = dse(1, [
            dse(2),
            dse(3, [
                dse(4),
                dse(5),
            ]),
        ]);
        const toKeep: Set<number> | null = new Set([ 3, 4, 5 ]);
        const subset: DIT | null = keepSubsetOfDITById(dit, toKeep, null);
        assert(subset);
        assert(subset.subordinates);
        expect(subset.dse.id).toBe(3);
        expect(subset.subordinates).toHaveLength(2);
        expect(subset.subordinates[0].dse.id).toBe(4);
        expect(subset.subordinates[1].dse.id).toBe(5);
    });

    it("returns a subtree of the results #1", () => {
        const dit: DIT = dse(1, [
            dse(2),
            dse(3, [
                dse(4),
                dse(5, [
                    dse(6),
                    dse(7),
                ]),
            ]),
        ]);
        const toKeep: Set<number> | null = new Set([ 3, 7 ]);
        const subset: DIT | null = keepSubsetOfDITById(dit, toKeep, null);
        assert(subset);
        assert(subset.subordinates);
        expect(subset.dse.id).toBe(3);
        expect(subset.subordinates).toHaveLength(1);
        expect(subset.subordinates[0].dse.id).toBe(5);
        assert(subset.subordinates[0].subordinates);
        expect(subset.subordinates[0].subordinates).toHaveLength(1);
        expect(subset.subordinates[0].subordinates[0].dse.id).toBe(7);
    });

    it("returns a subtree of the results #2", () => {
        const dit: DIT = dse(1, [
            dse(2),
            dse(3, [
                dse(4),
                dse(5, [
                    dse(6),
                    dse(7),
                ]),
            ]),
        ]);
        const toKeep: Set<number> | null = new Set([ 5, 7 ]);
        const subset: DIT | null = keepSubsetOfDITById(dit, toKeep, null);
        assert(subset);
        assert(subset.subordinates);
        expect(subset.dse.id).toBe(5);
        expect(subset.subordinates).toHaveLength(1);
        expect(subset.subordinates[0].dse.id).toBe(7);
    });
});
