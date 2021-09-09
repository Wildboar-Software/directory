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
import objectClassFromInformationObject from "./x500/objectClassFromInformationObject";
import { EventEmitter } from "stream";
import { createPrivateKey } from "crypto";
import * as fs from "fs";
import decodePkiPathFromPEM from "./utils/decodePkiPathFromPEM";

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
    structuralObjectClassHierarchy: {
        ...objectClassFromInformationObject(top),
        parent: undefined,
        children: [],
    },
    objectClasses: new Map([]),
    attributes: new Map([]),
    equalityMatchingRules: new Map([]),
    orderingMatchingRules: new Map([]),
    substringsMatchingRules: new Map([]),
    approxMatchingRules: new Map([]),
    contextMatchers: new Map([]),
    pagedResultsRequests: new Map([]),
    ldapSyntaxes: new Map([]),
    operationalBindingControlEvents: new EventEmitter(),
};

export default ctx;
