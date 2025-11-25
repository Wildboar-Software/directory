import { configDotenv } from "dotenv";
configDotenv();
import i18n from "i18next";
import I18FileSystemBackend from "i18next-fs-backend";
import { osLocaleSync } from "os-locale";
import * as path from "path";
import main from "./app/main.js";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
