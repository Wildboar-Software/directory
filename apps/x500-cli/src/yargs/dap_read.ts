import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import read from "../commands/dap/read";

export
function create (ctx: Context): CommandModule {
    return {
        command: "read <object>",
        describe: "Read an entry",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    describe: "The entry whose subordinates are to be listed",
                })
                .option("modifyRights", {
                    alias: "m",
                    type: "boolean",
                    describe: "Whether to request a listing of modification rights to this entry",
                })
                .option("userAttribute", {
                    alias: "u",
                    type: "array",
                    describe: "Dot-delimited object identifier of attribute type to select",
                })
                .option("extraAttribute", {
                    alias: "x",
                    type: "array",
                    describe: "Dot-delimited object identifier of operational attribute type to select",
                })
                .option("typesOnly", {
                    alias: "t",
                    type: "boolean",
                    describe: "Whether to return only attribute types (no attribute values)",
                })
                .option("allContexts", {
                    type: "boolean",
                    describe: "Whether to ignore context assertion defaults",
                })
                .option("returnContexts", {
                    alias: "c",
                    type: "boolean",
                    describe: "Whether to return contexts with values",
                })
                .option("attrCert", {
                    type: "string",
                    describe: "Request an attribute certificate (only works on some DSAs)",
                })
                .option("singleUse", {
                    type: "boolean",
                    describe: "Whether the attribute cert should have the singleUse extension",
                    demandOption: "attrCert",
                    default: false,
                })
                .option("noAssertion", {
                    type: "boolean",
                    describe: "Whether the attribute cert should have the noAssertion extension",
                    demandOption: "attrCert",
                    default: false,
                })

                // Service controls
                .option("priority", {
                    type: "string",
                    choices: [
                        "low",
                        "medium",
                        "high",
                    ],
                    description: "The priority of the request",
                })
                .option("timeLimit", {
                    type: "number",
                    description: "How many seconds the request should be permitted to last before being aborted",
                })
                .option("sizeLimit", {
                    type: "number",
                    description: "The maximum number of entries the request may return",
                })
                .option("scopeOfReferral", {
                    type: "string",
                    choices: [
                        "dmd",
                        "country",
                    ],
                    description: "The subset of referrals permitted to be returned",
                })
                .option("attributeSizeLimit", {
                    type: "number",
                    description: "The maximum permitted size of attributes to be returned"
                })

                // ServiceControlOptions
                .option("preferChaining", {
                    type: "boolean",
                    description: "Whether to ask the DSA to chain the operation to other DSAs rather than returning referrals",
                })
                .option("chainingProhibited", {
                    type: "boolean",
                    description: "Whether to explicitly prohibit chaining to other DSAs",
                })
                .option("localScope", {
                    type: "boolean",
                    description: "Whether the operation should be limited to a local scope",
                })
                .option("dontUseCopy", {
                    type: "boolean",
                    description: "Whether to permit the use of shadow DSEs or writeable copies.",
                })
                .option("dontDereferenceAliases", {
                    type: "boolean",
                    description: "Whether to prohibit dereferencing aliases",
                })
                .option("subentries", {
                    type: "boolean",
                    description: "Whether to only display subentries",
                })
                .option("copyShallDo", {
                    type: "boolean",
                    description: "Whether the DSA shall use a shadow DSE even if it is only able to partially satisfy the query",
                })
                .option("partialNameResolution", {
                    type: "boolean",
                    description: "Whether the DSA shall settle for the highest found entry if the target entry is not found.",
                })
                .option("manageDSAIT", {
                    type: "boolean",
                    description: "Whether the request shall break the illusion of a single unified directory and permit modification of operational attributes and knowledge references.",
                })
                .option("noSubtypeSelection", {
                    type: "boolean",
                    description: "Whether attribute subtypes shall not be selected",
                })
                .option("dontSelectFriends", {
                    type: "boolean",
                    description: "Whether friend attributes should not be selected",
                })

                .strict()
                .help()
                ;
        },
        handler: async (argv) => {
            const connection = await bind(ctx, argv);
            await read(ctx, connection, argv);
            await connection.close();
        },
    };
}

export default create;
