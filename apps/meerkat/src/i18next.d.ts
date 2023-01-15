// import the original type declarations
import "i18next";
// import all namespaces (for the default language, only)
import err from "assets/locales/en/language/err.json";
import log from "assets/locales/en/language/log.json";
import main from "assets/locales/en/language/main.json";

declare module "i18next" {
    // Extend CustomTypeOptions
    interface CustomTypeOptions {
        defaultNS: "en";
        resources: {
            err: typeof err;
            log: typeof log;
            main: typeof main;
        };
    }
}
