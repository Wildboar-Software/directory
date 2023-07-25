import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import {
    do_shadow as command,
} from "../commands/dop/shadow";
import { dop_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dop-ip.oa";
import * as _ from "lodash";


export
function create (ctx: Context, variant: "supply" | "consume"): CommandModule {
    return {
        command: `${variant} shadow <cp> <ae-title>`,
        describe: `${_.startCase(variant)} a replicated area (shadow)`,
        builder: (y) => {
            return y
                .positional("cp", {
                    type: "string",
                    description: "The object to be subordinated to the superior DSA",
                })
                .positional("ae-title", {
                    type: "string",
                    description: "The AE title of the DSA with which to establish the SOB",
                })

                // Options general to operational binding establishment
                .option("naddr", {
                    alias: "n",
                    type: "string",
                    describe: "A network address of the DSA with which to establish the SOB",
                    array: true,
                })
                .option("p-selector", {
                    alias: "p",
                    type: "string",
                    describe: "A presentation selector of the DSA with which to establish the SOB",
                })
                .option("s-selector", {
                    alias: "s",
                    type: "string",
                    describe: "A session selector of the DSA with which to establish the SOB",
                })
                .option("t-selector", {
                    alias: "t",
                    type: "string",
                    describe: "A transport selector of the DSA with which to establish the SOB",
                })
                .option("valid-from", {
                    alias: "f",
                    type: "string",
                    describe: "The start time of the SOB in ISO 8601 format. This defaults to now if unspecified.",
                })
                .option("valid-until", {
                    alias: "u",
                    type: "string",
                    describe: "The end time of the SOB in ISO 8601 format. This defaults to explicit termination if unspecified.",
                })

                // Options specific to shadow operational bindings
                // Min not allowed in an SOB
                // .option("min", {
                //     type: "number",
                //     describe: "The minimu"
                // })
                .option("max", {
                    type: "number",
                    describe: "The maximum depth of the shadowed subtree"
                })
                .option("chop-before", {
                    type: "string",
                    describe: "A local name (as an RDN sequence, such as st=FL,l=Tampa) that is to be 'chopped out' of the shadowed subtree",
                    array: true,
                })
                .option("chop-after", {
                    type: "string",
                    describe: "A local name (as an RDN sequence, such as st=FL,l=Tampa) whose subordinates are to be 'chopped out' of the shadowed subtree",
                    array: true,
                })
                .option("refinement", {
                    type: "string",
                    description: "A Refinement, per the LDAP syntax for subtree specifications, but not permitting textual names for object classes",
                })
                .option("base", {
                    type: "string",
                    describe: "A local name (as an RDN sequence, such as st=FL,l=Tampa) that is to be the base of the shadowed subtree",
                })
                .option("select", {
                    type: "string",
                    describe: "Attribute selections to be replicated (e.g 'person:include:givenName,surname', ':exclude:ssn', 'organization:all')",
                    array: true,
                })
                .option("master-knowledge", {
                    type: "boolean",
                    describe: "Whether to replicate master knowledge"
                })
                .option("shadow-knowledge", {
                    type: "boolean",
                    describe: "Whether to replicate shadow knowledge"
                })
                .option("both-knowledge", {
                    type: "boolean",
                    describe: "Whether to replicate master and shadow knowledge"
                })
                .option("ext-knowledge", {
                    type: "boolean",
                    describe: "Whether to replicate extended knowledge, meaning subordinate and non-specific subordinate references"
                })
                .option("subordinates", {
                    type: "boolean",
                    describe: "Whether to replicate entire subordinate references rather than just their knowledge attributes"
                })
                .option("all-contexts", {
                    type: "boolean",
                    describe: "Whether to select all contexts",
                })
                .option("select-context", {
                    type: "string",
                    describe: "A TypeAndContextAssertions to filter what attribute values are selected using an 'all' assertion (e.g. commonName:languageContext=en,localeContext=1.2.3.4)",
                    array: true,
                })
                .option("supply-all-contexts", {
                    type: "boolean",
                    describe: "Whether to replicate all contexts",
                })
                .option("supply-context", {
                    type: "string",
                    describe: "An object identifier of a context type that is to be replicated",
                    array: true,
                })
                .option("supplier-initiated", {
                    type: "boolean",
                    describe: "Whether shadow updates are to be supplier-initiated",
                    conflicts: "consumer-initiated",
                })
                .option("consumer-initiated", {
                    type: "boolean",
                    describe: "Whether shadow updates are to be supplier-initiated",
                    conflicts: "supplier-initiated",
                })
                .option("on-change", {
                    type: "boolean",
                    describe: "Whether shadow updates are to be provided upon changes to master DSEs",
                    conflicts: "consumer-initiated",
                })
                .option("other-times", {
                    type: "boolean",
                    describe: "Whether shadow updates may happen outside of the scheduled time",
                })
                .option("begin-time", {
                    type: "string",
                    describe: "The begin time of the first replication in ISO 8601 format. This defaults to now if unspecified.",
                })
                .option("window-size", {
                    type: "number",
                    describe: "The duration (in seconds) of the time window in which the shadow supplier may transmit an update within each update period",
                })
                .option("update-interval", {
                    type: "number",
                    describe: "The frequency (in seconds) of shadow updates.",
                })
                .option("master-ae-title", {
                    type: "string",
                    describe: "The AE title of the DSA that is the master for this replicated area",
                })
                .option("master-naddr", {
                    type: "string",
                    describe: "A network address of the master DSA",
                    array: true,
                })
                .option("master-p-selector", {
                    type: "string",
                    describe: "The presentation selector of the master DSA",
                })
                .option("master-s-selector", {
                    type: "string",
                    describe: "The session selector of the master DSA",
                })
                .option("master-t-selector", {
                    type: "string",
                    describe: "The transport selector of the master DSA",
                })
                .option("secondary-shadows", {
                    type: "boolean",
                    describe: "Whether the supplier is to receive secondary shadows from the consumer",
                })
                .help()
                .strict()
                ;
        },
        handler: async (argv) => {
            const connection = await bind(ctx, argv, dop_ip["&id"]!);
            await command(ctx, connection, argv, variant);
            await connection.close();
        },
    };
}

export default create;
