import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import addEntry from "../commands/dap/add/locality";
import { add_common_add_opts, CommonAddOptions } from "./add_common_add_opts";

export // eslint-disable-next-line @typescript-eslint/ban-types
function create (ctx: Context): CommandModule<{}, CommonAddOptions> {
    return {
        command: "locality <object>",
        describe: "Add a locality",
        builder: (y) => {
            return add_common_add_opts(y
                .positional("object", {
                    type: "string",
                    description: "The object",
                }))
                .option("localityName", {
                    alias: "l",
                    type: "string",
                    description: "The name of the locality"
                })
                .option("stateOrProvinceName", {
                    alias: "st",
                    type: "string",
                    description: "The name of the state or province",
                })
                .option("description", {
                    type: "string",
                    description: "An arbitrary description",
                })
                .option("seeAlso", {
                    type: "string",
                    description: "The distinguished name of another related entry",
                })
                .option("streetAddress", {
                    type: "string",
                    description: "The street address",
                })
                .array("localityName")
                .array("stateOrProvinceName")
                .array("description")
                .array("seeAlso")
                .array("streetAddress")
                ;
        },
        handler: async (argv): Promise<void> => {
            const connection = await bind(ctx, argv);
            await addEntry(ctx, connection, argv);
            await connection.close();
        },
    };
}

export default create;
