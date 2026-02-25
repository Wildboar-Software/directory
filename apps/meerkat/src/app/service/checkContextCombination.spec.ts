import type { IndexableOID } from "../types/index.js";
import { ContextAssertion } from "@wildboar/x500/InformationFramework";
import type { ContextCombination } from "@wildboar/x500/ServiceAdministration";
import { checkContextCombination } from "./checkContextCombination.js";
import { languageContext, localeContext } from "@wildboar/x500/SelectedAttributeTypes";
import { BER } from "@wildboar/asn1/functional";

describe("checkContextCombination", () => {
    it("should find violations in the simplest case", () => {
        const violations: ContextCombination[] = [];
        const contexts: Map<IndexableOID, ContextAssertion> = new Map();
        const combo: ContextCombination = {
            context: languageContext["&id"],
        };
        checkContextCombination(contexts, combo, violations);
        expect(violations).toHaveLength(1);

        violations.pop();
        contexts.set(languageContext["&id"].toString(), new ContextAssertion(
            languageContext["&id"],
            [languageContext.encoderFor["&Type"]!("en", BER)]
        ));
        checkContextCombination(contexts, combo, violations);
        expect(violations).toHaveLength(0);
    });

    it("should find violations in the a more complex case", () => {
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

        const violations: ContextCombination[] = [];

        // This should be a violation because there are no contexts, so no match.
        const contexts: Map<IndexableOID, ContextAssertion> = new Map();
        checkContextCombination(contexts, combo, violations);
        expect(violations).toHaveLength(1);
        violations.pop();

        // This should NOT be a violation, because one of the required contexts is present.
        contexts.set(languageContext["&id"].toString(), new ContextAssertion(
            languageContext["&id"],
            [languageContext.encoderFor["&Type"]!("en", BER)]
        ));
        checkContextCombination(contexts, combo, violations);
        expect(violations).toHaveLength(0);

        // This should be a violation, because now both contexts are present.
        contexts.set(localeContext["&id"].toString(), new ContextAssertion(
            localeContext["&id"],
            [localeContext.encoderFor["&Type"]!({ localeID2: { printableString: "en-US" } }, BER)]
        ));
        checkContextCombination(contexts, combo, violations);
        expect(violations).toHaveLength(1);
        violations.pop();

        contexts.delete(languageContext["&id"].toString());
        checkContextCombination(contexts, combo, violations);
        expect(violations).toHaveLength(0);
    });
});