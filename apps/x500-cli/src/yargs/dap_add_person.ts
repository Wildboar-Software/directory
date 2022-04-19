import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import addEntry from "../commands/dap/add/person";
import { add_common_add_opts, CommonAddOptions } from "./add_common_add_opts";

export // eslint-disable-next-line @typescript-eslint/ban-types
function create (ctx: Context): CommandModule<{}, CommonAddOptions> {
    return {
        command: "person <object>",
        describe: "Add a person",
        builder: (yargs) => {
            return add_common_add_opts(yargs
                .positional("object", {
                    type: "string",
                    description: "The object",
                }))
                .option("commonName", {
                    alias: "cn",
                    type: "array",
                    description: "The common name",
                })
                .option("surname", {
                    alias: "sn",
                    type: "array",
                    description: "The last name of the person",
                })
                .option("telephoneNumber", {
                    type: "array",
                    description: "The telephone number",
                })
                .option("userPassword", {
                    type: "string",
                    description: "The password for the organization",
                })
                .option("description", {
                    type: "array",
                    description: "An arbitrary description",
                })
                .option("seeAlso", {
                    type: "array",
                    description: "The distinguished name of another related entry",
                })
                .demandOption("commonName")
                .demandOption("surname")
                .help()
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
