import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import addEntry from "../commands/dap/add/locality";

export
function create (ctx: Context): CommandModule {
    return {
        command: "dap add locality",
        describe: "Add a locality",
        builder: (y) => {
            return y
                .option("localityName", {
                    alias: "l",
                    type: "string",
                    description: "The name of the locality"
                })
                .option("stateOrProvinceName", {
                    alias: "s",
                    type: "string",
                    description: "The name of the state or province",
                })
                .option("description", {
                    alias: "d",
                    type: "string",
                    description: "An arbitrary description",
                })
                .option("seeAlso", {
                    alias: "a",
                    type: "string",
                    description: "The distinguished name of another related entry",
                })
                .option("streetAddress", {
                    alias: "a",
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
        handler: async (argv: Record<string, any>): Promise<void> => {
            const connection = await bind(ctx, argv);
            await addEntry(ctx, connection, argv);
        },
    };
}

export default create;
