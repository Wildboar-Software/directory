import type { Context } from "../types.js";
import type { CommandModule } from "yargs";
import bind from "../net/bind.js";
import search from "../commands/dap/search.js";

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
                    describe: "The subset of the search: baseObject, oneLevel, or subtree",
                    // These enum values come from LDAP URLs.
                    choices: [ "base", "one", "sub", "level", "tree" ],
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
                    alias: "a",
                    type: "number",
                    describe: "The extended area to search",
                })
                // REVIEW: I don't know if this will work.
                // Meaning: combining arrays with enums.
                .options("hierarchySelections", {
                    alias: "h",
                    type: "array",
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
                })
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
                // TODO: Not used.
                .option("familyReturn", {
                    type: "string",
                    choices: [
                        "contributing",
                        "participating",
                        "compound",
                    ],
                    description: "The type of familyReturn to use"
                })
                .option("familySelect", {
                    alias: "f",
                    type: "string",
                    description: "Dot-delimited object identifier of family to return in compound entries",
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
                .option("noSubtypeMatch", {
                    type: "boolean",
                    description: "Whether attribute subtypes shall not be matched",
                })
                .option("noSubtypeSelection", {
                    type: "boolean",
                    description: "Whether attribute subtypes shall not be selected",
                })
                .option("countFamily", {
                    type: "boolean",
                    description: "Whether each member of a compound entry should count towards size limits",
                })
                .option("dontSelectFriends", {
                    type: "boolean",
                    description: "Whether friend attributes should not be selected",
                })
                .option("dontMatchFriends", {
                    type: "boolean",
                    description: "Whether friend attributes should not be matched",
                })
                .option("allowWriteableCopy", {
                    type: "boolean",
                    description: "Whether a DSE of type writeableCopy is acceptable in the provision of a query service request.",
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
                // TODO: manageDSAITPlaneRef
                .option("serviceType", {
                    type: "string",
                    description: "Dot-delimited object identifier of the search service to request",
                })
                .option("userClass", {
                    type: "number",
                    description: "The search service user class to request"
                })
                .option("familyGrouping", {
                    type: "string",
                    choices: [
                        "entryOnly",
                        "compoundEntry",
                        "strands",
                        "multiStrand",
                    ],
                    description: "How families of entries in a compound entry are combined for the sake of operation evaluation"
                })
                .help()
                ;
        },
        handler: async (argv) => {
            const connection = await bind(ctx, argv);
            await search(ctx, connection, argv);
            await connection.close();
        },
    };
}

export default create;
