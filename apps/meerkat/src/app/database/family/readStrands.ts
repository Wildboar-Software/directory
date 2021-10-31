import type { Vertex } from "@wildboar/meerkat-types";

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
