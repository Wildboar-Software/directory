import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import addEntry from "../commands/dap/add/subentry";
import { add_common_add_opts, CommonAddOptions } from "./add_common_add_opts";

// subentry OBJECT-CLASS ::= {
//     SUBCLASS OF      {top}
//     KIND             structural
//     MUST CONTAIN     {commonName | subtreeSpecification}
//     LDAP-NAME        {"subentry"}
//     ID               id-sc-subentry }

export // eslint-disable-next-line @typescript-eslint/ban-types
function create (ctx: Context): CommandModule<{}, CommonAddOptions> {
    return {
        command: "subentry <object>",
        describe: "Add a subentry",
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
                .option("baseName", {
                    alias: "b",
                    type: "string",
                    description: "The start of the subtree"
                })
                .option("minimum", {
                    alias: "n",
                    type: "number",
                    description: "The number of levels under the base including and beyond which the subtree covers"
                })
                .option("maximum", {
                    alias: "x",
                    type: "number",
                    description: "The number of levels under the base which the subtree covers"
                })
                .option("chopBefore", {
                    alias: "c",
                    type: "array",
                    string: true,
                    description: "The distinguished name relative to the base name of an entry that is to be excluded, along with its subordinates, from the subtree specification",
                })
                .option("chopAfter", {
                    alias: "a",
                    type: "array",
                    string: true,
                    description: "The distinguished name relative to the base name of an entry whose subordinates are to be excluded from the subtree specification"
                })
                .option("refinement", {
                    alias: "r",
                    type: "string",
                    description: "A Refinement, per the LDAP syntax for subtree specifications, but not permitting textual names for object classes",
                })
                .demandOption("commonName")
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
