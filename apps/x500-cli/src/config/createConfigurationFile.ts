import * as fs from "node:fs/promises";
import { DEFAULT_CONFIGURATION_FILE } from "../getConfig.js";
import { PREFERRED_CONFIG_FILE_LOCATION } from "../configFileLocations.js";

export
function createConfigurationFile () {
    return fs.writeFile(PREFERRED_CONFIG_FILE_LOCATION, DEFAULT_CONFIGURATION_FILE);
}
