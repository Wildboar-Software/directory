import type { Context } from "../types";
import type { CommandModule } from "yargs";
import { getConfig } from "../getConfig";
import { saveConfig } from "../saveConfig";
import { strict as assert } from "assert";
import { createConfigurationFile } from "../config/createConfigurationFile";
import type { ConfigAccessPoint } from "@wildboar/x500-cli-config";

interface Args {
    name: string;
    accessPoint: string[];
}

export
function create (ctx: Context): CommandModule<unknown, Args> {
    return {
        command: "dsa <name>",
        describe: "Add a DSA to the configuration file",
        builder: (y) => {
            return y
                .positional("name", {
                    type: "string",
                    description: "A case-sensitive name for the DSA",
                })
                .option("accessPoint", {
                    alias: "a",
                    type: "array",
                    string: true,
                    description: "Comma-separated access point URLs, optionally preceded by 'master', 'shadow', or 'wcopy' and a colon to indicate the category. e.g. shadow:idms://dsa01.example.com:109,ldap://dsa01.example.com:389",
                })
                .demandOption("name")
                .demandOption("accessPoint")
                .help()
                .strict()
                ;
        },
        handler: async (argv) => {
            if (!ctx.config) {
                ctx.log.warn("There is no configuration file to be edited. Creating one.");
                await createConfigurationFile();
                ctx.config = await getConfig(ctx);
            }
            assert(ctx.config);
            if (ctx.config.dsas.some((d) => d.name === argv.name)) {
                ctx.log.error(`DSA name '${argv.name}' already taken.`);
                process.exit(17);
            }
            ctx.config.dsas.push({
                name: argv.name,
                accessPoints: argv.accessPoint.map((a) => {
                    const category: string | undefined = Object.entries({
                        "master:": "master",
                        "shadow:": "shadow",
                        "wcopy:": "writeableCopy",
                    }).find(([ prefix, ]) => a.startsWith(prefix))?.[1];
                    const urlStrings = (category === undefined)
                        ? a.split(",")
                        : a.slice(a.indexOf(":") + 1).split(",");
                    const urls = urlStrings.map((str) => new URL(str));
                    for (const url of urls) {
                        if (url.username || url.password) {
                            console.warn("You supplied a username and password via a URL, but these will be ignored.");
                        }
                    }
                    return {
                        category,
                        urls: urlStrings,
                    };
                }) as [ConfigAccessPoint, ...ConfigAccessPoint[]],
            });
            await saveConfig(ctx.config);
        },
    };
}

export default create;
