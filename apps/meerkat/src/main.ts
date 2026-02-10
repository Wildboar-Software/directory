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

function shutdown () {
    process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cmdIndex = process.argv[1]?.endsWith("js") ? 2 : 1;

function displayHelp() {
    console.log("start - Start Meerkat DSA");
    console.log("version - Display the Meerkat DSA version");
    console.log("help - Show this help page");
    console.log("Currently, none of these take any arguments");
}

async function displayVersion(): Promise<void> {
    return import("../package.json")
        .then((pj) => console.log(pj.default.version))
        .catch((e) => console.error(e));
}

let cmd = process.argv[cmdIndex];

for (const arg of process.argv.slice(cmdIndex)) {
    const larg = arg.toLowerCase();
    if (larg === "--help" || larg === "-h") {
        cmd = "help";
    }
    if (larg === "--version" || larg === "-v") {
        cmd = "version";
    }
}

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
                .then(main)
                .catch((e) => {
                    console.error(`COULD_NOT_START: ${e}`);
                    console.error(e?.stack ?? "NO STACK");
                    process.exit(1);
                });
        break;
    }
    case ("version"): {
        displayVersion().then();
        break;
    }
    case ("help"): {
        displayHelp();
        break;
    }
    default: {
        if (cmd) {
            console.error(`Command ${cmd} not recognized.`);
        } else {
            console.error("No subcommand supplied.");
        }
        console.error(`Recognized subcommands are:`);
        displayHelp();
        process.exit(1);
    }
}
