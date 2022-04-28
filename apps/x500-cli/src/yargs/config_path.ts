import type { Context } from "../types";
import type { CommandModule } from "yargs";
import { findConfigurationFile } from "../config/findConfigurationFile";

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
