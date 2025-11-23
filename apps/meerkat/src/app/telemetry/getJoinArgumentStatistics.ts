import type {
    JoinArgumentStatistics,
    JoinAttPairStatistics,
} from "@wildboar/meerkat-types";
import type {
    JoinArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    JoinAttPair,
} from "@wildboar/x500/DirectoryAbstractService";
import getFilterStatistics from "./getFilterStatistics";
import getEntryInformationSelectionStatistics from "./getEntryInformationSelectionStatistics";
import { directoryStringToString } from "@wildboar/x500";

function getJoinAttPairStatistics (jap: JoinAttPair): JoinAttPairStatistics {
    return {
        baseAtt: jap.baseAtt.toString(),
        joinAtt: jap.joinAtt.toString(),
        joinContext: jap.joinContext?.map((oid) => oid.toString()),
    };
}

export
function getJoinArgumentStatistics (ja: JoinArgument): JoinArgumentStatistics {
    return {
        joinBaseObjectNameLength: ja.joinBaseObject.rdnSequence.length,
        domainLocalID: ja.domainLocalID
            ? directoryStringToString(ja.domainLocalID)
            : undefined,
        joinFilter: ja.joinFilter
            ? getFilterStatistics(ja.joinFilter)
            : undefined,
        joinSelection: ja.joinSelection
            ? getEntryInformationSelectionStatistics(ja.joinSelection)
            : undefined,
        joinSubset: ja.joinSubset,
        joinAttributes: ja.joinAttributes?.map(getJoinAttPairStatistics),
    };
}

export default getJoinArgumentStatistics;
