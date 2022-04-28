import type { Context } from "../types";
import type { CommandModule } from "yargs";
import { strict as assert } from "assert";
import { saveConfig } from "../saveConfig";

export
function create (ctx: Context): CommandModule<unknown, { name: string }> {
    return {
        command: "set-context <name>",
        describe: "Set the current context in the X.500 directory configuration file",
        builder: (y) => y
            .positional("name", {
                type: "string",
                description: "The case-sensitive name of the context to be used"
            })
            .demandOption("name"),
        handler: async (argv) => {
            if (!ctx.config) {
                ctx.log.warn("There is no configuration file to be edited. Exiting.");
                process.exit(3);
            }
            assert(ctx.config);
            // check if the context exists
            if (!ctx.config.contexts.some((c) => c.name === argv.name)) {
                ctx.log.error(`There is no such context '${argv.name}' defined.`);
                process.exit(5);
            }
            ctx.config["current-context"] = argv.name;
            await saveConfig(ctx.config);
        },
    };
}

export default create;
