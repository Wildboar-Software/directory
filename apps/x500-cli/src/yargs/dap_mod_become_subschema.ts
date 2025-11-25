import type { Context } from "../types.js";
import type { CommandModule } from "yargs";
import bind from "../net/bind.js";
import {
    do_modify_become_subschema as command,
} from "../commands/dap/mod/become/subschema.js";

export
function create (ctx: Context): CommandModule {
    return {
        command: "subschema <object>",
        describe: "Make a DSE into a subschema",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object to be modified",
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
