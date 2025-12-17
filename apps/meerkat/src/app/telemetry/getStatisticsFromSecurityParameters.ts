import type { SecurityParametersStatistics } from "../types/index.js";
import type {
    SecurityParameters,
} from "@wildboar/x500/DirectoryAbstractService";

export
function getStatisticsFromSecurityParameters (sc: SecurityParameters): SecurityParametersStatistics {
    return {
        nameLength: sc.name?.length,
        certificationPathLength: sc.certification_path?.theCACertificates?.length,
        operationCode: Boolean(sc.operationCode),
        errorCode: Boolean(sc.errorCode),
        target: (sc.target !== undefined)
            ? Number(sc.target)
            : undefined,
        errorProtection: (sc.errorProtection !== undefined)
            ? Number(sc.errorProtection)
            : undefined,
        time: sc.time
            ? (("utcTime" in sc.time) ? sc.time.utcTime : sc.time.generalizedTime).toISOString()
            : undefined,
        random: Boolean(sc.random),
    };
}

export default getStatisticsFromSecurityParameters;
