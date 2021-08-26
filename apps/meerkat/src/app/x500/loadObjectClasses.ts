import { Context } from "../types";
import objectClassFromInformationObject from "./objectClassFromInformationObject";
import * as x500oc from "@wildboar/x500/src/lib/collections/objectClasses";
import { subentry } from "@wildboar/x500/src/lib/modules/InformationFramework/subentry.oa";
import { accessControlSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/accessControlSubentry.oa";
import { collectiveAttributeSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/collectiveAttributeSubentry.oa";
import { contextAssertionSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/contextAssertionSubentry.oa";
import { serviceAdminSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/serviceAdminSubentry.oa";
import { pwdAdminSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAdminSubentry.oa";

const additionalObjectClasses = [
    subentry,
    accessControlSubentry,
    collectiveAttributeSubentry,
    contextAssertionSubentry,
    serviceAdminSubentry,
    pwdAdminSubentry,
];

export
function loadObjectClasses (ctx: Context): void {
    additionalObjectClasses
        .map(objectClassFromInformationObject)
        .forEach((oc) => {
            ctx.objectClasses.set(oc.id.toString(), oc);
        });
    Object.values(x500oc)
        .map(objectClassFromInformationObject)
        .forEach((oc) => {
            ctx.objectClasses.set(oc.id.toString(), oc);
        });

    // ctx.structuralObjectClassHierarchy.children.push({
    //     ...personOC,
    //     parent: ctx.structuralObjectClassHierarchy,
    //     children: [],
    // });
}

export default loadObjectClasses;
