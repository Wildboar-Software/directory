import type { IndexableOID } from "../types/index.js";
import type { ContextCombination } from "@wildboar/x500/ServiceAdministration";
import { getRequiredContextsFromContextCombination } from "./getRequiredContextsFromContextCombination.js";
import { languageContext, localeContext } from "@wildboar/x500/SelectedAttributeTypes";
import { ContextAssertion } from "@wildboar/x500/InformationFramework";
import { BER } from "@jsr/wildboar__asn1/functional";

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

    it("should correctly evaluate a more complex combination", () => {
        // Basically "use localeContext or languageContext, but not both."
        const combo: ContextCombination = {
            or: [
                {
                    and: [
                        {
                            context: languageContext["&id"],
                        },
                        {
                            not: {
                                context: localeContext["&id"],
                            },
                        },
                    ],
                },
                {
                    and: [
                        {
                            context: localeContext["&id"],
                        },
                        {
                            not: {
                                context: languageContext["&id"],
                            },
                        },
                    ],
                },
            ],
        };
        // There should be no required contexts, because not all
        // subfilters require the same context.
        const ret = new Set<IndexableOID>();
        getRequiredContextsFromContextCombination(combo, true, ret);
        expect(ret.size).toBe(0);
    });
});