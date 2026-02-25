import type { IndexableOID } from "../types/index.js";
import type { ContextCombination } from "@wildboar/x500/ServiceAdministration";
import { getRequiredContextsFromContextCombination } from "./getRequiredContextsFromContextCombination.js";
import { languageContext } from "@wildboar/x500/SelectedAttributeTypes";

describe("getRequiredContextsFromContextCombination", () => {
    it("should return the required contexts in the simplest case", () => {
        const combo: ContextCombination = {
            context: languageContext["&id"],
        };
        const ret = new Set<IndexableOID>();
        getRequiredContextsFromContextCombination(combo, true, ret);
        expect(ret.size).toBe(1);
        expect(ret.has(languageContext["&id"].toString())).toBe(true);
    });
});