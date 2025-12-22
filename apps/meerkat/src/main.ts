/* This MUST be an ESM import instead of using dotenv.config(), because the ESM
imports get hoisted to the top of the file (virtually speaking), but we need these
environment variables to be loaded before any other code is executed. */
import 'dotenv/config';
import i18n from "i18next";
import I18FileSystemBackend from "i18next-fs-backend";
import { osLocaleSync } from "os-locale";
import * as path from "path";
import main from "./app/main.js";
import { fileURLToPath } from "node:url";
import ctx from "./app/ctx.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cmdIndex = process.argv[1]?.endsWith("js") ? 2 : 1;

let nextArgIsConfig: boolean = false;
let configPath: string = "";
for (const arg of process.argv.slice(cmdIndex)) {
    if (nextArgIsConfig) {
        configPath = arg;
        nextArgIsConfig = false;
        continue;
    }
    if (arg.toLowerCase() == "--config") {
        nextArgIsConfig = true;
        continue;
    }
}

const cmd = process.argv[cmdIndex];

switch (cmd) {
    case ("start"):
    {
        i18n
            .use(I18FileSystemBackend)
            .init({
                debug: false,
                lng: osLocaleSync().slice(0, 2),
                ns: [
                    "main",
                    "err",
                    "log",
                ],
                fallbackLng: "en",
                pluralSeparator: "#",
                contextSeparator: "@",
                backend: {
                    loadPath: path.join(__dirname, "./assets/locales/{{lng}}/language/{{ns}}.json"),
                    addPath: path.join(__dirname, "./assets/locales/{{lng}}/language/{{ns}}.missing.json"),
                },
                initImmediate: false,
                interpolation: {
                    /**
                     * This is not a web application, and the web admin console does not
                     * use internationalization, so there is no need to escape HTML
                     * characters here.
                     */
                    escapeValue: false,
                },
            })
                .then(async () => {
                    if (configPath) {
                        const config = await import(configPath);
                        if (("default" in config) && (typeof config.default === "function")) {
                            ctx.config = await config.default();
                        } else {
                            console.error(i18n.t("log:invalid_config_js"));
                            process.exit(1);
                        }
                    }
                })
                .then(main)
                // .then(async () => await import("./app/main.js").then(({ default: main }) => main()))
                // .then(({ default: main }) => main())
                .catch((e) => {
                    console.error(`COULD_NOT_START: ${e}`);
                    console.error(e?.stack ?? "NO STACK");
                    process.exit(1);
                });
        break;
    }
    default: {
        console.error(`Command ${cmd} not recognized.`);
        console.error(`Recognized commands are:`);
        console.error(`start - Starts Meerkat DSA`);
        process.exit(1);
    }
}
