import type { Entry } from "../types";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";

export
function getDistinguishedName (entry: Entry): DistinguishedName {
    if (entry.rdn.length === 0 || !entry.parent) {
        return [];
    }
    return [ entry.rdn, ...getDistinguishedName(entry.parent) ];
}

export default getDistinguishedName;
