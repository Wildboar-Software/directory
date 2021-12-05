import { Context, Vertex } from "@wildboar/meerkat-types";
import { v4 as uuid } from "uuid";
import {
    AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import {
    PresentationAddress,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/PresentationAddress.ta";
import {
    top,
} from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
import { PrismaClient } from "@prisma/client";
import objectClassFromInformationObject from "./init/objectClassFromInformationObject";
import { EventEmitter } from "stream";
import winston from "winston";
import isDebugging from "is-debugging";
import i18n from "i18next";
import {
    uriToNSAP,
} from "@wildboar/x500/src/lib/distributed/uri";
import * as path from "path";
import { URL } from "url";

const myNSAPs: Uint8Array[] = process.env.MEERKAT_MY_ACCESS_POINT_NSAPS
    ? process.env.MEERKAT_MY_ACCESS_POINT_NSAPS
        .split(/\s+/g)
        .map((url) => uriToNSAP(url, (url.startsWith("itot://"))))
    : [];

const rootID = uuid();
const root: Vertex = {
    subordinates: [],
    dse: {
        id: 1,
        uuid: rootID,
        rdn: [],
        objectClass: new Set(),
        createTimestamp: new Date(),
        modifyTimestamp: new Date(),
    },
};
const bulkInsertMode: boolean = (process.env.MEERKAT_BULK_INSERT_MODE === "1");
const logNoColor: boolean = (process.env.MEERKAT_NO_COLOR === "1");
const logNoTimestamp: boolean = (process.env.MEERKAT_NO_TIMESTAMP === "1");
const logLevel: string = (process.env.MEERKAT_LOG_LEVEL ?? "info");
const logJson: boolean = (process.env.MEERKAT_LOG_JSON === "1");
const logNoConsole: boolean = (process.env.MEERKAT_NO_CONSOLE === "1");
// const logToWindows: boolean = (process.env.MEERKAT_LOG_WINDOWS === "1");
// const logToSyslog: boolean = (process.env.MEERKAT_LOG_SYSLOG === "1");
const logToFile: string | undefined = (() => {
    if (!process.env.MEERKAT_LOG_FILE) {
        return undefined;
    }
    try {
        path.parse(process.env.MEERKAT_LOG_FILE);
        return process.env.MEERKAT_LOG_FILE;
    } catch {
        console.error(`INVALID MEERKAT_LOG_FILE PATH ${process.env.MEERKAT_LOG_FILE}`);
        process.exit(1);
    }
})();
const logFileMaxSize: number = Number.parseInt(process.env.MEERKAT_LOG_FILE_MAX_SIZE ?? "1000000");
const logFileMaxFiles: number = Number.parseInt(process.env.MEERKAT_LOG_FILE_MAX_FILES ?? "100");
const logFileZip: boolean = (process.env.MEERKAT_LOG_ZIP === "1");
const logFilesTailable: boolean = (process.env.MEERKAT_LOG_TAILABLE === "1");
const logToHTTP: winston.transports.HttpTransportOptions | undefined = (() => {
    if (!process.env.MEERKAT_LOG_HTTP) {
        return undefined;
    }
    try {
        const url = new URL(process.env.MEERKAT_LOG_HTTP);
        const ssl: boolean = (url.protocol.toLowerCase() === "https:");
        const port = Number.parseInt(url.port);
        return {
            ssl,
            host: url.host,
            port: Number.isSafeInteger(port) && (port > 0)
                ? port
                : (ssl ? 443 : 80),
            auth: url.username?.length
                ? {
                    username: url.username,
                    password: url.password,
                }
                : undefined,
            path: url.pathname,
        };
    } catch {
        console.error(`INVALID MEERKAT_LOG_HTTP URL ${process.env.MEERKAT_LOG_HTTP}`);
        process.exit(1);
    }
})();

const winstonLogFormats: winston.Logform.Format[] = [];
if (!logNoColor) {
    winstonLogFormats.push(winston.format.colorize());
}
if (!logNoTimestamp) {
    winstonLogFormats.push(winston.format.timestamp());
}
if (logJson) {
    winstonLogFormats.push(winston.format.json());
} else {
    winstonLogFormats.push(winston.format.align());
    winstonLogFormats.push(winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`));
}

const winstonTransports: winston.transport[] = [];
if (!logNoConsole) {
    winstonTransports.push(new winston.transports.Console());
}
if (logToFile) {
    winstonTransports.push(new winston.transports.File({
        filename: logToFile,
        maxsize: logFileMaxSize,
        maxFiles: logFileMaxFiles,
        zippedArchive: logFileZip,
        tailable: logFilesTailable,
    }));
}
if (logToHTTP) {
    winstonTransports.push(new winston.transports.Http(logToHTTP));
}

const ctx: Context = {
    i18n,
    config: {
        localQualifierPointsFor: {
            usingStartTLS: process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_STARTTLS
                ? Number.parseInt(process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_STARTTLS, 10)
                : 0,
            usingTLS: process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS
                ? Number.parseInt(process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS, 10)
                : 0,
            usingSSLv3: process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_SSL3
                ? Number.parseInt(process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_SSL3, 10)
                : 0,
            usingTLSv1_0: process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_0
                ? Number.parseInt(process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_0, 10)
                : 0,
            usingTLSv1_1: process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_1
                ? Number.parseInt(process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_1, 10)
                : 0,
            usingTLSv1_2: process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_2
                ? Number.parseInt(process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_2, 10)
                : 0,
            usingTLSv1_3: process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_3
                ? Number.parseInt(process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_3, 10)
                : 0,
        },
        sentinelDomain: process.env.MEERKAT_SENTINEL_DOMAIN,
        administratorEmail: process.env.MEERKAT_ADMINISTRATOR_EMAIL,
        bulkInsertMode,
        bindMinSleepInMilliseconds: Number.parseInt(process.env.MEERKAT_BIND_MIN_SLEEP_MS ?? "") || 1000,
        bindSleepRangeInMilliseconds: Number.parseInt(process.env.MEERKAT_BIND_SLEEP_RANGE_MS ?? "") || 1000,
        minAuthLevelForOperationalBinding: Number.parseInt(process.env.MEERKAT_MIN_AUTH_LEVEL_FOR_OB ?? "1"),
        minAuthLocalQualifierForOperationalBinding: Number.parseInt(process.env.MEERKAT_MIN_AUTH_LOCAL_QUALIFIER_FOR_OB ?? "128"),
        myAccessPointNSAPs: myNSAPs,
        useDatabaseWhenThereAreXSubordinates: process.env.MEERKAT_USE_DATABASE_WHEN_THERE_ARE_X_SUBORDINATES
            ? Number.parseInt(process.env.MEERKAT_USE_DATABASE_WHEN_THERE_ARE_X_SUBORDINATES)
            : 1000,
        prohibitChaining: process.env.MEERKAT_PROHIBIT_CHAINING
            ? (process.env.MEERKAT_PROHIBIT_CHAINING === "1")
            : false,
        entriesPerSubordinatesPage: process.env.MEERKAT_ENTRIES_PER_SUBORDINATES_PAGE
            ? Number.parseInt(process.env.MEERKAT_ENTRIES_PER_SUBORDINATES_PAGE)
            : 100,
        transcodeValuesToDER: ( // Currently does not do anything.
            !process.env.MEERKAT_TRANSCODE_VALUES_TO_DER
            || (process.env.MEERKAT_TRANSCODE_VALUES_TO_DER === "1")
        ),
        transcodeDistinguishedValuesToDER: ( // Currently does not do anything.
            !process.env.MEERKAT_TRANSCODE_DISTINGUISHED_VALUES_TO_DER
            || (process.env.MEERKAT_TRANSCODE_DISTINGUISHED_VALUES_TO_DER === "1")
        ),
    },
    dsa: {
        accessPoint: new AccessPoint(
            {
                rdnSequence: [], // To be set later.
            },
            new PresentationAddress(
                undefined,
                undefined,
                undefined,
                myNSAPs,
            ),
            undefined,
        ),
        hibernatingSince: undefined,
    },
    dit: {
        root,
    },
    log: winston.createLogger({
        level: isDebugging
            ? "debug"
            : logLevel,
        format: winston.format.combine(...winstonLogFormats),
        transports: winstonTransports,
    }),
    db: new PrismaClient(),
    telemetry: {
        sendEvent: (body: Record<string, any>) => {
            if (bulkInsertMode) {
                return;
            }
            // if (process.env.NODE_ENV === "development") {
            //     console.debug(body);
            // }
            // try {
            //     axios.post(telemetryURL, body, {
            //         headers: {
            //             "Content-Type": "application/json",
            //         },
            //         auth: {
            //             username: "859EA8D1-503C-4C0F-9B7F-28AD3AA1451D",
            //             password: "399274DA-9CB1-471E-9C99-91A2D532DA8C",
            //         },
            //     })
            //         .catch(() => {}); // eslint-disable-line
            // } catch {} // eslint-disable-line
        },
    },
    structuralObjectClassHierarchy: {
        ...objectClassFromInformationObject(top),
        parent: undefined,
        children: [],
    },
    objectIdentifierToName: new Map(),
    nameToObjectIdentifier: new Map(),
    objectClasses: new Map(),
    attributeTypes: new Map(),
    equalityMatchingRules: new Map(),
    orderingMatchingRules: new Map(),
    substringsMatchingRules: new Map(),
    approxMatchingRules: new Map(),
    contextTypes: new Map(),
    matchingRulesSuitableForNaming: new Set(),
    ldapSyntaxes: new Map(),
    ldapSyntaxToASN1Syntax: new Map(),
    operationalBindingControlEvents: new EventEmitter(),
    collectiveAttributes: new Set(),
    nameForms: new Map(),
    statistics: {
        operations: [],
    },
    usedInvokeIDs: new Set(),
};

export default ctx;
