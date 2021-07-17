import type { Vertex } from "../types";

const MAX_TRAVERSAL: number = 100000;

export
function getAdministrativePoint (
    entry: Vertex,
): Vertex | undefined {
    let current = entry;
    let i: number = 0;
    while (i < MAX_TRAVERSAL) {
        if (current.dse.admPoint) {
            return current;
        }
        if (!current.immediateSuperior) {
            return undefined;
        }
        current = current.immediateSuperior;
        i++;
    }
    return undefined;
}

export default getAdministrativePoint;
