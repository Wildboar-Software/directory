import { Argv } from "yargs";

export
interface CommonAddOptions {
    targetSystem?: string[];
    preferChaining?: boolean;
    chainingProhibited?: boolean;
    localScope?: boolean;
    dontDereferenceAliases?: boolean;
    manageDSAIT?: boolean;
    priority?: string;
    timeLimit?: number;
    scopeOfReferral?: string;
}

export
function add_common_add_opts <T> (args: Argv<T>): Argv<T & CommonAddOptions> {
    return args
        .option("targetSystem", {
            type: "array",
            description: "URLs of the target DSAs to receive this entry via a newly established hierarchical operational binding",
            string: true, // TODO: Add this to all other array options.
        })
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
        .option("manageDSAIT", {
            type: "boolean",
            description: "Whether the request shall break the illusion of a single unified directory and permit modification of operational attributes and knowledge references.",
        })
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
            description: "",
        })
        .option("scopeOfReferral", {
            type: "string",
            choices: [
                "dmd",
                "country",
            ],
            description: "The subset of referrals permitted to be returned",
        })
        ;
}
