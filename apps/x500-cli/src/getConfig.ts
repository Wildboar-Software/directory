import type { Context } from "./types";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import type { X500ClientConfig } from "@wildboar/x500-cli-config";
import * as yml from "js-yaml";
import validator from "./configValidator";

const CONFIG_FILE_BASE_NAME: string = "directory";

const CONFIG_FILE_LOCATIONS: string[] = [
    path.join(os.homedir(), ".config", `${CONFIG_FILE_BASE_NAME}.yaml`),
    path.join(os.homedir(), ".config", `${CONFIG_FILE_BASE_NAME}.yml`),
    path.join(os.homedir(), ".config", `${CONFIG_FILE_BASE_NAME}.json`),
    path.join(os.homedir(), ".config", `${CONFIG_FILE_BASE_NAME}.yaml`),
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
async function getConfig (ctx: Context): Promise<X500ClientConfig | null> {
    let matchedFileName: string | undefined;
    let fileContents: string | undefined;
    for (const potentialConfigFile of CONFIG_FILE_LOCATIONS) {
        try {
            await fs.access(potentialConfigFile);
        } catch {
            ctx.log.debug(`Configuration file ${potentialConfigFile} did not exist.`);
            continue;
        }
        matchedFileName = potentialConfigFile;
        fileContents = await fs.readFile(potentialConfigFile, {
            encoding: "utf-8",
        });
        break;
    }
    if (!matchedFileName || !fileContents) {
        return null;
    }
    let config: any | undefined;
    try {
        config = (matchedFileName.endsWith(".yaml") || matchedFileName.endsWith(".yml"))
            ? yml.load(fileContents)
            : JSON.parse(fileContents);
    } catch (e) {
        ctx.log.error(`Error parsing configuration file: ${matchedFileName}.`);
        ctx.log.error(e);
    }
    if (!config || !(typeof config === "object")) {
        return null;
    }
    const valid = validator(config);
    if (!valid) {
        ctx.log.error("Invalid configuration.");
        console.error(validator.errors);
    }
    return config as X500ClientConfig;
}

export default getConfig;
