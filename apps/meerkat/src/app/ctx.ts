import { Context, Vertex } from "./types";
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
import axios from "axios";

const telemetryURL: string = "https://telemetry.wildboar.software:443/events/6495A31B-D062-4ECC-B0A6-D7C2BC3F793C";

if (!process.env.SIGNING_CERT_CHAIN || !process.env.SIGNING_KEY) {
    console.error("SIGNING_CERT_CHAIN and SIGNING_KEY environment variables must be configured.");
    process.exit(1);
}

const chainFile = fs.readFileSync(process.env.SIGNING_CERT_CHAIN, { encoding: "utf-8" });
const keyFile = fs.readFileSync(process.env.SIGNING_KEY, { encoding: "utf-8" });
const pkiPath = decodePkiPathFromPEM(chainFile);
const dsaCert = pkiPath[pkiPath.length - 1];
if (!dsaCert) {
    console.error("Certificate chain file indicated by environment variable SIGNING_CERT_CHAIN had no PEM-encoded certificates.");
    process.exit(1);
}

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
const ctx: Context = {
    config: {
        localQualifierPointsFor: {
            usingStartTLS: process.env.LOCAL_QUALIFIER_POINTS_FOR_USING_STARTTLS
                ? Number.parseInt(process.env.LOCAL_QUALIFIER_POINTS_FOR_USING_STARTTLS, 10)
                : 0,
            usingTLS: process.env.LOCAL_QUALIFIER_POINTS_FOR_USING_TLS
                ? Number.parseInt(process.env.LOCAL_QUALIFIER_POINTS_FOR_USING_TLS, 10)
                : 0,
            usingSSLv3: process.env.LOCAL_QUALIFIER_POINTS_FOR_USING_SSL3
                ? Number.parseInt(process.env.LOCAL_QUALIFIER_POINTS_FOR_USING_SSL3, 10)
                : 0,
            usingTLSv1_0: process.env.LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_0
                ? Number.parseInt(process.env.LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_0, 10)
                : 0,
            usingTLSv1_1: process.env.LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_1
                ? Number.parseInt(process.env.LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_1, 10)
                : 0,
            usingTLSv1_2: process.env.LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_2
                ? Number.parseInt(process.env.LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_2, 10)
                : 0,
            usingTLSv1_3: process.env.LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_3
                ? Number.parseInt(process.env.LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_3, 10)
                : 0,
        },
        sentinelDomain: process.env.SENTINEL_DOMAIN,
        administratorEmail: process.env.ADMINISTRATOR_EMAIL,
    },
    dsa: {
        accessPoint: new AccessPoint(
            dsaCert.toBeSigned.subject,
            new PresentationAddress(
                undefined,
                undefined,
                undefined,
                [], // FIXME:
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
    log: console,
    db: new PrismaClient(),
    telemetry: {
        sendEvent: (body: Record<string, any>) => {
            console.log(body);
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
    attributes: new Map(),
    equalityMatchingRules: new Map(),
    orderingMatchingRules: new Map(),
    substringsMatchingRules: new Map(),
    approxMatchingRules: new Map(),
    contextMatchers: new Map(),
    pagedResultsRequests: new Map(),
    ldapSyntaxes: new Map(),
    operationalBindingControlEvents: new EventEmitter(),
    collectiveAttributes: new Set(),
    nameForms: new Map(),
    friendships: new Map(),
    statistics: {
        operations: [],
    },
};

export default ctx;
