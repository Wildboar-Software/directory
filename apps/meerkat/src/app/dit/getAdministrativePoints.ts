import type { Vertex } from "@wildboar/meerkat-types";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import { MAX_TRAVERSAL } from "../constants";

const AUTONOMOUS: string = id_ar_autonomousArea.toString();

/**
 * @summary Get the administrative points relating to an entry
 * @description
 *
 * This function traverses up the DSA information tree, starting with the DSE of
 * interest, and stops once it reaches the top of the tree or an autonomous
 * administrative point.
 *
 * @param entry The entry whose administrative points are to be obtained
 * @returns An array of vertices, each of which is an administrative point
 *
 * @function
 */
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
