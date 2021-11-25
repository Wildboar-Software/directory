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
import { createPrivateKey } from "crypto";
import * as fs from "fs";
import decodePkiPathFromPEM from "./utils/decodePkiPathFromPEM";
import winston from "winston";
import isDebugging from "is-debugging";
import i18n from "i18next";
import {
    uriToNSAP,
} from "@wildboar/x500/src/lib/distributed/uri";

if (!process.env.MEERKAT_SIGNING_CERT_CHAIN || !process.env.MEERKAT_SIGNING_KEY) {
    console.error("SIGNING_CERT_CHAIN and SIGNING_KEY environment variables must be configured.");
    process.exit(1);
}

const chainFile = fs.readFileSync(process.env.MEERKAT_SIGNING_CERT_CHAIN, { encoding: "utf-8" });
const keyFile = fs.readFileSync(process.env.MEERKAT_SIGNING_KEY, { encoding: "utf-8" });
const pkiPath = decodePkiPathFromPEM(chainFile);
const dsaCert = pkiPath[pkiPath.length - 1];
if (!dsaCert) {
    console.error("Certificate chain file indicated by environment variable SIGNING_CERT_CHAIN had no PEM-encoded certificates.");
    process.exit(1);
}

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
        createdTimestamp: new Date(),
        modifyTimestamp: new Date(),
    },
};
const bulkInsertMode: boolean = (process.env.MEERKAT_BULK_INSERT_MODE === "1");
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
            dsaCert.toBeSigned.subject,
            new PresentationAddress(
                undefined,
                undefined,
                undefined,
                myNSAPs,
            ),
            undefined,
        ),
        hibernatingSince: undefined,
        signing: {
            key: createPrivateKey({
                key: keyFile,
                format: "pem",
            }),
            certPath: pkiPath,
        },
    },
    dit: {
        root,
    },
    log: winston.createLogger({
        level: isDebugging
            ? "debug"
            : "info",
        format: winston.format.cli(),
        transports: [
            new winston.transports.Console(),
        ],
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
