import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import {
    do_terminate as command,
} from "../commands/dop/terminate";
import { dop_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dop-ip.oa";

export
function create (ctx: Context): CommandModule {
    return {
        command: "terminate <binding-type> <binding-id> <ae-title>",
        describe: "Using Meerkat's Relayed DOP feature, terminate an operational binding.",
        builder: (y) => {
            return y
                .positional("binding-type", {
                    type: "string",
                    description: "The numeric-form object identifier of the binding type to terminate",
                })
                .positional("binding-id", {
                    type: "number",
                    description: "The ID of the operational binding to terminate",
                })
                .positional("ae-title", {
                    type: "string",
                    description: "The AE title of the DSA with which to terminate the NHOB",
                })
                .option("naddr", {
                    alias: "n",
                    type: "string",
                    describe: "A network address of the DSA with which to establish the NHOB",
                    array: true,
                })
                .option("p-selector", {
                    alias: "p",
                    type: "string",
                    describe: "A presentation selector of the DSA with which to establish the NHOB",
                })
                .option("s-selector", {
                    alias: "s",
                    type: "string",
                    describe: "A session selector of the DSA with which to establish the NHOB",
                })
                .option("t-selector", {
                    alias: "t",
                    type: "string",
                    describe: "A transport selector of the DSA with which to establish the NHOB",
                })
                .option("at", {
                    alias: "a",
                    type: "string",
                    describe: "The time to terminate the operational binding in ISO 8601 format. This defaults to now if unspecified.",
                })
                .help()
                .strict()
                ;
        },
        handler: async (argv) => {
            const connection = await bind(ctx, argv, dop_ip["&id"]!);
            await command(ctx, connection, argv);
            await connection.close();
        },
    };
}

export default create;
