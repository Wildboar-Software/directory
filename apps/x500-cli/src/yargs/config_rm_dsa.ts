import type { Context } from "../types.js";
import type { CommandModule } from "yargs";
import { saveConfig } from "../saveConfig.js";

export
function create (ctx: Context): CommandModule {
    return {
        command: "dsa <name>",
        describe: "Remove a DSA from the configuration file",
        builder: (y) => {
            return y
                .positional("name", {
                    type: "string",
                    description: "The case-sensitive name of the DSA to be removed",
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
            if (!ctx.config.dsas?.length) {
                ctx.log.error("There are no DSAs defined.");
                process.exit(13);
            }
            const oldArray = ctx.config.dsas;
            const newArray = oldArray.filter((d) => d.name !== argv.name);
            if (oldArray.length === newArray.length) {
                ctx.log.error(`No such DSA '${argv.name}'.`);
                process.exit(7);
            }
            if (ctx.config.contexts.some((c) => c.context.dsa === argv.name)) {
                ctx.log.error(`DSA '${argv.name}' is in use by a context, and cannot be safely deleted.`);
                process.exit(5);
            }
            ctx.config.dsas = newArray;
            await saveConfig(ctx.config);
            ctx.log.info("Configuration file updated.");
        },
    };
}

export default create;
