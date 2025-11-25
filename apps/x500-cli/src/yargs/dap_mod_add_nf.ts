import type { Context } from "../types.js";
import type { CommandModule } from "yargs";
import bind from "../net/bind.js";
import {
    do_modify_add_nf as command,
} from "../commands/dap/mod/add/nf.js";
import type { SchemaObjectArgs } from "../types.js";

// NameFormDescription ::= SEQUENCE {
//     identifier        NAME-FORM.&id,
//     name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//     description       UnboundedDirectoryString                      OPTIONAL,
//     obsolete          BOOLEAN                                       DEFAULT FALSE,
//     information  [0]  NameFormInformation,
//     ... }

//   NameFormInformation ::= SEQUENCE {
//     subordinate        OBJECT-CLASS.&id,
//     namingMandatories  SET OF ATTRIBUTE.&id,
//     namingOptionals    SET SIZE (1..MAX) OF ATTRIBUTE.&id OPTIONAL,
//     ... }

export
interface ModAddNameFormArgs extends SchemaObjectArgs {
    object?: string;
    id?: string;
    subordinate?: string;
    namingMandatories: string[];
    namingOptionals?: string[];
}

export // eslint-disable-next-line @typescript-eslint/ban-types
function create (ctx: Context): CommandModule<{}, ModAddNameFormArgs> {
    return {
        command: "sr <object> <id> <subordinate>",
        describe: "Add a name form to a subschema subentry",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object to be modified",
                })
                .positional("id", {
                    type: "string",
                    description: "The dot-delimited object identifier of the name form",
                })
                .positional("subordinate", {
                    type: "string",
                    description: "The dot-delimited object identifier of regulated structural object class",
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
                .option("namingMandatories", {
                    alias: "m",
                    type: "array",
                    string: true,
                    description: "The dot-delimited object identifier of an attribute type that MUST be present in the RDN for the regulated entry",
                })
                .option("namingOptionals", {
                    alias: "o",
                    type: "array",
                    string: true,
                    description: "The dot-delimited object identifier of an attribute type that MAY be present in the RDN for the regulated entry",
                })
                // It is not entirely clear that there MUST be at least one mandatory, but I would strongly think so.
                .demandOption("namingMandatories")
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
