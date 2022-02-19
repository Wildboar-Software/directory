import { Context } from "@wildboar/meerkat-types";
import objectClassFromInformationObject from "./objectClassFromInformationObject";
import * as x500oc from "@wildboar/x500/src/lib/collections/objectClasses";
import { ObjectClassKind as PrismaObjectClassKind } from "@prisma/client";
import {
    ObjectClassKind,
    ObjectClassKind_abstract,
    ObjectClassKind_auxiliary,
    ObjectClassKind_structural,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { ObjectIdentifier } from "asn1-ts";
import { AssertionError } from "assert";

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

/**
 * @summary Initialize Meerkat DSA's internal index of known object classes.
 * @description
 *
 * Initialize Meerkat DSA's internal index of known object classes.
 *
 * @param ctx The context object
 *
 * @function
 * @async
 */
export
async function loadObjectClasses (ctx: Context): Promise<void> {
    const objectClassInfoObjects = [
        ...Object.values(x500oc),
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
