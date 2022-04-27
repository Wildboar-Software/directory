import { CONFIG_FILE_LOCATIONS, PREFERRED_CONFIG_FILE_LOCATION } from "./configFileLocations";
import * as fs from "fs/promises";
import { strict as assert } from "assert";
import * as yml from "js-yaml";
import type { X500ClientConfig } from "@wildboar/x500-cli-config";

export
async function saveConfig (config: X500ClientConfig) {
    let configFile: string | undefined;
    for (const loc of CONFIG_FILE_LOCATIONS) {
        try {
            await fs.access(loc);
            configFile = loc;
        } catch {
            continue;
        }
    }
    if (!configFile) {
        configFile = PREFERRED_CONFIG_FILE_LOCATION;
    }
    assert(configFile);
    return fs.writeFile(configFile, yml.dump(config));
}
