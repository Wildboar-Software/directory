import type { Context } from "../types/index.js";
import { validateObjectClasses } from "./validateObjectClasses.js";
import { objectClasses as seloc } from "@wildboar/x500";
import { objectClassFromInformationObject } from "../init/objectClassFromInformationObject.js";

const ctx: Context = {
    objectClasses: {
        get: (key: string) => {
            return ({
                [seloc.top["&id"].toString()]: objectClassFromInformationObject(seloc.top, "top"),
                [seloc.person["&id"].toString()]: objectClassFromInformationObject(seloc.person, "person"),
                [seloc.residentialPerson["&id"].toString()]: objectClassFromInformationObject(seloc.residentialPerson, "residentialPerson"),
            })[key];
        },
    },
} as Context;

describe("validateObjectClasses()", () => {
    it("works", () => {
        expect(validateObjectClasses(ctx, [
            seloc.person["&id"],
            seloc.residentialPerson["&id"],
        ])).toBe(true);
    });
});
