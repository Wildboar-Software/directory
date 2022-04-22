import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import {
    do_modify_add_cur as command,
} from "../commands/dap/mod/add/cur";
import type { SchemaObjectArgs } from "../types";

// DITContextUseDescription ::= SEQUENCE {
//     identifier        ATTRIBUTE.&id,
//     name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//     description       UnboundedDirectoryString OPTIONAL,
//     obsolete          BOOLEAN DEFAULT FALSE,
//     information  [0]  DITContextUseInformation,
//     ... }

// DITContextUseInformation ::= SEQUENCE {
//     mandatoryContexts  [1]  SET SIZE (1..MAX) OF CONTEXT.&id OPTIONAL,
//     optionalContexts   [2]  SET SIZE (1..MAX) OF CONTEXT.&id OPTIONAL,
//     ... }

export
interface ModAddContextUseRuleArgs extends SchemaObjectArgs {
    object?: string;
    identifier?: string;
    mandatoryContexts?: string[];
    optionalContexts?: string[];
}

export // eslint-disable-next-line @typescript-eslint/ban-types
function create (ctx: Context): CommandModule<{}, ModAddContextUseRuleArgs> {
    return {
        command: "cur <object> <identifier>",
        describe: "Add a context use rule to a subschema subentry",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object to be modified",
                })
                .positional("identifier", {
                    type: "string",
                    description: "The dot-delimited object identifier of the regulated attribute type",
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
                .option("mandatoryContexts", {
                    alias: "m",
                    type: "array",
                    string: true,
                })
                .option("optionalContexts", {
                    alias: "o",
                    type: "array",
                    string: true,
                })
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
