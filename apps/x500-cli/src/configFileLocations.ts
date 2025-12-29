import * as os from "os";
import * as path from "path";

const CONFIG_FILE_BASE_NAME: string = "directory";

export
const CONFIG_FILE_LOCATIONS: string[] = [
    path.join(os.homedir(), ".config", `${CONFIG_FILE_BASE_NAME}.yaml`),
    path.join(os.homedir(), ".config", `${CONFIG_FILE_BASE_NAME}.yml`),
    path.join(os.homedir(), ".config", `${CONFIG_FILE_BASE_NAME}.json`),
];

const platform = os.platform();
if (
    (platform === "darwin")
    || (platform === "linux")
) {
    CONFIG_FILE_LOCATIONS.push(`/etc/${CONFIG_FILE_BASE_NAME}.yaml`);
    CONFIG_FILE_LOCATIONS.push(`/etc/${CONFIG_FILE_BASE_NAME}.yml`);
    CONFIG_FILE_LOCATIONS.push(`/etc/${CONFIG_FILE_BASE_NAME}.json`);
}

export
const PREFERRED_CONFIG_FILE_LOCATION: string = CONFIG_FILE_LOCATIONS.find((cfg) => cfg.endsWith(".yaml"))!;
