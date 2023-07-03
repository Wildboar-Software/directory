import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import {
    do_modify_add_oc as command,
} from "../commands/dap/mod/add/oc";
import type { SchemaObjectArgs } from "../types";

// ObjectClassDescription ::= SEQUENCE {
//     identifier        OBJECT-CLASS.&id,
//     name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//     description       UnboundedDirectoryString                      OPTIONAL,
//     obsolete          BOOLEAN                                       DEFAULT FALSE,
//     information  [0]  ObjectClassInformation,
//     ... }

// ObjectClassInformation ::= SEQUENCE {
//     subclassOf        SET SIZE (1..MAX) OF OBJECT-CLASS.&id OPTIONAL,
//     kind              ObjectClassKind                       DEFAULT structural,
//     mandatories  [3]  SET SIZE (1..MAX) OF ATTRIBUTE.&id    OPTIONAL,
//     optionals    [4]  SET SIZE (1..MAX) OF ATTRIBUTE.&id    OPTIONAL,
//     ... }

export
interface ModAddObjectClassArgs extends SchemaObjectArgs {
    object?: string;
    identifier?: string;
    subclassOf?: string[];
    kind?: string;
    mandatories?: string[];
    optionals?: string[];
}

export // eslint-disable-next-line @typescript-eslint/ban-types
function create (ctx: Context): CommandModule<{}, ModAddObjectClassArgs> {
    return {
        command: "oc <object> <identifier>",
        describe: "Add an object class definition to a subschema subentry",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object to be modified",
                })
                .positional("identifier", {
                    type: "string",
                    description: "The dot-delimited object identifier of the object class",
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
                .option("subclassOf", {
                    alias: "s",
                    type: "array",
                    string: true,
                })
                .option("kind", {
                    alias: "k",
                    type: "string",
                })
                .option("mandatories", {
                    alias: "m",
                    type: "array",
                    string: true,
                })
                .option("optionals", {
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
