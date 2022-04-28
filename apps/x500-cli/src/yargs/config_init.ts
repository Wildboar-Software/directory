import type { Context } from "../types";
import type { CommandModule } from "yargs";
import { createConfigurationFile } from "../config/createConfigurationFile";

export
function create (ctx: Context): CommandModule {
    return {
        command: "init",
        describe: "Initialize an X.500 configuration file (directory.yaml) on your system",
        builder: (y) => y,
        handler: () => createConfigurationFile()
            .then(() => { ctx.log.info("Configuration file created."); }),
    };
}

export default create;
