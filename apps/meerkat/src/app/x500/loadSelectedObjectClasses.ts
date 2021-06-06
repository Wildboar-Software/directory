import { Context } from "../types";
import objectClassFromInformationObject from "./objectClassFromInformationObject";
import {
    person,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/person.oa";

export
function loadSelectedObjectClasses (ctx: Context): void {
    const personOC = objectClassFromInformationObject(person);
    if (personOC.id) {
        ctx.objectClasses.set(personOC.id.toString(), personOC);
    }
    ctx.structuralObjectClassHierarchy.children.push({
        ...personOC,
        parent: ctx.structuralObjectClassHierarchy,
        children: [],
    });
}
