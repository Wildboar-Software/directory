import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import list from "../commands/dap/list";

// ListArgumentData ::= SET {
//     object        [0]  Name,
//     pagedResults  [1]  PagedResultsRequest OPTIONAL,
//     listFamily    [2]  BOOLEAN DEFAULT FALSE,
//     ...,
//     ...,
//     COMPONENTS OF      CommonArguments
//     }

export
function create (ctx: Context): CommandModule {
    return {
        command: "list <object>",
        describe: "List subordinates of an entry",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    describe: "The entry whose subordinates are to be listed",
                })

                // PagedResultsRequest.newRequest parameters
                .option("pageSize", {
                    alias: "p",
                    type: "number",
                    describe: "The number of results per page",
                })
                .option("sortKey", {
                    alias: "s",
                    type: "array",
                    describe: "The object identifier of the attribute to sort by",
                })
                .option("reverse", {
                    alias: "r",
                    type: "boolean",
                    describe: "Whether to reverse the ordering of search results (descending)",
                })
                .option("unmerged", {
                    // alias: "u",
                    type: "boolean",
                    describe: "Do not merge search results that came from other DSAs",
                })
                .option("pageNumber", {
                    alias: "n",
                    type: "number",
                    describe: "The requested page number",
                })

                // listFamily
                .option("listFamily", {
                    alias: "f",
                    description: "Whether to only list the subordinates that are part of the same compound entry as the target object",
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
                .option("manageDSAIT", {
                    type: "boolean",
                    description: "Whether the request shall break the illusion of a single unified directory and permit modification of operational attributes and knowledge references.",
                })
                .option("countFamily", {
                    type: "boolean",
                    description: "Whether each member of a compound entry should count towards size limits",
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
                .strict()
                .help()
                ;
        },
        handler: async (argv) => {
            const connection = await bind(ctx, argv);
            await list(ctx, connection, argv);
            await connection.close();
        },
    };
}

export default create;
