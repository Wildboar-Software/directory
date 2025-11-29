import type { Vertex } from "../../types/index.js";

/**
 * @summary Select the `strands` family grouping from a compound entry
 * @description
 *
 * **WARNING:** This function _assumes_ that the vertex given by the `ancestor`
 * argument _exclusively_ has subordinates in its `subordinates` array that are
 * family members.
 *
 * This function simply returns the subset of the family that corresponds to
 * the `strands` family grouping described in ITU Recommendation X.511
 * (2016), Section 7.3.2.
 *
 * @param ancestor The ancestor of the family. The subordintes should only be
 *  family members.
 * @yields Subsets of the family
 *
 * @function
 */
export
function *readStrands (ancestor: Vertex): IterableIterator<Vertex[]> {
    // yield [ ancestor ];
    if (!ancestor.subordinates?.length) {
        yield [ ancestor ];
    }
    // The subordinates should already be here from the previous call to `readFamily()`.
    for (const subordinate of ancestor.subordinates ?? []) {
        // yield *readEntryOnly(subordinate);
        for (const substrand of readStrands(subordinate)) {
            yield [
                ancestor,
                ...substrand,
            ];
        }
    }
}

export default readStrands;
