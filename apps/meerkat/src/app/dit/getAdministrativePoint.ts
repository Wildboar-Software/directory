import type { Entry } from "../types";

const MAX_TRAVERSAL: number = 100000;

export
function getAdministrativePoint (
    entry: Entry,
): Entry | undefined {
    let current = entry;
    let i: number = 0;
    while (i < MAX_TRAVERSAL) {
        if (current.dseType.admPoint) {
            return current;
        }
        if (!current.parent) {
            return undefined;
        }
        current = current.parent;
        i++;
    }
    return undefined;
}

export default getAdministrativePoint;
