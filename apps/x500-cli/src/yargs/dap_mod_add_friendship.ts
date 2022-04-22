import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import {
    do_modify_add_friendship as command,
} from "../commands/dap/mod/add/friendship";
import type { SchemaObjectArgs } from "../types";

// FriendsDescription ::= SEQUENCE {
//     anchor            ATTRIBUTE.&id,
//     name              SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//     description       UnboundedDirectoryString OPTIONAL,
//     obsolete          BOOLEAN DEFAULT FALSE,
//     friends      [0]  SET SIZE (1..MAX) OF ATTRIBUTE.&id,
//     ... }

export
interface ModAddFriendshipArgs extends SchemaObjectArgs {
    object?: string;
    anchor?: string;
    friend: string[];
}

export // eslint-disable-next-line @typescript-eslint/ban-types
function create (ctx: Context): CommandModule<{}, ModAddFriendshipArgs> {
    return {
        command: "friendship <object> <anchor>",
        describe: "Add a friendship to a subschema subentry",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object to be modified",
                })
                .positional("anchor", {
                    type: "string",
                    description: "The dot-delimited object identifier of the anchor attribute type",
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
                .option("friend", {
                    alias: "f",
                    type: "array",
                    string: true,
                    description: "Dot-delimited object identifier of an attribute type that is a friend of the anchor",
                })
                .demandOption("friend")
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
