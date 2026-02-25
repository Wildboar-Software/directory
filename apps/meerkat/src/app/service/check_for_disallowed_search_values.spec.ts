import type { IndexableOID } from "../types/index.js";
import type { Filter } from "@wildboar/x500/DirectoryAbstractService";
import type { FilterItem } from "@wildboar/x500/DirectoryAbstractService";
import { BER } from "@wildboar/asn1/functional";
import { commonName, languageContext } from "@wildboar/x500/SelectedAttributeTypes";
import { AttributeTypeAssertion, AttributeValueAssertion, Context, ContextAssertion } from "@wildboar/x500/InformationFramework";
import { check_for_disallowed_search_values } from "./check_for_disallowed_search_values.js";

describe("check_for_disallowed_search_values", () => {
    it("should not find any violations in the simplest compliant case", () => {
        const filter: Filter = {
            item: {
                equality: new AttributeValueAssertion(
                    commonName["&id"],
                    commonName.encoderFor["&Type"]!({ uTF8String: "John Doe" }, BER),
                ),
            },
        };
        const disallowed: Map<IndexableOID, boolean> = new Map();
        const violations: FilterItem[] = [];
        check_for_disallowed_search_values(filter, disallowed, violations);
        expect(violations.length).toBe(0);
    });

    it("should find violations in the simplest non-compliant case with contexts", () => {
        const filter1: Filter = {
            item: {
                contextPresent: new AttributeTypeAssertion(
                    commonName["&id"],
                    [
                        new ContextAssertion(
                            languageContext["&id"],
                            [languageContext.encoderFor["&Type"]!("en", BER)],
                        ),
                    ],
                ),
            },
        };

        const filter2: Filter = {
            item: {
                equality: new AttributeValueAssertion(
                    commonName["&id"],
                    commonName.encoderFor["&Type"]!({ uTF8String: "John Doe" }, BER),
                ),
            },
        };

        const disallowed: Map<IndexableOID, boolean> = new Map();
        disallowed.set(commonName["&id"].toString(), true); // Has contexts.
        const violations: FilterItem[] = [];

        check_for_disallowed_search_values(filter1, disallowed, violations);
        expect(violations.length).toBe(0);
        check_for_disallowed_search_values(filter2, disallowed, violations);
        expect(violations.length).toBe(1);
    });

    it("should find violations in the simplest non-compliant case without contexts", () => {
        const filter1: Filter = {
            item: {
                present: commonName["&id"],
            },
        };

        const filter2: Filter = {
            item: {
                equality: new AttributeValueAssertion(
                    commonName["&id"],
                    commonName.encoderFor["&Type"]!({ uTF8String: "John Doe" }, BER),
                ),
            },
        };

        const disallowed: Map<IndexableOID, boolean> = new Map();
        disallowed.set(commonName["&id"].toString(), false); // Has no contexts.
        const violations: FilterItem[] = [];

        check_for_disallowed_search_values(filter1, disallowed, violations);
        expect(violations.length).toBe(0);
        check_for_disallowed_search_values(filter2, disallowed, violations);
        expect(violations.length).toBe(1);
    });
});
