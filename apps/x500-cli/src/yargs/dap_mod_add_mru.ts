import type { Context } from "../types.js";
import type { CommandModule } from "yargs";
import bind from "../net/bind.js";
import {
    do_modify_add_mru as command,
} from "../commands/dap/mod/add/mru.js";
import type { SchemaObjectArgs } from "../types.js";

// MatchingRuleUseDescription ::= SEQUENCE {
//     identifier        MATCHING-RULE.&id,
//     name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//     description       UnboundedDirectoryString                      OPTIONAL,
//     obsolete          BOOLEAN                                       DEFAULT FALSE,
//     information  [0]  SET OF ATTRIBUTE.&id,
//     ... }

export
interface ModAddMatchingRuleUseArgs extends SchemaObjectArgs {
    object?: string;
    identifier?: string;
    attribute: string[];
}

export // eslint-disable-next-line @typescript-eslint/ban-types
function create (ctx: Context): CommandModule<{}, ModAddMatchingRuleUseArgs> {
    return {
        command: "mru <object> <identifier>",
        describe: "Add a matching rule use to a subschema subentry",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object to be modified",
                })
                .positional("identifier", {
                    type: "string",
                    description: "The dot-delimited object identifier of the matching rule",
                })
                .option("name", {
                    type: "array",
                    string: true,
                    description: "Names for this schema object",
                })
                .option("description", {
                    type: "string",
                    description: "A human-readable description for this schema object",
                })
                .option("obsolete", {
                    type: "boolean",
                    description: "Whether this schema object cannot be used any longer",
                })
                .option("attribute", {
                    alias: "a",
                    type: "array",
                    string: true,
                    description: "The dot-delimited object identifier of an attribute type that MAY be evaluated using the regulated matching rule",
                })
                // It is not entirely clear that there MUST be at least one mandatory, but I would strongly think so.
                .demandOption("attribute")
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
