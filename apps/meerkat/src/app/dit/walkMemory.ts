import type { Vertex } from "@wildboar/meerkat-types";

/**
 * @summary Iterates over all in-memory descendants of a vertex.
 * @description
 *
 * This function returns all descendants of a vertex, meaning not only those
 * immediately subordinate, but their subordinates, recursively, but it is
 * limited only to those vertices that are in memory.
 *
 * @param ancestor The ancestor whose descendants are to be returned
 *
 * @function
 * @yields A vertex corresponding to each subordinate
 */
export
function *walkMemory (ancestor: Vertex): IterableIterator<Vertex> {
    yield ancestor;
    for (const sub of ancestor.subordinates ?? []) {
        yield *walkMemory(sub);
    }
}

export default walkMemory;
