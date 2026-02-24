import type { IndexableOID } from "../types/index.js";
import type { Filter } from "@wildboar/x500/DirectoryAbstractService";
import { getAttributeTypeNegationFromFilter } from "./getAttributeTypeNegationFromFilter.js";
import { commonName } from "@wildboar/x500/SelectedAttributeTypes";
import { AttributeValueAssertion } from "@wildboar/x500/InformationFramework";
import { BER } from "@wildboar/asn1/functional";

describe("getAttributeTypeNegationFromFilter()", () => {
    it("should return the correct result for the simplest filter", () => {
        const filter: Filter = {
            item: {
                equality: new AttributeValueAssertion(
                    commonName["&id"],
                    commonName.encoderFor["&Type"]!({ uTF8String: "John Doe" }, BER),
                ),
            },
        };
        const ret: Map<IndexableOID, [boolean, boolean]> = new Map();
        getAttributeTypeNegationFromFilter(filter, true, ret);
        expect(ret).toEqual(new Map([
            ["2.5.4.3", [true, false]],
        ]));
    });

    it("should return the correct result for the simplest negated filter", () => {
        const filter: Filter = {
            not: {
                item: {
                    equality: new AttributeValueAssertion(
                        commonName["&id"],
                        commonName.encoderFor["&Type"]!({ uTF8String: "John Doe" }, BER),
                    ),
                },
            },
        };
        const ret: Map<IndexableOID, [boolean, boolean]> = new Map();
        getAttributeTypeNegationFromFilter(filter, true, ret);
        expect(ret).toEqual(new Map([
            ["2.5.4.3", [false, true]],
        ]));
    });

    it("should return the correct result for the a more complex filter", () => {
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
                    or: [
                        {
                            not: {
                                item: {
                                    equality: new AttributeValueAssertion(
                                        commonName["&id"],
                                        commonName.encoderFor["&Type"]!({ uTF8String: "John Doe" }, BER),
                                    ),
                                },
                            }
                        }
                    ]
                }
            ],
        };
        const ret: Map<IndexableOID, [boolean, boolean]> = new Map();
        getAttributeTypeNegationFromFilter(filter, true, ret);
        expect(ret).toEqual(new Map([
            ["2.5.4.3", [true, true]],
        ]));
    });

    it("should return the correct result for the empty and:{} filter", () => {
        const filter: Filter = { and: [] };
        const ret: Map<IndexableOID, [boolean, boolean]> = new Map();
        getAttributeTypeNegationFromFilter(filter, true, ret);
        expect(ret.size).toEqual(0);
    });

    it("should return the correct result for the empty or:{} filter", () => {
        const filter: Filter = { or: [] };
        const ret: Map<IndexableOID, [boolean, boolean]> = new Map();
        getAttributeTypeNegationFromFilter(filter, true, ret);
        expect(ret.size).toEqual(0);
    });
});
