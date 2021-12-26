import type { Context } from "../types";
import contextTypeFromInformationObject from "./contextTypeFromInformationObject";
import * as x500c from "@wildboar/x500/src/lib/collections/contexts";
import type {
    CONTEXT,
} from "@wildboar/x500/src/lib/modules/InformationFramework/CONTEXT.oca";

export
function loadContextTypes (ctx: Context): void {
    const contextTypes: [ string, CONTEXT ][] = [
        [ "languageContext", x500c.languageContext ],
        [ "ldapAttributeOptionContext", x500c.ldapAttributeOptionContext ],
        [ "localeContext", x500c.localeContext ],
        [ "temporalContext", x500c.temporalContext ],
        [ "attributeValueIntegrityInfoContext", x500c.attributeValueIntegrityInfoContext ],
        [ "attributeValueSecurityLabelContext", x500c.attributeValueSecurityLabelContext ],
    ];
    contextTypes
        .forEach(([ name, ct ]) => {
            ctx.contextTypes.set(ct["&id"].toString(), contextTypeFromInformationObject(ct, name));
        });
}

export default loadContextTypes;
