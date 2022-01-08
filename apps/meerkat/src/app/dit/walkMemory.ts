import type { Vertex } from "@wildboar/meerkat-types";

export
function *walkMemory (ancestor: Vertex): IterableIterator<Vertex> {
    yield ancestor;
    for (const sub of ancestor.subordinates ?? []) {
        yield *walkMemory(sub);
    }
}

export default walkMemory;
