import { Context } from "@wildboar/meerkat-types";
import objectClassFromInformationObject from "./objectClassFromInformationObject";
import * as x500oc from "@wildboar/x500/src/lib/collections/objectClasses";
import { subentry } from "@wildboar/x500/src/lib/modules/InformationFramework/subentry.oa";
import { accessControlSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/accessControlSubentry.oa";
import { collectiveAttributeSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/collectiveAttributeSubentry.oa";
import { contextAssertionSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/contextAssertionSubentry.oa";
import { serviceAdminSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/serviceAdminSubentry.oa";
import { pwdAdminSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAdminSubentry.oa";
import { ObjectClassKind as PrismaObjectClassKind } from "@prisma/client";
import {
    ObjectClassKind,
    ObjectClassKind_abstract,
    ObjectClassKind_auxiliary,
    ObjectClassKind_structural,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { ObjectIdentifier } from "asn1-ts";
import type {
    OBJECT_CLASS,
} from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { AssertionError } from "assert";

const additionalObjectClasses: Record<string, OBJECT_CLASS> = {
    "subentry": subentry,
    "accessControlSubentry": accessControlSubentry,
    "collectiveAttributeSubentry": collectiveAttributeSubentry,
    "contextAssertionSubentry": contextAssertionSubentry,
    "serviceAdminSubentry": serviceAdminSubentry,
    "pwdAdminSubentry": pwdAdminSubentry,
};

function prismaOCK2OCK (ock: PrismaObjectClassKind): ObjectClassKind {
    switch (ock) {
    case (PrismaObjectClassKind.ABSTRACT): {
        return ObjectClassKind_abstract;
    }
    case (PrismaObjectClassKind.AUXILIARY): {
        return ObjectClassKind_auxiliary;
    }
    case (PrismaObjectClassKind.STRUCTURAL): {
        return ObjectClassKind_structural;
    }
    default: throw new AssertionError();
    }
}

export
async function loadObjectClasses (ctx: Context): Promise<void> {
    const objectClassInfoObjects = [
        ...Object.values(x500oc),
        ...Object.values(additionalObjectClasses),
    ];
    objectClassInfoObjects
        .map(objectClassFromInformationObject)
        .forEach((oc) => {
            ctx.objectClasses.set(oc.id.toString(), oc);
        });
    const ocs = await ctx.db.objectClassDescription.findMany();
    for (const oc of ocs) {
        ctx.objectClasses.set(oc.identifier, {
            id: ObjectIdentifier.fromString(oc.identifier),
            superclasses: new Set(oc.subclassOf?.split(" ")),
            kind: prismaOCK2OCK(oc.kind),
            mandatoryAttributes: new Set(oc.mandatories?.split(" ")),
            optionalAttributes: new Set(oc.optionals?.split(" ")),
            obsolete: oc.obsolete,
            ldapNames: oc.ldapNames?.split(" ") ?? undefined,
            ldapDescription: oc.ldapDescription ?? undefined,
        });
    }
}

export default loadObjectClasses;
