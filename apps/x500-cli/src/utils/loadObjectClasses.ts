import { Context } from "../types";
import * as x500oc from "@wildboar/x500/src/lib/collections/objectClasses";
import { subentry } from "@wildboar/x500/src/lib/modules/InformationFramework/subentry.oa";
import { accessControlSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/accessControlSubentry.oa";
import { collectiveAttributeSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/collectiveAttributeSubentry.oa";
import { contextAssertionSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/contextAssertionSubentry.oa";
import { serviceAdminSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/serviceAdminSubentry.oa";
import { pwdAdminSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAdminSubentry.oa";
import type {
    OBJECT_CLASS,
} from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";

const additionalObjectClasses: Record<string, OBJECT_CLASS> = {
    "subentry": subentry,
    "accessControlSubentry": accessControlSubentry,
    "collectiveAttributeSubentry": collectiveAttributeSubentry,
    "contextAssertionSubentry": contextAssertionSubentry,
    "serviceAdminSubentry": serviceAdminSubentry,
    "pwdAdminSubentry": pwdAdminSubentry,
};

export
async function loadObjectClasses (ctx: Context): Promise<void> {
    const objectClassInfoObjects = {
        ...x500oc,
        ...additionalObjectClasses,
    };
    Object.entries(objectClassInfoObjects)
        .forEach(([ name, oc ]) => {
            ctx.objectClasses.set(oc["&id"].toString(), {
                id: oc["&id"],
                name,
            });
        });
}

export default loadObjectClasses;
