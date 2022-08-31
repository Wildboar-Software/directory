import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import addEntry from "../commands/dap/add/dmd";
import { add_common_add_opts, CommonAddOptions } from "./add_common_add_opts";

export // eslint-disable-next-line @typescript-eslint/ban-types
function create (ctx: Context): CommandModule<{}, CommonAddOptions> {
    return {
        command: "dmd <object>",
        describe: "Add a DMD",
        builder: (yargs) => {
            return add_common_add_opts(yargs
                .positional("object", {
                    type: "string",
                    description: "The object",
                }))
                .option("dmdName", {
                    type: "array",
                    description: "The name of the DMD",
                })
                .option("description", {
                    type: "array",
                    description: "An arbitrary description",
                })
                .option("seeAlso", {
                    type: "array",
                    description: "The distinguished name of another related entry",
                })
                .option("businessCategory", {
                    type: "array",
                    description: "A string identifying the category of the organization",
                })
                .option("localityName", {
                    alias: "l",
                    type: "array",
                    description: "The name of the locality"
                })
                .option("stateOrProvinceName", {
                    alias: "st",
                    type: "array",
                    description: "The name of the state or province",
                })
                .option("streetAddress", {
                    type: "array",
                    description: "The street address",
                })
                .option("physicalDeliveryOfficeName", {
                    type: "array",
                    description: "The name of the physical delivery office",
                })
                .option("postalAddress", {
                    type: "array",
                    description: "The full, multi-line postal address, where lines are separated by dollar signs '$'.",
                })
                .option("postalCode", {
                    type: "array",
                    description: "The postal code / ZIP code",
                })
                .option("postOfficeBox", {
                    type: "array",
                    description: "The post office box identifier",
                })
                .option("telephoneNumber", {
                    type: "array",
                    description: "The telephone number",
                })
                .option("facsimileTelephoneNumber", {
                    type: "array",
                    description: "The fax number",
                })
                .option("userPassword", {
                    type: "string",
                    description: "The password for the organization",
                })
                .demandOption("dmdName")
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
