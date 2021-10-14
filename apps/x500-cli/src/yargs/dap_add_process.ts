import type { Context } from "@wildboar/meerkat-types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import addEntry from "../commands/dap/add/applicationProcess";

// applicationProcess OBJECT-CLASS ::= {
//     SUBCLASS OF   {top}
//     MUST CONTAIN  {commonName}
//     MAY CONTAIN   {description |
//                    localityName |
//                    organizationalUnitName |
//                    seeAlso}
//     LDAP-NAME     {"applicationProcess"}   -- RFC 4519
//     ID            id-oc-applicationProcess }

export
function create (ctx: Context): CommandModule {
    return {
        command: "process <object> <cn>",
        describe: "Add an application process",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object",
                })
                .positional("cn", {
                    type: "string",
                    description: "The common name of the process",
                })
                .option("localityName", {
                    alias: "l",
                    type: "array",
                    description: "The name of the locality"
                })
                .option("organizationUnitName", {
                    alias: "o",
                    type: "array",
                    description: "The organizational unit name",
                })
                .option("description", {
                    alias: "d",
                    type: "array",
                    description: "An arbitrary description",
                })
                .option("seeAlso", {
                    alias: "a",
                    type: "array",
                    description: "The distinguished name of another related entry",
                })
                .help()
                .strict()
                ;
        },
        handler: async (argv) => {
            const connection = await bind(ctx, argv);
            await addEntry(ctx, connection, argv);
            await connection.close();
        },
    };
}

export default create;
