import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import {
    do_modify_add_cr as command,
} from "../commands/dap/mod/add/cr";
import type { SchemaObjectArgs } from "../types";

// dITContentRules ATTRIBUTE ::= {
//     WITH SYNTAX              DITContentRuleDescription
//     EQUALITY MATCHING RULE   objectIdentifierFirstComponentMatch
//     USAGE                    directoryOperation
//     LDAP-SYNTAX              dITContentRuleDescription.&id
//     LDAP-NAME                {"dITContentRules"}
//     ID                       id-soa-dITContentRules }

// DITContentRule ::= SEQUENCE {
//     structuralObjectClass       OBJECT-CLASS.&id,
//     auxiliaries                 SET SIZE (1..MAX) OF OBJECT-CLASS.&id OPTIONAL,
//     mandatory              [1]  SET SIZE (1..MAX) OF ATTRIBUTE.&id    OPTIONAL,
//     optional               [2]  SET SIZE (1..MAX) OF ATTRIBUTE.&id    OPTIONAL,
//     precluded              [3]  SET SIZE (1..MAX) OF ATTRIBUTE.&id    OPTIONAL,
//     ... }

//   DITContentRuleDescription ::= SEQUENCE {
//     COMPONENTS OF DITContentRule,
//     name         [4]  SET SIZE (1..MAX) OF UnboundedDirectoryString OPTIONAL,
//     description       UnboundedDirectoryString OPTIONAL,
//     obsolete          BOOLEAN DEFAULT FALSE,
//     ... }

export
interface ModAddContentRuleArgs extends SchemaObjectArgs {
    object?: string;
    structuralObjectClass?: string;
    auxiliaries?: string[];
    mandatory?: string[];
    optional?: string[];
    precluded?: string[];
}

export // eslint-disable-next-line @typescript-eslint/ban-types
function create (ctx: Context): CommandModule<{}, ModAddContentRuleArgs> {
    return {
        command: "cr <object> <structuralObjectClass>",
        describe: "Add a content rule to a subschema subentry",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object to be modified",
                })
                .positional("structuralObjectClass", {
                    type: "string",
                    description: "The dot-delimited object identifier of the regulated structural object class",
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
                .option("auxiliaries", {
                    alias: "a",
                    type: "array",
                    string: true,
                    description: "Dot-delimited object identifiers of auxiliary object classes the regulated entry MAY have",
                })
                .option("mandatory", {
                    alias: "m",
                    type: "array",
                    string: true,
                    description: "Dot-delimited object identifiers of attribute types the regulated entry MUST have",
                })
                .option("optional", {
                    alias: "o",
                    type: "array",
                    string: true,
                    description: "Dot-delimited object identifiers of attribute types the regulated entry MAY have above and beyond those permitted by its object classes",
                })
                .option("precluded", {
                    alias: "p",
                    type: "array",
                    string: true,
                    description: "Dot-delimited object identifiers of attribute types the regulated entry MUST NOT have",
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
