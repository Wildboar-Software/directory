import * as dotenv from "dotenv";
dotenv.config();
import i18n from "i18next";
import I18FileSystemBackend from "i18next-fs-backend";
import osLocale from "os-locale";
import * as path from "path";
import main from "./app/main";
import { oidFromBytes, oidFromStr } from "./app/native/index";
import { ASN1Error, ObjectIdentifier } from "asn1-ts";

ObjectIdentifier.fromBytes = function (bytes: Uint8Array): ObjectIdentifier {
    const arcs = oidFromBytes(bytes);
    if (!arcs) {
        throw new ASN1Error("Malformed OID.");
    }
    return new ObjectIdentifier(arcs);
};

ObjectIdentifier.fromString = function (s: string): ObjectIdentifier {
    const arcs = oidFromStr(s);
    if (!arcs) {
        throw new ASN1Error("Malformed OID.");
    }
    return new ObjectIdentifier(arcs);
};

i18n
    .use(I18FileSystemBackend)
    .init({
        debug: false,
        lng: osLocale.sync().slice(0, 2),
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
