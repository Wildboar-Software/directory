import type { PartialOutcomeQualifierStatistics } from "@wildboar/meerkat-types";
import type { PartialOutcomeQualifier } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PartialOutcomeQualifier.ta";
import getFilterStatistics from "./getFilterStatistics";
import getContinuationReferenceStatistics from "./getContinuationReferenceStatistics";

export
function getPartialOutcomeQualifierStatistics (poq: PartialOutcomeQualifier): PartialOutcomeQualifierStatistics {
    return {
        limitProblem: poq.limitProblem
            ? Number(poq.limitProblem)
            : undefined,
        unexplored: poq.unexplored?.map(getContinuationReferenceStatistics),
        unavailableCriticalExtensions: poq.unavailableCriticalExtensions,
        numberOfUnknownErrors: poq.unknownErrors?.length,
        queryReferencePresent: Boolean(poq.queryReference),
        overspecFilter: poq.overspecFilter
            ? getFilterStatistics(poq.overspecFilter)
            : undefined,
        notification: poq.notification?.map((not) => not.type_.toString()),
        bestEstimate: (poq.entryCount && ("bestEstimate" in poq.entryCount))
            ? Number(poq.entryCount.bestEstimate)
            : undefined,
        lowEstimate: (poq.entryCount && ("lowEstimate" in poq.entryCount))
            ? Number(poq.entryCount.lowEstimate)
            : undefined,
        exact: (poq.entryCount && ("exact" in poq.entryCount))
            ? Number(poq.entryCount.exact)
            : undefined,
    };
}

export default getPartialOutcomeQualifierStatistics;
