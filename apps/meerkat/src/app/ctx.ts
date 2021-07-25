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

const rootID = uuid();
const root: Vertex = {
    subordinates: [],
    dse: {
        id: 0,
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
            {
                rdnSequence: [],
            },
            new PresentationAddress(
                undefined,
                undefined,
                undefined,
                [], // FIXME:
            ),
            undefined,
        ),
        hibernatingSince: undefined,
    },
    dit: {
        id: 1,
        uuid: "b47a393d-f561-4020-b8e8-324ae3391e98",
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
