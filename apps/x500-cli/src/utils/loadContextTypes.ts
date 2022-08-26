import type { Context } from "../types";
import contextTypeFromInformationObject from "./contextTypeFromInformationObject";
import * as x500c from "@wildboar/x500/src/lib/collections/contexts";
import type {
    CONTEXT,
} from "@wildboar/x500/src/lib/modules/InformationFramework/CONTEXT.oca";
import {
    dl_administrator_annotation,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/dl-administrator-annotation.oa";
import {
    dl_nested_dl,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/dl-nested-dl.oa";
import {
    dl_reset_originator,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/dl-reset-originator.oa";

import {
    basicServiceContext,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/basicServiceContext.oa";
import {
    lineIdentityContext,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/lineIdentityContext.oa";
import {
    assignmentContext,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/assignmentContext.oa";

export
function loadContextTypes (ctx: Context): void {
    const contextTypes: [ string, CONTEXT ][] = [
        [ "languageContext", x500c.languageContext ],
        [ "ldapAttributeOptionContext", x500c.ldapAttributeOptionContext ],
        [ "localeContext", x500c.localeContext ],
        [ "temporalContext", x500c.temporalContext ],
        [ "attributeValueIntegrityInfoContext", x500c.attributeValueIntegrityInfoContext ],
        [ "attributeValueSecurityLabelContext", x500c.attributeValueSecurityLabelContext ],
        [ "dl-administrator-annotation", dl_administrator_annotation ],
        [ "dl-nested-dl", dl_nested_dl ],
        [ "dl-reset-originator", dl_reset_originator ],
        [ "basicServiceContext", basicServiceContext ],
        [ "lineIdentityContext", lineIdentityContext ],
        [ "assignmentContext", assignmentContext ],
    ];
    contextTypes
        .forEach(([ name, ct ]) => {
            ctx.contextTypes.set(ct["&id"].toString(), contextTypeFromInformationObject(ct, name));
        });
}

export default loadContextTypes;
