import type { IndexableOID } from "../types/index.js";
import type { AttributeCombination } from "@wildboar/x500/ServiceAdministration";
import { getRequiredAttributesFromAttributeCombination } from "./getRequiredAttributesFromAttributeCombination.js";
import { commonName, streetAddress } from "@wildboar/x500/SelectedAttributeTypes";

describe("getRequiredAttributesFromAttributeCombination", () => {
    it("should return the required attributes in the simplest case", () => {
        const combo: AttributeCombination = {
            attribute: commonName["&id"],
        };
        const ret = new Set<IndexableOID>();
        getRequiredAttributesFromAttributeCombination(combo, true, ret);
        expect(ret.size).toBe(1);
        expect(ret.has(commonName["&id"].toString())).toBe(true);
    });

    it("should return the required attributes in the simplest case nested in and", () => {
        const combo: AttributeCombination = {
            and: [
                {
                    attribute: commonName["&id"],
                },
            ],
        };
        const ret = new Set<IndexableOID>();
        getRequiredAttributesFromAttributeCombination(combo, true, ret);
        expect(ret.size).toBe(1);
        expect(ret.has(commonName["&id"].toString())).toBe(true);
    });

    it("should return the required attributes in the simplest case nested in or", () => {
        const combo: AttributeCombination = {
            or: [
                {
                    attribute: commonName["&id"],
                },
            ],
        };
        const ret = new Set<IndexableOID>();
        getRequiredAttributesFromAttributeCombination(combo, true, ret);
        expect(ret.size).toBe(1);
        expect(ret.has(commonName["&id"].toString())).toBe(true);
    });

    it("should not return any required attributes if the simplest case is nested in not", () => {
        const combo: AttributeCombination = {
            not: {
                attribute: commonName["&id"],
            },
        };
        const ret = new Set<IndexableOID>();
        getRequiredAttributesFromAttributeCombination(combo, true, ret);
        expect(ret.size).toBe(0);
        expect(ret.has(commonName["&id"].toString())).toBe(false);
    });

    it("should return the required attributes in a complex case", () => {
        const combo: AttributeCombination = {
            or: [
                {
                    attribute: commonName["&id"],
                },
                {
                    and: [
                        {
                            attribute: commonName["&id"],
                        },
                        {
                            attribute: streetAddress["&id"],
                        },
                    ],
                },
            ],
        };
        const ret = new Set<IndexableOID>();
        getRequiredAttributesFromAttributeCombination(combo, true, ret);
        expect(ret.size).toBe(1);
        expect(ret.has(commonName["&id"].toString())).toBe(true);
    });
});