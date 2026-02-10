import process from "node:process";
import type { Context } from "../types.js";
import type { CommandModule } from "yargs";
import { saveConfig } from "../saveConfig.js";

export
function create (ctx: Context): CommandModule {
    return {
        command: "pref <name>",
        describe: "Remove a preference profile from the configuration file",
        builder: (y) => {
            return y
                .positional("name", {
                    type: "string",
                    description: "The case-sensitive name of the preference profile to be removed",
                })
                .demandOption("name")
                .help()
                .strict()
                ;
        },
        handler: async (argv) => {
            if (!ctx.config) {
                ctx.log.error("There is no configuration file.");
                process.exit(9);
            }
            if (!ctx.config["preference-profiles"]?.length) {
                ctx.log.error("There are no preference profiles defined.");
                process.exit(13);
            }
            const oldArray = ctx.config["preference-profiles"];
            const newArray = oldArray.filter((p) => p.name !== argv.name);
            if (oldArray.length === newArray.length) {
                ctx.log.error(`No such preference profile '${argv.name}'.`);
                process.exit(7);
            }
            if (ctx.config.contexts.some((c) => c.context.preferences === argv.name)) {
                ctx.log.error(`Preference profile '${argv.name}' is in use by a context, and cannot be safely deleted.`);
                process.exit(5);
            }
            ctx.config["preference-profiles"] = newArray;
            await saveConfig(ctx.config);
            ctx.log.info("Configuration file updated.");
        },
    };
}

export default create;
