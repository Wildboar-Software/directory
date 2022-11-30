import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import { do_modify_become_svcsub as command } from "../commands/dap/mod/become/svcsub";

export
interface BecomeServiceSubentryArgs {
    object?: string;
    id?: number;
    dmdId?: string;
    name?: string;
    description?: string;
    serviceType?: string;
    userClass?: number;
    attributeCombination?: string;
    requestAttribute?: string[];
    resultAttribute?: string[];
    familyGrouping?: string;
    familyReturn?: string;
    familySelect?: string[];
    additionalControl?: string[];
    allowedSubset?: string[];
    imposedSubset?: string;
    entryLimitDefault?: number;
    entryLimitMax?: number;
}

export // eslint-disable-next-line @typescript-eslint/ban-types
function create (ctx: Context): CommandModule {
    return {
        command: "svcsub <object> <id> <dmdId>",
        describe: "Make a DSE into a serviceAdminSubentry",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object to be modified",
                })
                .positional("id", {
                    type: "number"
                })
                .positional("dmdId", {
                    type: "string",
                })
                .option("name", {
                    alias: "n",
                    type: "string",
                    description: "The name of the search rule"
                })
                .option("description", {
                    alias: "d",
                    type: "string",
                    description: "The description of the search rule"
                })
                .option("serviceType", {
                    type: "string",
                })
                .option("userClass", {
                    type: "number",
                })
                .option("attributeCombination", {
                    alias: "c",
                    type: "string",
                })
                .option("requestAttribute", {
                    alias: "q",
                    type: "array",
                    string: true,
                })
                .option("resultAttribute", {
                    alias: "r",
                    type: "array",
                    string: true,
                })
                .option("familyGrouping", {
                    type: "string",
                    choices: [
                        "entryOnly",
                        "compoundEntry",
                        "strands",
                        "multiStrand",
                    ],
                    description: "How families of entries in a compound entry are combined for the sake of operation evaluation"
                })
                .option("familyReturn", {
                    type: "string",
                    choices: [
                        "contributing",
                        "participating",
                        "compound",
                    ],
                    description: "The type of familyReturn to use"
                })
                .option("familySelect", {
                    type: "array",
                    string: true,
                })
                .option("additionalControl", {
                    alias: "a",
                    type: "array",
                    string: true,
                })
                .option("allowedSubset", {
                    type: "array",
                    string: true,
                    // These enum values come from LDAP URLs.
                    choices: [
                        "base",
                        "one",
                        "sub",
                    ],
                    description: "The search subsets the user is permitted to use"
                })
                .option("imposedSubset", {
                    type: "string",
                    // These enum values come from LDAP URLs.
                    choices: [
                        "base",
                        "one",
                        "sub",
                    ],
                    description: "The search subsets the user is forced to use"
                })
                .option("entryLimitDefault", {
                    alias: "l",
                    type: "number"
                })
                .option("entryLimitMax", {
                    alias: "x",
                    type: "number"
                })
                .help()
                .strict()
                ;
        },
        handler: async (argv) => {
            const connection = await bind(ctx, argv);
            await command(ctx, connection, argv);
            await connection.close();
        },
    };
}

export default create;
