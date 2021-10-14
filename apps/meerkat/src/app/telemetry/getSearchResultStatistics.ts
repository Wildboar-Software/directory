import type { SearchResultStatistics } from "@wildboar/meerkat-types";
import type { SearchResult } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";

export
function getSearchResultStatistics (sr: SearchResult): SearchResultStatistics {
    const unprotectedResult = getOptionallyProtectedValue(sr);
    return {
        numberOfResults: ("searchInfo" in unprotectedResult)
            ? unprotectedResult.searchInfo.entries.length
            : undefined,
        uncorrelatedSearchInfo: ("uncorrelatedSearchInfo" in unprotectedResult)
            ? unprotectedResult.uncorrelatedSearchInfo.map(getSearchResultStatistics)
            : undefined,
        altMatching: ("searchInfo" in unprotectedResult)
            ? unprotectedResult.searchInfo.altMatching
            : undefined,
    };
}

export default getSearchResultStatistics;
