import type {
    CommonResults,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CommonResults.ta";
import getStatisticsFromSecurityParameters from "./getStatisticsFromSecurityParameters";
import {
    SecurityParameters,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityParameters.ta";

type CommonResultsLike = { [K in keyof CommonResults]: CommonResults[K] };

export
function getCommonResultsStatistics (cr: CommonResultsLike | undefined) {
    if (!cr) {
        return {};
    }
    return {
        ...((
            cr.securityParameters
            && (typeof cr.securityParameters === "object")
            && (cr.securityParameters instanceof SecurityParameters)
        )
            ? {
                sp: getStatisticsFromSecurityParameters(cr.securityParameters),
            }
            : {}),
        aliasDereferenced: cr.aliasDereferenced,
        notificationLength: Array.isArray(cr.notification)
            ? cr.notification.length
            : undefined,
        performerNameLength: Array.isArray(cr.performer)
            ? cr.performer.length
            : undefined,
    };
}

export default getCommonResultsStatistics;
