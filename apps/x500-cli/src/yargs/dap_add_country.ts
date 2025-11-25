import type { Context } from "../types.js";
import type { CommandModule } from "yargs";
import bind from "../net/bind.js";
import addEntry from "../commands/dap/add/country.js";
import { add_common_add_opts, CommonAddOptions } from "./add_common_add_opts.js";

export // eslint-disable-next-line @typescript-eslint/ban-types
function create (ctx: Context): CommandModule<{}, CommonAddOptions> {
    return {
        command: "country <object> <countryName>",
        describe: "Add a country",
        builder: (y) => {
            return add_common_add_opts(y
                .positional("object", {
                    type: "string",
                    description: "The object",
                })
                .positional("countryName", {
                    type: "string",
                    description: "The ISO-3166 2-letter country code",
                }))
                .option("description", {
                    type: "string",
                    description: "An arbitrary description",
                })
                .array("description")
                .demandOption("countryName")
                .help()
                .strict()
                ;
        },
        handler: async (argv) => {
            const connection = await bind(ctx, argv);
            await addEntry(ctx, connection, argv);
            await connection.close();
        },
    };
}

export default create;
