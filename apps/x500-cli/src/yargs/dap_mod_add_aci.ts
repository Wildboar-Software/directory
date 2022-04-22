import type { Context } from "../types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import {
    do_modify_add_aci as command,
} from "../commands/dap/mod/add/aci";

export
interface ModAddACIItemArgs {
    object?: string;
    type?: string;
    idtag?: string;
    precedence?: number;
    authLevel?: string;
    authLevelLocalQualifier?: number;
    authLevelSigned?: boolean;

    // From UserClasses
    allUsers?: boolean;
    thisEntry?: boolean;
    userName?: string[];
    userGroup?: string[];
    subtree?: string[];

    // From ProtectedItems
    entry?: boolean;
    allUserAttributeTypes?: boolean;
    attributeType?: string[];
    allAttributeValues?: string[];
    allUserAttributeTypesAndValues?: boolean;
    attributeValue?: string[];
    selfValue?: string[];
    // rangeOfValues
    maxValueCount?: string[];
    maxImmSub?: number;
    restrictedBy?: string[];
    // contexts
    classes?: string;

    // From GrantsAndDenials
    grantAdd?: boolean;
    denyAdd?: boolean;
    grantDiscloseOnError?: boolean;
    denyDiscloseOnError?: boolean;
    grantRead?: boolean;
    denyRead?: boolean;
    grantRemove?: boolean;
    denyRemove?: boolean;
    grantBrowse?: boolean;
    denyBrowse?: boolean;
    grantExport?: boolean;
    denyExport?: boolean;
    grantImport?: boolean;
    denyImport?: boolean;
    grantModify?: boolean;
    denyModify?: boolean;
    grantRename?: boolean;
    denyRename?: boolean;
    grantReturnDN?: boolean;
    denyReturnDN?: boolean;
    grantCompare?: boolean;
    denyCompare?: boolean;
    grantFilterMatch?: boolean;
    denyFilterMatch?: boolean;
    grantInvoke?: boolean;
    denyInvoke?: boolean;
}

export // eslint-disable-next-line @typescript-eslint/ban-types
function create (ctx: Context): CommandModule<{}, ModAddACIItemArgs> {
    return {
        command: "aci <object> <type> <idtag> <precedence> <authLevel>",
        describe: "Add an ACIItem to an entry",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object to be modified",
                })
                .positional("type", {
                    type: "string",
                    choices: [
                        "entry",
                        "subentry",
                        "prescriptive",
                    ],
                    description: "The object identifier of the access control scheme in use",
                })
                .positional("idtag", {
                    type: "string",
                    description: "The identification tag",
                })
                .positional("precedence", {
                    type: "number",
                    description: "The precedence, which must be greater than 0",
                })
                .positional("authLevel", {
                    type: "string",
                    choices: [
                        "none",
                        "simple",
                        "strong",
                    ],
                    description: "The authentication level",
                })
                .option("authLevelLocalQualifier", {
                    alias: "lq",
                    type: "number",
                })
                .option("authLevelSigned", {
                    alias: "signed",
                    type: "boolean",
                })
                .option("allUsers", {
                    type: "boolean",
                })
                .option("thisEntry", {
                    type: "boolean",
                })
                .option("userName", {
                    type: "array",
                    string: true,
                })
                .option("userGroup", {
                    type: "array",
                    string: true,
                })
                .option("subtree", {
                    type: "array",
                    string: true,
                })
                .option("entry", {
                    type: "boolean",
                })
                .option("allUserAttributeTypes", {
                    type: "boolean",
                })
                .option("attributeType", {
                    type: "array",
                    string: true,
                })
                .option("allAttributeValues", {
                    type: "array",
                    string: true,
                })
                .option("allUserAttributeTypesAndValues", {
                    type: "boolean",
                })
                .option("attributeValue", {
                    type: "array",
                    string: true,
                })
                .option("selfValue", {
                    type: "array",
                    string: true,
                })
                .option("maxValueCount", {
                    type: "array",
                    string: true,
                })
                .option("maxImmSub", {
                    type: "number",
                })
                .option("restrictedBy", {
                    type: "array",
                    string: true,
                })
                .option("classes", {
                    type: "string",
                })
                .option("grantAdd", {
                    type: "boolean",
                })
                .option("denyAdd", {
                    type: "boolean",
                })
                .option("grantDiscloseOnError", {
                    type: "boolean",
                })
                .option("denyDiscloseOnError", {
                    type: "boolean",
                })
                .option("grantRead", {
                    type: "boolean",
                })
                .option("denyRead", {
                    type: "boolean",
                })
                .option("grantRemove", {
                    type: "boolean",
                })
                .option("denyRemove", {
                    type: "boolean",
                })
                .option("grantBrowse", {
                    type: "boolean",
                })
                .option("denyBrowse", {
                    type: "boolean",
                })
                .option("grantExport", {
                    type: "boolean",
                })
                .option("denyExport", {
                    type: "boolean",
                })
                .option("grantImport", {
                    type: "boolean",
                })
                .option("denyImport", {
                    type: "boolean",
                })
                .option("grantModify", {
                    type: "boolean",
                })
                .option("denyModify", {
                    type: "boolean",
                })
                .option("grantRename", {
                    type: "boolean",
                })
                .option("denyRename", {
                    type: "boolean",
                })
                .option("grantReturnDN", {
                    type: "boolean",
                })
                .option("denyReturnDN", {
                    type: "boolean",
                })
                .option("grantCompare", {
                    type: "boolean",
                })
                .option("denyCompare", {
                    type: "boolean",
                })
                .option("grantFilterMatch", {
                    type: "boolean",
                })
                .option("denyFilterMatch", {
                    type: "boolean",
                })
                .option("grantInvoke", {
                    type: "boolean",
                })
                .option("denyInvoke", {
                    type: "boolean",
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
