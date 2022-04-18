import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import addEntry from "../commands/dap/add/group";

export
function create (ctx: Context): CommandModule {
    return {
        command: "group <object>",
        describe: "Add a group of (possibly unique) names",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object",
                })
                .option("commonName", {
                    alias: "cn",
                    type: "array",
                    description: "The common name of the group",
                })
                .option("member", {
                    type: "array",
                    description: "The first member to add to the group",
                })
                // TODO:
                // .option("check", {
                //     alias: "c",
                //     type: "boolean",
                //     description: "Check that the first member exists before creating the group.",
                // })
                .option("unique", {
                    type: "boolean",
                    description: "Make the group a groupOfUniqueNames",
                })
                .option("uniqueIdentifier", {
                    type: "string",
                    description: "The unique identifier of the first member as a binary string (e.g. '1101101')",
                })
                .option("owner", {
                    type: "array",
                    description: "The owner of the group",
                })
                .option("organizationName", {
                    alias: "o",
                    type: "array",
                    description: "The organization name",
                })
                .option("organizationUnitName", {
                    alias: "ou",
                    type: "array",
                    description: "The organizational unit name",
                })
                .option("description", {
                    type: "array",
                    description: "An arbitrary description",
                })
                .option("seeAlso", {
                    type: "array",
                    description: "The distinguished name of another related entry",
                })
                .option("businessCategory", {
                    type: "array",
                    description: "A string identifying the category of the organization",
                })
                .demandOption("commonName")
                .demandOption("member")
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
