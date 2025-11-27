import type { ListResultStatistics } from "../types/index.js";
import type { ListResult } from "@wildboar/x500/DirectoryAbstractService";
import { getOptionallyProtectedValue } from "@wildboar/x500";

export
function getListResultStatistics (lr: ListResult): ListResultStatistics {
    const unprotectedResult = getOptionallyProtectedValue(lr);
    return {
        uncorrelatedListInfo: ("uncorrelatedListInfo" in unprotectedResult)
            ? unprotectedResult.uncorrelatedListInfo.map(getListResultStatistics)
            : undefined,
        numberOfSubordinates: ("listInfo" in unprotectedResult)
            ? unprotectedResult.listInfo.subordinates.length
            : undefined,
    };
}

export default getListResultStatistics;
