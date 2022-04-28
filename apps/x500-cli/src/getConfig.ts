import type { Context } from "./types";
import * as fs from "fs/promises";
import type { X500ClientConfig } from "@wildboar/x500-cli-config";
import * as yml from "js-yaml";
import validator from "./configValidator";
import { findConfigurationFile } from "./config/findConfigurationFile";

export
const DEFAULT_CONFIGURATION_FILE: string = `apiVersion: v1.0.0
kind: X500ClientConfig
metadata:
  name: main
  labels:
    client: x500-cli
  annotations:
    createTime: !!str ${new Date().toISOString()}
preference-profiles: []
dsas: []
credentials: []
contexts: []
`;

export
async function getConfig (ctx: Context): Promise<X500ClientConfig | null> {
    const matchedFileName: string | undefined = await findConfigurationFile(ctx);
    if (!matchedFileName) {
        return null;
    }
    const fileContents = await fs.readFile(matchedFileName, {
        encoding: "utf-8",
    });
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
