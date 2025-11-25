import type { Context } from "../types.js";
import type { CommandModule } from "yargs";
import { saveConfig } from "../saveConfig.js";

export
function create (ctx: Context): CommandModule {
    return {
        command: "cred <name>",
        describe: "Remove a credential from the configuration file",
        builder: (y) => {
            return y
                .positional("name", {
                    type: "string",
                    description: "The case-sensitive name of the credential to be removed",
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
            if (!ctx.config.credentials?.length) {
                ctx.log.error("There are no credentials defined.");
                process.exit(13);
            }
            const oldArray = ctx.config.credentials;
            const newArray = oldArray.filter((c) => c.name !== argv.name);
            if (oldArray.length === newArray.length) {
                ctx.log.error(`No such credential '${argv.name}'.`);
                process.exit(7);
            }
            if (ctx.config.contexts.some((c) => c.context.credential === argv.name)) {
                ctx.log.error(`Credential '${argv.name}' is in use by a context, and cannot be safely deleted.`);
                process.exit(5);
            }
            ctx.config.credentials = newArray;
            await saveConfig(ctx.config);
            ctx.log.info("Configuration file updated.");
        },
    };
}

export default create;
