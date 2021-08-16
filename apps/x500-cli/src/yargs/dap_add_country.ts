import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import addEntry from "../commands/dap/add/country";

export
function create (ctx: Context): CommandModule {
    return {
        command: "dap add c",
        describe: "Add a country",
        builder: (yargs) => {
            return yargs
                .option("countryName", {
                    alias: "c",
                    type: "string",
                    description: "The ISO-3166 2-letter country code",
                })
                .option("description", {
                    alias: "d",
                    type: "string",
                    description: "An arbitrary description",
                })
                .array("description")
                .demandOption("countryName")
                .help()
                ;
        },
        handler: async (argv) => {
            const connection = await bind(ctx, argv);
            await addEntry(ctx, connection, argv);
        },
    };
}

export default create;
