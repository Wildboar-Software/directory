import type { CommonArgumentsStatistics, TypeAndContextAssertionStatistics } from "@wildboar/meerkat-types";
import type {
    CommonArguments,
} from "@wildboar/x500/DirectoryAbstractService";
import getStatisticsFromServiceControls from "./getStatisticsFromServiceControls.js";
import getStatisticsFromSecurityParameters from "./getStatisticsFromSecurityParameters.js";

export
function getStatisticsFromCommonArguments (cargs: CommonArguments): CommonArgumentsStatistics {
    return {
        serviceControls: cargs.serviceControls
            ? getStatisticsFromServiceControls(cargs.serviceControls)
            : undefined,
        securityParameters: cargs.securityParameters
            ? getStatisticsFromSecurityParameters(cargs.securityParameters)
            : undefined,
        requestorLength: cargs.requestor?.length,
        operationProgress: cargs.operationProgress
            ? {
                phase: cargs.operationProgress.nameResolutionPhase,
                next: (cargs.operationProgress.nextRDNToBeResolved !== undefined)
                    ? Number(cargs.operationProgress.nextRDNToBeResolved)
                    : undefined,
            }
            : undefined,
        aliasedRDNs: (cargs.aliasedRDNs !== undefined)
            ? Number(cargs.aliasedRDNs)
            : undefined,
        criticalExtensions: cargs.criticalExtensions
            ? Array.from(cargs.criticalExtensions)
            : undefined,
        referenceType: cargs.referenceType,
        entryOnly: cargs.entryOnly,
        exclusionsLength: cargs.exclusions?.length,
        nameResolveOnMaster: cargs.nameResolveOnMaster,
        operationContextsAllContexts: (cargs.operationContexts && ("allContexts" in cargs.operationContexts)),
        operationContextsSelectedContexts: (
            cargs.operationContexts
            && ("selectedContexts" in cargs.operationContexts)
        )
            ? cargs.operationContexts.selectedContexts
                .map((sc): TypeAndContextAssertionStatistics => {
                    if ("all" in sc.contextAssertions) {
                        return {
                            type: sc.type_.toString(),
                            all: sc.contextAssertions.all.map((ca) => ({
                                contextType: ca.contextType.toString(),
                                contextValuesLength: ca.contextValues.length,
                            })),
                        };
                    } else if ("preference" in sc.contextAssertions) {
                        return {
                            type: sc.type_.toString(),
                            preference: sc.contextAssertions.preference.map((ca) => ({
                                contextType: ca.contextType.toString(),
                                contextValuesLength: ca.contextValues.length,
                            })),
                        };
                    } else {
                        return {
                            type: sc.type_.toString(),
                        };
                    }
                })
            : undefined,
        familyGrouping: cargs.familyGrouping,
    };
}

export default getStatisticsFromCommonArguments;

