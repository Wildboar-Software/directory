import type { Context } from "../types";
import type { CommandModule } from "yargs";
import { getConfig } from "../getConfig";
import { saveConfig } from "../saveConfig";
import { strict as assert } from "assert";
import { createConfigurationFile } from "../config/createConfigurationFile";

interface Args {
    name: string;
    pref?: string;
    dsa: string;
    cred?: string;
}

export
function create (ctx: Context): CommandModule<unknown, Args> {
    return {
        command: "context <name>",
        describe: "Add a context to the configuration file",
        builder: (y) => {
            return y
                .positional("name", {
                    type: "string",
                    description: "A case-sensitive name for the context",
                })
                .option("pref", {
                    alias: "p",
                    type: "string",
                    description: "The case-sensitive name of the preference profile to use for this context",
                })
                .option("dsa", {
                    alias: "d",
                    type: "string",
                    description: "The case-sensitive name of the DSA to use for this context"
                })
                .option("cred", {
                    alias: "c",
                    type: "string",
                    description: "The case-sensitive name of the credential to use for this context"
                })
                .demandOption("name")
                .demandOption("dsa")
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
            if (ctx.config.contexts.some((c) => c.name === argv.name)) {
                ctx.log.error(`Context name '${argv.name}' already taken.`);
                process.exit(17);
            }
            if (argv.pref && !(ctx.config["preference-profiles"] ?? []).some((p) => p.name === argv.pref)) {
                ctx.log.error(`No such preference profile '${argv.pref}' defined. Aborting.`);
                process.exit(5);
            }
            if (!ctx.config.dsas.some((d) => d.name === argv.dsa)) {
                ctx.log.error(`No such DSA '${argv.dsa}' defined. Aborting.`);
                process.exit(4);
            }
            if (argv.cred && !ctx.config.credentials.some((c) => c.name === argv.cred)) {
                ctx.log.error(`No such credential '${argv.dsa}' defined. Aborting.`);
                process.exit(3);
            }
            ctx.config.contexts.push({
                name: argv.name,
                context: {
                    dsa: argv.dsa,
                    credential: argv.cred,
                    preferences: argv.pref,
                },
            });
            await saveConfig(ctx.config);
        },
    };
}

export default create;
