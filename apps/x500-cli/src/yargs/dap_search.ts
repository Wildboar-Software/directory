import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import search from "../commands/dap/search";

export
function create (ctx: Context): CommandModule {
    return {
        command: "search <object> <subset>",
        describe: "Search",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    describe: "The base object of the search",
                })
                .positional("subset", {
                    type: "string",
                    describe: "The subset of the search: base, one, or sub",
                    // These enum values come from LDAP URLs.
                    choices: [ "base", "one", "sub" ],
                })
                .option("dontSearchAliases", {
                    type: "boolean",
                    describe: "Do not search aliases",
                    default: false,
                })
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
                // TODO: dap search continue
                // TODO: dap search abandon
                .option("matchedValuesOnly", {
                    alias: "m",
                    type: "boolean",
                    describe: "Whether only attribute values that contributed to the match should be returned.",
                    default: false,
                })
                .option("checkOverspecified", {
                    alias: "o",
                    type: "boolean",
                    describe: "DSA should check if filter is overspecified",
                })
                .option("extendedArea", {
                    alias: "x",
                    type: "number",
                    describe: "The extended area to search",
                })
                .options("hierarchySelections", {
                    alias: "h",
                    type: "string",
                    describe: "Which members of a hierarchy to select",
                    choices: [
                        "self",
                        "children",
                        "parent",
                        "hierarchy",
                        "top",
                        "subtree",
                        "siblings",
                        "siblingChildren",
                        "siblingSubtree",
                        "all",
                    ],
                    default: "self",
                })
                // Already covered
                // .option("searchAliases", {
                //     type: "boolean",
                //     describe: "",
                //     default: false,
                // })
                // .option("matchedValuesOnly", {
                //     type: "boolean",
                //     describe: "",
                //     default: false,
                // })
                // .option("checkOverspecified", {
                //     type: "boolean",
                //     describe: "",
                //     default: false,
                // })
                .option("performExactly", {
                    alias: "e",
                    type: "boolean",
                    describe: "Do not ignore unrecognized filtering rules",
                    default: false,
                })
                .option("includeAllAreas", {
                    alias: "i",
                    type: "boolean",
                    describe: "Perform inclusive relaxation",
                    default: false,
                })
                .option("noSystemRelaxation", {
                    alias: "l",
                    type: "boolean",
                    describe: "DSA shall not apply relaxation",
                    default: false,
                })
                .option("dnAttribute", {
                    alias: "d",
                    type: "boolean",
                    describe: "Evaluate distinguished name values as a part of the search",
                    default: false,
                })
                .option("matchOnResidualName", {
                    type: "boolean",
                    describe: "",
                    default: false,
                })
                .option("entryCount", {
                    type: "boolean",
                    describe: "Return a count of matching entries",
                    default: false,
                })
                .option("useSubset", {
                    type: "boolean",
                    describe: "Ignore imposedSubset component of search rule",
                    default: false,
                })
                .option("separateFamilyMembers", {
                    type: "boolean",
                    describe: "Family members shall be returned as separate entries",
                    default: false,
                })
                .option("searchFamily", {
                    type: "boolean",
                    describe: "Treat family members as separate for the purposes of filtering",
                    default: false,
                })
                .option("userAttribute", {
                    alias: "u",
                    type: "array",
                    describe: "Dot-delimited object identifier of attribute type to select",
                })
                // TODO: EIS options: extraAttribute, familyReturn, etc.
                .help()
                ;
        },
        handler: async (argv) => {
            const connection = await bind(ctx, argv);
            console.log(`Bound at ${new Date()}`);
            await search(ctx, connection, argv);
            await connection.close();
        },
    };
}

export default create;
