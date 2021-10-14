import type { ListResultStatistics } from "@wildboar/meerkat-types";
import type { ListResult } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResult.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";

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
