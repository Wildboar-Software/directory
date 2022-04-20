import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import { do_modify_become_collectivesub as command } from "../commands/dap/mod/become/collectivesub";

export
function create (ctx: Context): CommandModule {
    return {
        command: "collectivesub <object>",
        describe: "Make a DSE into a collectiveAttributeSubentry",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object to be modified",
                })
                .option("collectiveValue", {
                    alias: "c",
                    type: "array",
                    string: true,
                    description: "Object-identifier=value pairs (like LDAP RDNs) with which to create collective values"
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
