import type { ServiceControlStatistics } from "@wildboar/meerkat-types";
import type {
    ServiceControls,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta";
import {
    ServiceControlOptions_preferChaining,
    ServiceControlOptions_chainingProhibited,
    ServiceControlOptions_localScope,
    ServiceControlOptions_dontUseCopy,
    ServiceControlOptions_dontDereferenceAliases,
    ServiceControlOptions_subentries,
    ServiceControlOptions_copyShallDo,
    ServiceControlOptions_partialNameResolution,
    ServiceControlOptions_manageDSAIT,
    ServiceControlOptions_noSubtypeMatch,
    ServiceControlOptions_noSubtypeSelection,
    ServiceControlOptions_countFamily,
    ServiceControlOptions_dontSelectFriends,
    ServiceControlOptions_dontMatchFriends,
    ServiceControlOptions_allowWriteableCopy,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import { TRUE_BIT } from "asn1-ts";

export
function getStatisticsFromServiceControls (sc: ServiceControls): ServiceControlStatistics {
    return {
        ...sc,
        priority: (sc.priority !== undefined)
            ? Number(sc.priority)
            : undefined,
        sizeLimit: (sc.sizeLimit !== undefined)
            ? Number(sc.sizeLimit)
            : undefined,
        timeLimits: (sc.timeLimit !== undefined)
            ? Number(sc.timeLimit)
            : undefined,
        attributeSizeLimit: (sc.attributeSizeLimit !== undefined)
            ? Number(sc.attributeSizeLimit)
            : undefined,
        scopeOfReferral: (sc.scopeOfReferral !== undefined)
            ? Number(sc.scopeOfReferral)
            : undefined,
        userClass: (sc.userClass !== undefined)
            ? Number(sc.userClass)
            : undefined,
        options: {
            preferChaining: (sc.options?.[ServiceControlOptions_preferChaining] === TRUE_BIT),
            chainingProhibited: (sc.options?.[ServiceControlOptions_chainingProhibited] === TRUE_BIT),
            localScope: (sc.options?.[ServiceControlOptions_localScope] === TRUE_BIT),
            dontUseCopy: (sc.options?.[ServiceControlOptions_dontUseCopy] === TRUE_BIT),
            dontDereferenceAliases: (sc.options?.[ServiceControlOptions_dontDereferenceAliases] === TRUE_BIT),
            subentries: (sc.options?.[ServiceControlOptions_subentries] === TRUE_BIT),
            copyShallDo: (sc.options?.[ServiceControlOptions_copyShallDo] === TRUE_BIT),
            partialNameResolution: (sc.options?.[ServiceControlOptions_partialNameResolution] === TRUE_BIT),
            manageDSAIT: (sc.options?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT),
            noSubtypeMatch: (sc.options?.[ServiceControlOptions_noSubtypeMatch] === TRUE_BIT),
            noSubtypeSelection: (sc.options?.[ServiceControlOptions_noSubtypeSelection] === TRUE_BIT),
            countFamily: (sc.options?.[ServiceControlOptions_countFamily] === TRUE_BIT),
            dontSelectFriends: (sc.options?.[ServiceControlOptions_dontSelectFriends] === TRUE_BIT),
            dontMatchFriends: (sc.options?.[ServiceControlOptions_dontMatchFriends] === TRUE_BIT),
            allowWriteableCopy: (sc.options?.[ServiceControlOptions_allowWriteableCopy] === TRUE_BIT),
        },
        manageDSAITPlaneRef: Boolean(sc.manageDSAITPlaneRef),
        serviceType: sc.serviceType?.toString(),
    };
}

export default getStatisticsFromServiceControls;
