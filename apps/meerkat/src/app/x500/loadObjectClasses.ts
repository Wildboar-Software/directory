import { Context } from "../types";
import objectClassFromInformationObject from "./objectClassFromInformationObject";
import * as x500oc from "@wildboar/x500/src/lib/collections/objectClasses";

export
function loadObjectClasses (ctx: Context): void {
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
