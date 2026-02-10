import process from "node:process";
import type { Context } from "../types.js";
import type { CommandModule } from "yargs";
import { findConfigurationFile } from "../config/findConfigurationFile.js";

export
function create (ctx: Context): CommandModule {
    return {
        command: "path",
        describe: "View the path to the X.500 configuration file (directory.yaml) on your system",
        builder: (y) => y,
        handler: async () => {
            const path = await findConfigurationFile(ctx);
            if (path) {
                console.log(path);
            } else {
                console.error("NO CONFIGURATION FILE FOUND");
                process.exit(1);
            }
        },
    };
}

export default create;
