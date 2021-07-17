import type { Vertex } from "../types";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";

export
function getDistinguishedName (entry: Vertex): DistinguishedName {
    if (entry.dse.rdn.length === 0 || !entry.immediateSuperior) {
        return [];
    }
    return [ ...getDistinguishedName(entry.immediateSuperior), entry.dse.rdn ];
}

export default getDistinguishedName;
