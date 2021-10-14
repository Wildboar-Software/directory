import type { MasterOrShadowAccessPointStatistics } from "@wildboar/meerkat-types";
import type {
    MasterOrShadowAccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";
import accessPointToNSAPStrings from "../x500/accessPointToNSAPStrings";


export
function getMasterOrShadowAccessPointStatistics (
    mosap: MasterOrShadowAccessPoint,
): MasterOrShadowAccessPointStatistics {
    return {
        aeTitleLength: mosap.ae_title.rdnSequence.length,
        category: mosap.category,
        nsaps: Array.from(accessPointToNSAPStrings(mosap)),
        // protocolInformation unused.
        chainingRequired: mosap.chainingRequired,
    };
}

export default getMasterOrShadowAccessPointStatistics;
