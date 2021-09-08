import type { Vertex } from "../types";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";

const MAX_TRAVERSAL: number = 100000;
const AUTONOMOUS: string = id_ar_autonomousArea.toString();

export
function getAdministrativePoints (
    entry: Vertex,
): Vertex[] {
    let current = entry;
    let i: number = 0;
    const admPoints: Vertex[] = [];
    while (i < MAX_TRAVERSAL) {
        if (current.dse.admPoint?.administrativeRole.has(AUTONOMOUS)) {
            return [
                ...admPoints,
                current,
            ];
        }
        if (!current.immediateSuperior) {
            return admPoints;
        }
        current = current.immediateSuperior;
        i++;
    }
    return admPoints;
}

export default getAdministrativePoints;
