import type { Context } from "../types.js";
import * as fs from "node:fs/promises";
import { CONFIG_FILE_LOCATIONS } from "../configFileLocations.js";

export
async function findConfigurationFile (ctx: Context): Promise<string | undefined> {
    let matchedFileName: string | undefined;
    for (const potentialConfigFile of CONFIG_FILE_LOCATIONS) {
        try {
            await fs.access(potentialConfigFile);
        } catch {
            ctx.log.debug(`Configuration file ${potentialConfigFile} did not exist.`);
            continue;
        }
        matchedFileName = potentialConfigFile;
        break;
    }
    return matchedFileName;
}
