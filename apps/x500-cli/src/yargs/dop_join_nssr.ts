import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import {
    do_join_nssr as command,
} from "../commands/dop/join_nssr";
import { dop_ip } from "@wildboar/x500/DirectoryIDMProtocols";

export
function create (ctx: Context): CommandModule {
    return {
        command: "join nssr <object> <ae-title>",
        describe: "Make an entry 'join' an NHOB by becoming a subordinate to an NSSR",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object to be subordinated to the superior DSA",
                })
                .positional("ae-title", {
                    type: "string",
                    description: "The AE title of the DSA with which to establish the NHOB",
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
                .option("valid-from", {
                    alias: "f",
                    type: "string",
                    describe: "The start time of the NHOB in ISO 8601 format. This defaults to now if unspecified.",
                })
                .option("valid-until", {
                    alias: "u",
                    type: "string",
                    describe: "The end time of the NHOB in ISO 8601 format. This defaults to explicit termination if unspecified.",
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
