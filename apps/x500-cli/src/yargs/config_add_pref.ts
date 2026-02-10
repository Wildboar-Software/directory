import process from "node:process";
import type { Context } from "../types.js";
import type { CommandModule } from "yargs";
import { getConfig } from "../getConfig.js";
import { saveConfig } from "../saveConfig.js";
import { strict as assert } from "node:assert";
import { createConfigurationFile } from "../config/createConfigurationFile.js";

export
function create (ctx: Context): CommandModule {
    return {
        command: "pref <name>",
        describe: "Add a preference profile to the configuration file",
        builder: (y) => {
            return y
                .positional("name", {
                    type: "string",
                    description: "The case-sensitive name of the preference profile",
                })
                .option("logLevel", {
                    alias: "l",
                    type: "string",
                    choices: [
                        "debug",
                        "info",
                        "warn",
                        "error",
                        "silent",
                    ],
                    description: "The logging level of the client",
                })
                .option("sizeLimit", {
                    alias: "s",
                    type: "number",
                    description: "A positive integer; the default sizeLimit supplied in search` or `list operations",
                })
                .option("timeLimit", {
                    alias: "t",
                    type: "number",
                    description: "A positive integer; the default timeLimit supplied in directory operations",
                })
                .option("attributeSizeLimit", {
                    alias: "a",
                    type: "number",
                    description: "A positive integer; the default attributeSizeLimit supplied in directory operations.",
                })
                .option("readOnly", {
                    alias: "r",
                    type: "boolean",
                    description: "A boolean indicating whether no write operations should be permitted",
                })
                .option("disable-start-tls", {
                    alias: "d",
                    type: "boolean",
                    description: "A boolean indicating whether the client should refrain from upgrading the connection security via StartTLS",
                })
                .option("callingAETitle", {
                    alias: "c",
                    type: "string",
                    description: "The distinguished name of the calling application entity (AE) title, as used by IDM and ISO transports",
                })
                .option("other", {
                    alias: "x",
                    type: "array",
                    string: true,
                    description: "Key=value pairs for other values that should appear in the configuration file. Value will always be a string."
                })
                .demandOption("name")
                .help()
                .strict()
                ;
        },
        handler: async (argv) => {
            if (!ctx.config) {
                ctx.log.warn("There is no configuration file to be edited. Creating one.");
                await createConfigurationFile();
                ctx.config = await getConfig(ctx);
            }
            assert(ctx.config);
            if (ctx.config["preference-profiles"]?.some((p) => p.name === argv.name)) {
                ctx.log.error(`Preference profile name '${argv.name}' already taken.`);
                process.exit(17);
            }
            ctx.config["preference-profiles"] = ctx.config["preference-profiles"] ?? [];
            ctx.config["preference-profiles"].push({
                name: argv.name,
                logLevel: argv.logLevel,
                sizeLimit: argv.sizeLimit,
                timeLimit: argv.timeLimit,
                attributeSizeLimit: argv.attributeSizeLimit,
                readOnly: argv.readOnly,
                ["disable-start-tls"]: argv["disable-start-tls"],
                callingAETitle: argv.callingAETitle,
                ...Object.fromEntries((argv.other as string[] ?? [])
                    .map((o) => [ o.slice(0, o.indexOf("=")), o.slice(o.indexOf("=") + 1) ])),
            });
            await saveConfig(ctx.config);
        },
    };
}

export default create;
