import type { IndexableOID } from "../types/index.js";
import { ContextAssertion } from "@wildboar/x500/InformationFramework";
import type { ContextCombination } from "@wildboar/x500/ServiceAdministration";
import { checkContextCombination } from "./checkContextCombination.js";
import { commonName, languageContext } from "@wildboar/x500/SelectedAttributeTypes";
// import { AttributeValueAssertion } from "@wildboar/x500/InformationFramework";
import { BER } from "@wildboar/asn1/functional";
// import type { Filter } from "@wildboar/x500/DirectoryAbstractService";

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
});