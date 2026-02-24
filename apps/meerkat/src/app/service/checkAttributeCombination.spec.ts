import type { AttributeCombination } from "@wildboar/x500/ServiceAdministration";
import type { Filter } from "@wildboar/x500/DirectoryAbstractService";
import { checkAttributeCombination } from "./checkAttributeCombination.js";
import { commonName, streetAddress } from "@wildboar/x500/SelectedAttributeTypes";
import { AttributeValueAssertion } from "@wildboar/x500/InformationFramework";
import { BER } from "@wildboar/asn1/functional";

describe("checkAttributeCombination", () => {
    it("should not find any violations in the simplest compliant case", () => {
        const violations: AttributeCombination[] = [];
        const filter: Filter = {
            item: {
                equality: new AttributeValueAssertion(
                    commonName["&id"],
                    commonName.encoderFor["&Type"]!({ uTF8String: "John Doe" }, BER),
                ),
            },
        };
        const combo: AttributeCombination = {
            attribute: commonName["&id"],
        };
        checkAttributeCombination(filter, combo, true, violations);
        expect(violations).toHaveLength(0);
    });

    it("should not find any violations in the simplest compliant AND case", () => {
        const violations: AttributeCombination[] = [];
        const filter: Filter = {
            and: [
                {
                    item: {
                        equality: new AttributeValueAssertion(
                            commonName["&id"],
                            commonName.encoderFor["&Type"]!({ uTF8String: "John Doe" }, BER),
                        ),
                    },
                },
                {
                    item: {
                        equality: new AttributeValueAssertion(
                            streetAddress["&id"],
                            streetAddress.encoderFor["&Type"]!({ uTF8String: "123 Main St" }, BER),
                        ),
                    },
                },
            ]
        };
        const combo: AttributeCombination = {
            and: [
                { attribute: commonName["&id"] },
                { attribute: streetAddress["&id"] },
            ],
        };
        checkAttributeCombination(filter, combo, true, violations);
        expect(violations).toHaveLength(0);
    });

    it("should not find any violations in the simplest compliant OR case", () => {
        const violations: AttributeCombination[] = [];
        const filter: Filter = {
            or: [
                {
                    item: {
                        equality: new AttributeValueAssertion(
                            commonName["&id"],
                            commonName.encoderFor["&Type"]!({ uTF8String: "John Doe" }, BER),
                        ),
                    },
                },
                {
                    item: {
                        equality: new AttributeValueAssertion(
                            streetAddress["&id"],
                            streetAddress.encoderFor["&Type"]!({ uTF8String: "123 Main St" }, BER),
                        ),
                    },
                },
            ]
        };
        // This combo is saying that the filter MUST have either of these attributes present in every subfilter.
        // Since the filter is an OR, and each subfilter is on a different attribute, this will never match.
        // 
        // ITU-T Recommendation X.501 (2019), Section 16.10.3 says:
        // 
        // > This component may specify that certain attribute types shall
        // > unconditionally be effectively present in the filter.
        //
        // So I interpret this behavior as being correct.
        const combo: AttributeCombination = {
            or: [
                { attribute: commonName["&id"] },
                { attribute: streetAddress["&id"] },
            ],
        };
        checkAttributeCombination(filter, combo, true, violations);
        expect(violations).not.toHaveLength(0);
    });

    // TODO: Test empty AND and OR cases
});
