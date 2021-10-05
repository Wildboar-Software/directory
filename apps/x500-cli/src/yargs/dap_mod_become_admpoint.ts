import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";

export
function create (ctx: Context): CommandModule {
    return {
        command: "admpoint <object>",
        describe: "Make a DSE an administrative point",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object to be made an administrative point",
                })
                .option("autonomousArea", {
                    alias: "z",
                    type: "boolean",
                })
                .option("accessControlSpecificArea", {
                    alias: "a",
                    type: "boolean",
                })
                .option("accessControlInnerArea", {
                    alias: "acia",
                    type: "boolean",
                })
                .option("subschemaAdminSpecificArea", {
                    alias: "u",
                    type: "boolean",
                })
                .option("collectiveAttributeSpecificArea", {
                    alias: "c",
                    type: "boolean",
                })
                .option("collectiveAttributeInnerArea", {
                    alias: "caia",
                    type: "boolean",
                })
                .option("contextDefaultSpecificArea", {
                    alias: "x",
                    type: "boolean",
                })
                .option("serviceSpecificArea", {
                    alias: "e",
                    type: "boolean",
                })
                .option("pwdAdminSpecificArea", {
                    alias: "p",
                    type: "boolean",
                })
                .option("other", {
                    type: "array",
                })
                .option("accessControlScheme", {
                    alias: "k",
                    type: "string",
                })
                .help()
                .strict()
                ;
        },
        handler: async (argv) => {
            const connection = await bind(ctx, argv);
        },
    };
}

export default create;
