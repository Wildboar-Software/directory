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
import { DEFAULT_IDM_BUFFER_SIZE, DEFAULT_LDAP_BUFFER_SIZE } from "./constants";
import {
    AuthenticationLevel_basicLevels_level_simple,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta";
import type { SecureVersion } from "tls";
import * as fs from "fs";

const myNSAPs: Uint8Array[] = process.env.MEERKAT_MY_ACCESS_POINT_NSAPS
    ? process.env.MEERKAT_MY_ACCESS_POINT_NSAPS
        .split(/\s+/g)
        .map((url) => uriToNSAP(url, (url.startsWith("itot://"))))
    : [];

const rootID = uuid();
const root: Vertex = {
    subordinates: [],
    materializedPath: "",
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
        maxConnections: process.env.MEERKAT_MAX_CONNECTIONS
            ? Number.parseInt(process.env.MEERKAT_MAX_CONNECTIONS)
            : 250,
        maxConnectionsPerAddress: process.env.MEERKAT_MAX_CONNECTIONS_PER_ADDRESS
            ? Number.parseInt(process.env.MEERKAT_MAX_CONNECTIONS_PER_ADDRESS)
            : Infinity,
        maxConcurrentOperationsPerConnection: process.env.MEERKAT_MAX_CONCURRENT_OPERATIONS_PER_CONNECTION
            ? Number.parseInt(process.env.MEERKAT_MAX_CONCURRENT_OPERATIONS_PER_CONNECTION)
            : Infinity,
        tcp: {
            noDelay: (process.env.MEERKAT_TCP_NO_DELAY === "1"),
            timeoutInSeconds: process.env.MEERKAT_TCP_TIMEOUT_IN_SECONDS
                ? Number.parseInt(process.env.MEERKAT_TCP_TIMEOUT_IN_SECONDS)
                : 0, // 0 means do not timeout.
            minimumTransferSpeedInBytesPerMinute: process.env.MEERKAT_MIN_TRANSFER_SPEED_BYTES_PER_MINUTE
                ? Number.parseInt(process.env.MEERKAT_MIN_TRANSFER_SPEED_BYTES_PER_MINUTE)
                : 1000, // A sensible default, since AX.25 radio typically transmits 150 bytes/second.
        },
        tls: {
            handshakeTimeout: process.env.MEERKAT_TLS_HANDSHAKE_TIMEOUT_IN_SECONDS
                ? Number.parseInt(process.env.MEERKAT_TLS_HANDSHAKE_TIMEOUT_IN_SECONDS) * 1000
                : 30000,
            sessionTimeout: process.env.MEERKAT_TLS_SESSION_TIMEOUT_IN_SECONDS
                ? Number.parseInt(process.env.MEERKAT_TLS_SESSION_TIMEOUT_IN_SECONDS) * 1000
                : undefined,
            rejectUnauthorized: (process.env.MEERKAT_TLS_CLIENT_CERT_AUTH === "1"),
            requestCert: (process.env.MEERKAT_TLS_CLIENT_CERT_AUTH === "1"),
            cert: process.env.MEERKAT_TLS_CERT_FILE
                ? fs.readFileSync(process.env.MEERKAT_TLS_CERT_FILE, { encoding: "utf-8" })
                : undefined,
            key: process.env.MEERKAT_TLS_KEY_FILE
                ? fs.readFileSync(process.env.MEERKAT_TLS_KEY_FILE, { encoding: "utf-8" })
                : undefined,
            ca: process.env.MEERKAT_TLS_CA_FILE
                ? fs.readFileSync(process.env.MEERKAT_TLS_CA_FILE, { encoding: "utf-8" })
                : undefined,
            crl: process.env.MEERKAT_TLS_CRL_FILE
                ? fs.readFileSync(process.env.MEERKAT_TLS_CRL_FILE, { encoding: "utf-8" })
                : undefined,
            pfx: process.env.MEERKAT_TLS_PFX_FILE
                ? fs.readFileSync(process.env.MEERKAT_TLS_PFX_FILE)
                : undefined,
            sigalgs: process.env.MEERKAT_TLS_SIG_ALGS,
            ciphers: process.env.MEERKAT_TLS_CIPHERS,
            clientCertEngine: process.env.MEERKAT_CLIENT_CERT_ENGINE,
            dhparam: process.env.MEERKAT_TLS_DH_PARAM_FILE
                ? fs.readFileSync(process.env.MEERKAT_TLS_DH_PARAM_FILE)
                : undefined,
            ecdhCurve: process.env.MEERKAT_ECDH_CURVES,
            honorCipherOrder: (process.env.MEERKAT_HONOR_CIPHER_ORDER === "1"),
            minVersion: process.env.MEERKAT_TLS_MIN_VERSION as SecureVersion | undefined,
            maxVersion: process.env.MEERKAT_TLS_MAX_VERSION as SecureVersion | undefined,
            passphrase: process.env.MEERKAT_TLS_KEY_PASSPHRASE,
            privateKeyEngine: process.env.MEERKAT_PRIVATE_KEY_ENGINE,
            // ticketKeys?: Buffer | undefined;
            // pskCallback?(socket: TLSSocket, identity: string): DataView | NodeJS.TypedArray | null;
            // pskIdentityHint: process.env.MEERKAT_PSK_IDENTITY_HINT
        },
        idm: {
            port: process.env.MEERKAT_IDM_PORT
                ? Number.parseInt(process.env.MEERKAT_IDM_PORT, 10)
                : undefined,
            bufferSize: process.env.MEERKAT_IDM_BUFFER_SIZE
                ? Number.parseInt(process.env.MEERKAT_IDM_BUFFER_SIZE, 10)
                : DEFAULT_IDM_BUFFER_SIZE,
            maxPDUSize: process.env.MEERKAT_MAX_IDM_PDU_SIZE
                ? Number.parseInt(process.env.MEERKAT_MAX_IDM_PDU_SIZE, 10)
                : DEFAULT_IDM_BUFFER_SIZE,
            maxSegments: process.env.MEERKAT_MAX_IDM_SEGMENTS
                ? Number.parseInt(process.env.MEERKAT_MAX_IDM_SEGMENTS, 10)
                : 10,
        },
        idms: {
            port: process.env.MEERKAT_IDMS_PORT
                ? Number.parseInt(process.env.MEERKAT_IDMS_PORT, 10)
                : undefined,
        },
        ldap: {
            port: process.env.MEERKAT_LDAP_PORT
                ? Number.parseInt(process.env.MEERKAT_LDAP_PORT, 10)
                : undefined,
            bufferSize: process.env.MEERKAT_LDAP_BUFFER_SIZE
                ? Number.parseInt(process.env.MEERKAT_LDAP_BUFFER_SIZE, 10)
                : DEFAULT_LDAP_BUFFER_SIZE,
        },
        ldaps: {
            port: process.env.MEERKAT_LDAPS_PORT
                ? Number.parseInt(process.env.MEERKAT_LDAPS_PORT, 10)
                : undefined,
        },
        webAdmin: {
            port: process.env.MEERKAT_WEB_ADMIN_PORT
                ? Number.parseInt(process.env.MEERKAT_WEB_ADMIN_PORT, 10)
                : undefined,
        },
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
        chaining: {
            minAuthLevel: process.env.MEERKAT_MIN_AUTH_LEVEL_FOR_CHAINING
                ? Number.parseInt(process.env.MEERKAT_MIN_AUTH_LEVEL_FOR_CHAINING, 10)
                : AuthenticationLevel_basicLevels_level_simple,
            minAuthLocalQualifier: process.env.MEERKAT_MIN_AUTH_LOCAL_QUALIFIER_FOR_CHAINING
                ? Number.parseInt(process.env.MEERKAT_MIN_AUTH_LOCAL_QUALIFIER_FOR_CHAINING, 10)
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
        openTopLevel: (process.env.MEERKAT_OPEN_TOP_LEVEL === "1"),
        forbidAnonymousBind: (process.env.MEERKAT_FORBID_ANONYMOUS_BIND === "1"),
        maxPreBindRequests: process.env.MEERKAT_MAX_PRE_BIND_REQUESTS
            ? Number.parseInt(process.env.MEERKAT_MAX_PRE_BIND_REQUESTS, 10)
            : 0,
        dap: {
            enabled: (process.env.MEERKAT_ENABLE_DAP !== "0"),
        },
        dsp: {
            enabled: (process.env.MEERKAT_DANGEROUSLY_ENABLE_DSP === "1"),
        },
        dop: {
            enabled: (process.env.MEERKAT_DANGEROUSLY_ENABLE_DOP === "1"),
        },
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
    associations: new Map(),
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
            if (bulkInsertMode || isDebugging) {
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
    usedInvokeIDs: new Set(),
    duplicatedLDAPNames: new Set(),
};

export default ctx;
