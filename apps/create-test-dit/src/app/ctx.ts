import type { Context } from "./types";
import * as winston from "winston";
// import isDebugging from "is-debugging";

const winstonLogFormats: winston.Logform.Format[] = [];
if (!process.env["NO_COLOR"]) {
    winstonLogFormats.push(winston.format.colorize());
}
winstonLogFormats.push(winston.format.timestamp());
winstonLogFormats.push(winston.format.align());
winstonLogFormats.push(winston.format.printf(info => `${info["timestamp"]} [${info.level}]: ${info.message}`));

const ctx: Context = {
    log: winston.createLogger({
        level: "debug",
        format: winston.format.combine(...winstonLogFormats),
        transports: [
            new winston.transports.Console(),
        ],
    }),
    attributes: new Map(),
    objectClasses: new Map(),
    ldapSyntaxes: new Map(),
    contextTypes: new Map(),
    single: false,
};

export default ctx;
