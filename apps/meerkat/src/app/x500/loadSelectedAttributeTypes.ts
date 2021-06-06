import { Context } from "../types";
import attributeFromInformationObject from "./attributeFromInformationObject";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import {
    commonName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import {
    surname,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/surname.oa";
import {
    caseIgnoreMatch,
} from "@wildboar/x500/src/lib/matching/equality/caseIgnoreMatch";

export
function loadSelectedAttributeTypes (ctx: Context): void {
    [
        objectClass,
        commonName,
        surname,
    ]
        .map(attributeFromInformationObject)
        .forEach((attr) => {
            ctx.attributes.set(attr.id, attr);
        });

    ctx.attributes.get(commonName["&id"]!.toString())!.namingMatcher = caseIgnoreMatch;
    ctx.attributes.get(surname["&id"]!.toString())!.namingMatcher = caseIgnoreMatch;
}
