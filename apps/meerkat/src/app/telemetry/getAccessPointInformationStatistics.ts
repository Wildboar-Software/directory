import type {
    AccessPointInformationStatistics,
} from "../types";
import type { AccessPointInformation } from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPointInformation.ta";
import getMasterOrShadowAccessPointStatistics from "./getMasterOrShadowAccessPointStatistics";

export
function getAccessPointInformationStatistics (api: AccessPointInformation): AccessPointInformationStatistics {
    return {
        ...getMasterOrShadowAccessPointStatistics(api),
        additionalPoints: api.additionalPoints?.map((ap) => getMasterOrShadowAccessPointStatistics(ap)),
    };
}
