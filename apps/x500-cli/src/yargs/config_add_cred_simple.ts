import process from "node:process";
import type { Context } from "../types.js";
import type { CommandModule } from "yargs";
import { getConfig } from "../getConfig.js";
import { saveConfig } from "../saveConfig.js";
import { strict as assert } from "node:assert";
import { createConfigurationFile } from "../config/createConfigurationFile.js";
import * as readline from "readline";
import MutableWriteable from "../utils/MutableWriteable.js";

export
function create (ctx: Context): CommandModule<unknown, { name: string, binddn: string }> {
    return {
        command: "simple <name> <binddn>",
        describe: "Add a simple credential to the configuration file",
        builder: (y) => {
            return y
                .positional("name", {
                    type: "string",
                    description: "The case-sensitive name of the credential",
                })
                .positional("binddn", {
                    type: "string",
                    description: "The bind distinguished name",
                })
                .option("password", {
                    alias: "p",
                    type: "boolean",
                    description: "Prompt for a password",
                })
                .demandOption("name")
                .demandOption("binddn")
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
            if (ctx.config.credentials.some((c) => c.name === argv.name)) {
                ctx.log.error(`Credential name '${argv.name}' already taken.`);
                process.exit(17);
            }
            if (argv.password) {
                const mutedOut = new MutableWriteable();
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: mutedOut,
                    terminal: true,
                });
                rl.question("Password: ", async (answer: string): Promise<void> => {
                    console.log();
                    ctx.config!.credentials.push({
                        name: argv.name,
                        credential: {
                            type: "simple",
                            name: argv.binddn,
                            password: {
                                unprotected: answer,
                            },
                        },
                    });
                    rl.close();
                    await saveConfig(ctx.config!);
                });
                mutedOut.muted = true;
            } else {
                ctx.config.credentials.push({
                    name: argv.name,
                    credential: {
                        type: "simple",
                        name: argv.binddn,
                    },
                });
                await saveConfig(ctx.config);
            }
        },
    };
}

export default create;
