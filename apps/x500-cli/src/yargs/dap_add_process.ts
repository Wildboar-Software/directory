import type { Context } from "../types";
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
        command: "process <object>",
        describe: "Add an application process",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object",
                })
                .option("commonName", {
                    alias: "cn",
                    type: "string",
                    description: "The common name of the process",
                })
                .option("localityName", {
                    alias: "l",
                    type: "array",
                    description: "The name of the locality"
                })
                .option("organizationUnitName", {
                    alias: "ou",
                    type: "array",
                    description: "The organizational unit name",
                })
                .option("description", {
                    type: "array",
                    description: "An arbitrary description",
                })
                .option("seeAlso", {
                    type: "array",
                    description: "The distinguished name of another related entry",
                })
                .demandOption("commonName")
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
