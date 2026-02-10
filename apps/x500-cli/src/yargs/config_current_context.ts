import process from "node:process";
import type { Context } from "../types.js";
import type { CommandModule } from "yargs";

export
function create (ctx: Context): CommandModule {
    return {
        command: "current-context",
        describe: "Display the current-context",
        builder: (y) => y,
        handler: async () => {
            if (ctx.config?.["current-context"]) {
                console.info(ctx.config["current-context"]);
            } else {
                console.error("No current context set.");
                process.exit(1);
            }
        },
    };
}

export default create;
