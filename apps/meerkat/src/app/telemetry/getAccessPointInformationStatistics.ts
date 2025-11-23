import type {
    AccessPointInformationStatistics,
} from "@wildboar/meerkat-types";
import type { AccessPointInformation } from "@wildboar/x500/DistributedOperations";
import getMasterOrShadowAccessPointStatistics from "./getMasterOrShadowAccessPointStatistics.js";

export
function getAccessPointInformationStatistics (api: AccessPointInformation): AccessPointInformationStatistics {
    return {
        ...getMasterOrShadowAccessPointStatistics(api),
        additionalPoints: api.additionalPoints?.map((ap) => getMasterOrShadowAccessPointStatistics(ap)),
    };
}
