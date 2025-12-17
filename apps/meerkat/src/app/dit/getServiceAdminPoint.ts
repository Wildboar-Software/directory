import type { Vertex } from "../types/index.js";
import { ID_AUTONOMOUS, ID_AR_SERVICE } from "../../oidstr.js";

export
function getServiceAdminPoint (target: Vertex): Vertex | undefined {
    let current: Vertex | undefined = target;
    while (current) {
        if (current.dse.admPoint?.administrativeRole.has(ID_AR_SERVICE)) {
            return current;
        }
        if (current.dse.admPoint?.administrativeRole.has(ID_AUTONOMOUS)) {
            return undefined;
        }
        current = current.immediateSuperior;
    }
}
