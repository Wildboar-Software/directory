import type { Context } from "../types.js";
import type { CliCommand } from "./builder.js";
import { createConfigurationFile } from "../config/createConfigurationFile.js";

export
function create (ctx: Context): CliCommand {
    return {
        command: "init",
        describe: "Initialize an X.500 configuration file (directory.yaml) on your system",
        builder: (y) => y,
        handler: () => createConfigurationFile()
            .then(() => { ctx.log.info("Configuration file created."); }),
    };
}

export default create;
