import type { Vertex } from "@wildboar/meerkat-types";

export
function *readEntryOnly (ancestor: Vertex): IterableIterator<Vertex[]> {
    yield [ ancestor ];
}

export default readEntryOnly;
