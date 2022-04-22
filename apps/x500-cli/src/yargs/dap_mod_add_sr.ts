import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import {
    do_modify_add_acs as command,
} from "../commands/dap/mod/add/acs";
import type { SchemaObjectArgs } from "../types";

// DITStructureRuleDescription ::= SEQUENCE {
//     COMPONENTS OF DITStructureRule,
//     name         [1]  SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//     description       UnboundedDirectoryString OPTIONAL,
//     obsolete          BOOLEAN DEFAULT FALSE,
//     ... }

// DITStructureRule ::= SEQUENCE {
//     ruleIdentifier          RuleIdentifier,
//                    -- shall be unique within the scope of the subschema
//     nameForm                NAME-FORM.&id,
//     superiorStructureRules  SET SIZE (1..MAX) OF RuleIdentifier OPTIONAL,
//     ... }

export
interface ModAddStructureRuleArgs extends SchemaObjectArgs {
    object?: string;
    ruleid?: number;
    nameform?: string;
    superiorStructureRule?: number[];
}

export // eslint-disable-next-line @typescript-eslint/ban-types
function create (ctx: Context): CommandModule<{}, ModAddStructureRuleArgs> {
    return {
        command: "sr <object> <ruleid> <nameform>",
        describe: "Add a DIT Structure Rule to a subschema subentry",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object to be modified",
                })
                .positional("ruleid", {
                    type: "number",
                })
                .positional("nameform", {
                    type: "string",
                    description: "The dot-delimited object identifier of the name form",
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
                .option("superiorStructureRule", {
                    alias: "s",
                    type: "array",
                    number: true,
                    description: "A superior structure rule this structure rule may have. If none are specified, this structure rule applies to the subschema administrative point.",
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
