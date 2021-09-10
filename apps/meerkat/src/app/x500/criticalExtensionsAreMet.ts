import { BIT_STRING, TRUE_BIT } from "asn1-ts";
import criticalExtensionsSupportedByThisDSA from "./criticalExtensionsSupportedByThisDSA";

export
function criticalExtensionsAreMet (requested: BIT_STRING): boolean {
    for (let i: number = 0; i < requested.length; i++) {
        if (
            (requested[i] === TRUE_BIT)
            && (!criticalExtensionsSupportedByThisDSA[i])
        ) {
            return false;
        }
    }
    return true;
}

export default criticalExtensionsAreMet;
