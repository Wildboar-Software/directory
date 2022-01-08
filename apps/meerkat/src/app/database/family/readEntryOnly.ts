import type { Vertex } from "@wildboar/meerkat-types";

export
function *readEntryOnly (ancestor: Vertex): IterableIterator<Vertex[]> {
    yield [ ancestor ];
    for (const subordinate of ancestor.subordinates ?? []) {
        yield *readEntryOnly(subordinate);
    }
}

export default readEntryOnly;
