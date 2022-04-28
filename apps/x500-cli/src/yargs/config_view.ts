import type { Context } from "../types";
import type { CommandModule } from "yargs";
import { findConfigurationFile } from "../config/findConfigurationFile";
import * as fs from "fs/promises";

export
function create (ctx: Context): CommandModule {
    return {
        command: "view",
        describe: "View the X.500 configuration file (directory.yaml) on your system",
        builder: (y) => y,
        handler: async () => {
            const path = await findConfigurationFile(ctx);
            if (!path) {
                console.error("NO CONFIGURATION FILE FOUND");
                process.exit(1);
            }
            console.log(await fs.readFile(path, { encoding: "utf-8" }));
        },
    };
}

export default create;
