import type { MasterOrShadowAccessPointStatistics } from "@wildboar/meerkat-types";
import type {
    MasterOrShadowAccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";
import { naddrToURI } from "@wildboar/x500/src/lib/distributed/naddrToURI";


export
function getMasterOrShadowAccessPointStatistics (
    mosap: MasterOrShadowAccessPoint,
): MasterOrShadowAccessPointStatistics {
    return {
        aeTitleLength: mosap.ae_title.rdnSequence.length,
        category: mosap.category,
        nsaps: mosap.address.nAddresses
            .map(naddrToURI)
            .filter((addr): addr is string => !!addr),
        // protocolInformation unused.
        chainingRequired: mosap.chainingRequired,
    };
}

export default getMasterOrShadowAccessPointStatistics;
