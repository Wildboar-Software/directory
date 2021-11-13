import type { ContinuationReferenceStatistics } from "@wildboar/meerkat-types";
import type { ContinuationReference } from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import { getAccessPointInformationStatistics } from "./getAccessPointInformationStatistics";

export
function getContinuationReferenceStatistics (cr: ContinuationReference): ContinuationReferenceStatistics {
    return {
        targetObjectNameLength: cr.targetObject.rdnSequence.length,
        aliasedRDNs: (cr.aliasedRDNs !== undefined)
            ? Number(cr.aliasedRDNs)
            : undefined,
        operationProgress: {
            phase: cr.operationProgress?.nameResolutionPhase,
            next: (cr.operationProgress?.nextRDNToBeResolved !== undefined)
                ? Number(cr.operationProgress.nextRDNToBeResolved)
                : undefined,
        },
        rdnsResolved: (cr.rdnsResolved !== undefined)
            ? Number(cr.rdnsResolved)
            : undefined,
        referenceType: cr.referenceType,
        accessPoints: cr.accessPoints.map(getAccessPointInformationStatistics),
        entryOnly: cr.entryOnly,
        numberOfExclusions: cr.exclusions?.length,
        returnToDUA: cr.returnToDUA,
        nameResolveOnMaster: cr.nameResolveOnMaster,
    };
}

export default getContinuationReferenceStatistics;
