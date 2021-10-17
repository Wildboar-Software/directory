import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import addEntry from "../commands/dap/add/country";

export
function create (ctx: Context): CommandModule {
    return {
        command: "person <object>",
        describe: "Add a person",
        builder: (yargs) => {
            return yargs
                .positional("object", {
                    type: "string",
                    description: "The object",
                })
                .option("commonName", {
                    alias: "c",
                    type: "array",
                    description: "The common name",
                })
                .option("surname", {
                    alias: "s",
                    type: "array",
                    description: "The last name of the person",
                })
                .option("telephoneNumber", {
                    alias: "t",
                    type: "array",
                    description: "The telephone number",
                })
                .option("userPassword", {
                    alias: "u",
                    type: "string",
                    description: "The password for the organization",
                })
                .option("description", {
                    alias: "d",
                    type: "array",
                    description: "An arbitrary description",
                })
                .option("seeAlso", {
                    alias: "a",
                    type: "array",
                    description: "The distinguished name of another related entry",
                })
                .demandOption("countryName")
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
