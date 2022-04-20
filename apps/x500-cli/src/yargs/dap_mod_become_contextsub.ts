// import type { Context } from "../types";
// import type { CommandModule } from "yargs";
// import bind from "../net/bind";
// import { do_modify_become_contextsub as command } from "../commands/dap/mod/become/contextsub";

// export
// function create (ctx: Context): CommandModule {
//     return {
//         command: "contextsub <object>",
//         describe: "Make a DSE into a collectiveAttributeSubentry",
//         builder: (y) => {
//             return y
//                 .positional("object", {
//                     type: "string",
//                     description: "The object to be modified",
//                 })
//                 .option("type", {
//                     alias: "t",
//                     type: "string",
//                     description: "The attribute type of the first TypeAndContextAssertion",
//                 })
//                 .option("preference", {
//                     alias: "p",
//                     type: "boolean",
//                     description: "Whether the TypeAndContextAssertion should use the 'preference' alternative rather than 'all'"
//                 })
//                 .
//                 .help()
//                 .strict()
//                 ;
//         },
//         handler: async (argv) => {
//             const connection = await bind(ctx, argv);
//             await command(ctx, connection, argv);
//             await connection.close();
//         },
//     };
// }

// export default create;
