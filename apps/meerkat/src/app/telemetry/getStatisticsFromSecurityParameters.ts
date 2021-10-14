import type { SecurityParametersStatistics } from "@wildboar/meerkat-types";
import type {
    SecurityParameters,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityParameters.ta";

export
function getStatisticsFromSecurityParameters (sc: SecurityParameters): SecurityParametersStatistics {
    return {
        nameLength: sc.name?.length,
        certificationPathLength: sc.certification_path?.theCACertificates?.length,
        operationCode: Boolean(sc.operationCode),
        errorCode: Boolean(sc.errorCode),
        target: sc.target,
        errorProtection: sc.errorProtection,
        time: sc.time
            ? (("utcTime" in sc.time) ? sc.time.utcTime : sc.time.generalizedTime).toISOString()
            : undefined,
        random: Boolean(sc.random),
    };
}

export default getStatisticsFromSecurityParameters;
