import type { Context } from "@wildboar/meerkat-types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import addEntry from "../commands/dap/add/group";

export
function create (ctx: Context): CommandModule {
    return {
        command: "group <object> <cn> <member>",
        describe: "Add a group of (possibly unique) names",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object",
                })
                .positional("cn", {
                    type: "string",
                    description: "The common name of the group",
                })
                .positional("member", {
                    type: "string",
                    description: "The first member to add to the group",
                })
                // TODO:
                // .option("check", {
                //     alias: "c",
                //     type: "boolean",
                //     description: "Check that the first member exists before creating the group.",
                // })
                .option("unique", {
                    alias: "q",
                    type: "boolean",
                    description: "Make the group a groupOfUniqueNames",
                })
                .option("uniqueIdentifier", {
                    alias: "i",
                    type: "string",
                    description: "The unique identifier of the first member as a binary string (e.g. '1101101')",
                })
                .option("owner", {
                    alias: "w",
                    type: "array",
                    description: "The owner of the group",
                })
                .option("organizationName", {
                    alias: "o",
                    type: "array",
                    description: "The organization name",
                })
                .option("organizationUnitName", {
                    alias: "u",
                    type: "array",
                    description: "The organizational unit name",
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
                .option("businessCategory", {
                    alias: "b",
                    type: "array",
                    description: "A string identifying the category of the organization",
                })
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
