import { getOptionallyProtectedValue } from "@wildboar/x500";
import { EntryInformation } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import { SearchResult } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";

export
function* iterateOverSearchResults(result: SearchResult): Generator<EntryInformation, undefined> {
    const data = getOptionallyProtectedValue(result);
    if ("searchInfo" in data) {
        for (const entry of data.searchInfo.entries) {
            yield entry;
        }
    } else if ("uncorrelatedSearchInfo" in data) {
        for (const subresult of data.uncorrelatedSearchInfo) {
            yield* iterateOverSearchResults(subresult);
        }
    } else {
        return undefined;
    }
    return undefined;
}

export default iterateOverSearchResults;
