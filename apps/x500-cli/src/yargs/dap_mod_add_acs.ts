import type { Context } from "../types.js";
import type { CommandModule } from "yargs";
import bind from "../net/bind.js";
import {
    do_modify_add_acs as command,
} from "../commands/dap/mod/add/acs.js";

export
function create (ctx: Context): CommandModule {
    return {
        command: "acs <object> <scheme>",
        describe: "Add an accessControlScheme to an entry",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object to be modified",
                })
                .positional("scheme", {
                    type: "string",
                    description: "The object identifier of the access control scheme in use",
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
