import type { Vertex } from "@wildboar/meerkat-types";

const getSubtree = (vertex: Vertex): Vertex[] => [
    vertex,
    ...(vertex.subordinates ?? []).flatMap(getSubtree),
];

export
function *readCompoundEntry (ancestor: Vertex): IterableIterator<Vertex[]> {
    yield getSubtree(ancestor);
}

export default readCompoundEntry;
