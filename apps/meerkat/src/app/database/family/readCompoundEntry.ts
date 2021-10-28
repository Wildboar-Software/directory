import type { Vertex } from "@wildboar/meerkat-types";

const getSubtree = (vertex: Vertex) => [
    vertex,
    ...(vertex.subordinates ?? []).map(getSubtree),
];

export
function *readCompoundEntry (ancestor: Vertex): IterableIterator<Vertex[]> {
    yield getSubtree(ancestor);
}

export default readCompoundEntry;
