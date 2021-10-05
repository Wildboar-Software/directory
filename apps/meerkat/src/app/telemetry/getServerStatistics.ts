import type { ServerStatistics } from "../types";
import * as os from "os";

function canFail <T>(cb: () => T): T | undefined {
    try {
        return cb();
    } catch {
        return undefined;
    }
}

export
function getServerStatistics (): ServerStatistics {
    return {
        version: "1.0.0",
        hash: "",
        os_arch: canFail(() => os.arch()),
        os_cpu_cores: canFail(() => os.cpus()),
        os_endianness: canFail(() => os.endianness()),
        os_freemem: canFail(() => os.freemem()),
        os_homedir: canFail(() => os.homedir()),
        os_hostname: canFail(() => os.hostname()),
        os_networkInterfaces: canFail(() => os.networkInterfaces()),
        os_platform: canFail(() => os.platform()),
        os_release: canFail(() => os.release()),
        os_totalmem: canFail(() => os.totalmem()),
        os_type: canFail(() => os.type()),
        os_uptime: canFail(() => os.uptime()),
        os_version: canFail(() => os.version()),
    };
}

export default getServerStatistics;
