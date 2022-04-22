import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import {
    do_modify_become_acsub as command,
} from "../commands/dap/mod/become/acsub";

export
function create (ctx: Context): CommandModule {
    return {
        command: "acsub <object>",
        describe: "Make a DSE into an access control subentry",
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
