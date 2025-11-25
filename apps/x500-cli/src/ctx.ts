import type { Context } from "./types.js";
import {
    configure as configureLogging,
    getConsoleSink,
    getLogger,
    ansiColorFormatter,
} from "@logtape/logtape";

await configureLogging({
    sinks: {
        safe: getConsoleSink(),
        // See: https://no-color.org/
        all: getConsoleSink({ formatter: process.env.NO_COLOR ? undefined : ansiColorFormatter }),
    },
    loggers: [
        { category: ["logtape", "meta"], lowestLevel: "warning", sinks: ["safe"] },
        { category: ["cli"], lowestLevel: "info", sinks: ["all"] },
    ]
});

export
const ctx: Context = {
    log: getLogger("cli"),
    attributes: new Map(),
    objectClasses: new Map(),
    ldapSyntaxes: new Map(),
    contextTypes: new Map(),
};

export default ctx;
