import * as fs from "fs/promises";
import { DEFAULT_CONFIGURATION_FILE } from "../getConfig";
import { PREFERRED_CONFIG_FILE_LOCATION } from "../configFileLocations";

export
function createConfigurationFile () {
    return fs.writeFile(PREFERRED_CONFIG_FILE_LOCATION, DEFAULT_CONFIGURATION_FILE);
}
