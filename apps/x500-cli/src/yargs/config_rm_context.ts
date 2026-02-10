import process from "node:process";
import type { Context } from "../types.js";
import type { CommandModule } from "yargs";
import { saveConfig } from "../saveConfig.js";

export
function create (ctx: Context): CommandModule {
    return {
        command: "context <name>",
        describe: "Remove a context from the configuration file",
        builder: (y) => {
            return y
                .positional("name", {
                    type: "string",
                    description: "The case-sensitive name of the context to be removed",
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
            if (!ctx.config.contexts?.length) {
                ctx.log.error("There are no contexts defined.");
                process.exit(13);
            }
            const oldArray = ctx.config.contexts;
            const newArray = oldArray.filter((c) => c.name !== argv.name);
            if (oldArray.length === newArray.length) {
                ctx.log.error(`No such context '${argv.name}'.`);
                process.exit(7);
            }
            if (ctx.config["current-context"] === argv.name) {
                ctx.log.warn("The context you deleted was the configured current context. The current context will be unset.");
                delete ctx.config["current-context"];
            }
            ctx.config.contexts = newArray;
            await saveConfig(ctx.config);
            ctx.log.info("Configuration file updated.");
        },
    };
}

export default create;
