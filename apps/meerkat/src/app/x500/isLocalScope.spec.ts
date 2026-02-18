import { isSameCountry, isLocalScope } from "./isLocalScope.js";
import type { Name, RelativeDistinguishedName } from "@wildboar/pki-stub";
import { AttributeTypeAndValue } from "@wildboar/pki-stub";
import {
    countryCode3c,
    countryCode3n,
    countryName,
    stateOrProvinceName,
    serialNumber,
    id_mr_caseIgnoreMatch,
    organizationName,
    dmdName,
} from "@wildboar/x500/SelectedAttributeTypes";
import { BER } from "@wildboar/asn1/functional";
import { strict as assert } from "node:assert";
import { caseIgnoreMatch } from "@wildboar/x500/matching/equality";
import type { Context } from "../types/types.js";

const meaninglessLastRDN1: RelativeDistinguishedName = [
    new AttributeTypeAndValue(
        serialNumber["&id"],
        serialNumber.encoderFor["&Type"]!("123", BER),
    ),
];

const meaninglessLastRDN2: RelativeDistinguishedName = [
    new AttributeTypeAndValue(
        serialNumber["&id"],
        serialNumber.encoderFor["&Type"]!("456", BER),
    ),
];

const meaninglessLastRDN3: RelativeDistinguishedName = [
    new AttributeTypeAndValue(
        serialNumber["&id"],
        serialNumber.encoderFor["&Type"]!("789", BER),
    ),
];

describe("isSameCountry()", () => {

    it("considers two same-country DNs to be local", () => {
        const dn1: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
                meaninglessLastRDN1,
            ],
        };
        const dn2: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
                meaninglessLastRDN2,
            ],
        };
        assert(isSameCountry(dn1, dn2));
    });

    it("considers two different-country DNs to be non-local", () => {
        const dn1: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
                meaninglessLastRDN1,
            ],
        };
        const dn2: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("SE", BER),
                    ),
                ],
                meaninglessLastRDN2,
            ],
        };
        assert(!isSameCountry(dn1, dn2));
    });

    it("considers two same-country DNs to be local, even if using different attributes", () => {
        const dn1: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
                meaninglessLastRDN1,
            ],
        };
        const dn2: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryCode3c["&id"],
                        countryCode3c.encoderFor["&Type"]!("USA", BER),
                    ),
                ],
                meaninglessLastRDN2,
            ],
        };
        const dn3: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryCode3n["&id"],
                        countryCode3n.encoderFor["&Type"]!("840", BER),
                    ),
                ],
                meaninglessLastRDN3,
            ],
        };
        assert(isSameCountry(dn1, dn2));
        assert(isSameCountry(dn2, dn3));
        assert(isSameCountry(dn1, dn3));
    });

    it("considers two different-country DNs to be non-local, even if using different attributes", () => {
        const dn1: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("TV", BER),
                    ),
                ],
                meaninglessLastRDN1,
            ],
        };
        const dn2: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryCode3c["&id"],
                        countryCode3c.encoderFor["&Type"]!("USA", BER),
                    ),
                ],
                meaninglessLastRDN2,
            ],
        };
        const dn3: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryCode3n["&id"],
                        countryCode3n.encoderFor["&Type"]!("841", BER),
                    ),
                ],
                meaninglessLastRDN3,
            ],
        };
        assert(!isSameCountry(dn1, dn2));
        assert(!isSameCountry(dn2, dn3));
        assert(!isSameCountry(dn1, dn3));
    });

    it("considers two DNs non-local if one does not contain a country", () => {
        const dn1: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
                meaninglessLastRDN1,
            ],
        };
        const dn2: Name = {
            rdnSequence: [
                meaninglessLastRDN2,
            ],
        };
        assert(!isSameCountry(dn1, dn2));
    });

    it("considers two DNs non-local if both are invalid countries", () => {
        const dn1: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("XX", BER),
                    ),
                ],
                meaninglessLastRDN1,
            ],
        };
        const dn2: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("XX", BER),
                    ),
                ],
                meaninglessLastRDN2,
            ],
        };
        assert(!isSameCountry(dn1, dn2));
    });

    it("considers two DNs non-local if both are the same, but have no country attributes", () => {
        const dn1: Name = {
            rdnSequence: [
                meaninglessLastRDN1,
            ],
        };
        const dn2: Name = dn1;
        assert(!isSameCountry(dn1, dn2));
    });

    it("considers two DNs non-local if both are the same, but have country attributes beyond the first RDN", () => {
        const dn1: Name = {
            rdnSequence: [
                meaninglessLastRDN1,
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
            ],
        };
        const dn2: Name = {
            rdnSequence: [
                meaninglessLastRDN2,
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
            ],
        };
        assert(!isSameCountry(dn1, dn2));
    });

    it("considers two same-country DNs to be local, even if the first RDN is multi-valued", () => {
        const dn1: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                    meaninglessLastRDN1[0],
                ],
            ],
        };
        const dn2: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryCode3c["&id"],
                        countryCode3c.encoderFor["&Type"]!("USA", BER),
                    ),
                    meaninglessLastRDN2[0],
                ],
            ],
        };
        assert(isSameCountry(dn1, dn2));
    });

    it("considers two different-country DNs to be non-local, even if the first RDN is multi-valued", () => {
        const dn1: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("FR", BER),
                    ),
                    meaninglessLastRDN1[0],
                ],
            ],
        };
        const dn2: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryCode3c["&id"],
                        countryCode3c.encoderFor["&Type"]!("USA", BER),
                    ),
                    meaninglessLastRDN2[0],
                ],
            ],
        };
        assert(!isSameCountry(dn1, dn2));
    });

});

// This should be enough for DN comparison.
const mockCtx = {
    attributeTypes: new Map([
        ["2.5.4.6", { equalityMatchingRule: id_mr_caseIgnoreMatch }], // countryName
        ["2.5.4.98", { equalityMatchingRule: id_mr_caseIgnoreMatch }], // c3
        ["2.5.4.99", { equalityMatchingRule: id_mr_caseIgnoreMatch }], // n3
        ["2.5.4.5", { equalityMatchingRule: id_mr_caseIgnoreMatch }], // serialNumber
        ["2.5.4.54", { equalityMatchingRule: id_mr_caseIgnoreMatch }], // dmdName
        ["2.5.4.10", { equalityMatchingRule: id_mr_caseIgnoreMatch }], // o
    ]),
    equalityMatchingRules: new Map([
        [ id_mr_caseIgnoreMatch.toString(), {
            id: id_mr_caseIgnoreMatch,
            matcher: caseIgnoreMatch
        } ],
    ]),
    matchingRulesSuitableForNaming: {
        has: () => true,
    } as unknown as Set<string>,
} as const as Context;


describe("isLocalScope()", () => {

    it("considers two same-organization DNs to be local", () => {
        const sameRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                organizationName["&id"],
                organizationName.encoderFor["&Type"]!({ printableString: "Evil Corp." }, BER),
            ),
        ];
        const dn1: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
                sameRDN,
                meaninglessLastRDN1,
            ],
        };
        const dn2: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
                sameRDN,
                meaninglessLastRDN2,
            ],
        };
        assert(isLocalScope(mockCtx, dn1, dn2));
    });

    it("considers two same-DMD DNs to be local", () => {
        const sameRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                dmdName["&id"],
                dmdName.encoderFor["&Type"]!({ printableString: "Evil Corp." }, BER),
            ),
        ];
        const dn1: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
                sameRDN,
                meaninglessLastRDN1,
            ],
        };
        const dn2: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
                sameRDN,
                meaninglessLastRDN2,
            ],
        };
        assert(isLocalScope(mockCtx, dn1, dn2));
    });

    it("considers two differing-organization DNs to be non-local", () => {
        const dn1: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
                [
                    new AttributeTypeAndValue(
                        organizationName["&id"],
                        organizationName.encoderFor["&Type"]!({ printableString: "Evil Corp." }, BER),
                    ),
                ],
                meaninglessLastRDN1,
            ],
        };
        const dn2: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
                [
                    new AttributeTypeAndValue(
                        organizationName["&id"],
                        organizationName.encoderFor["&Type"]!({ printableString: "Good Corp." }, BER),
                    ),
                ],
                meaninglessLastRDN2,
            ],
        };
        assert(!isLocalScope(mockCtx, dn1, dn2));
    });

    it("considers two differing-DMD DNs to be non-local", () => {
        const dn1: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
                [
                    new AttributeTypeAndValue(
                        dmdName["&id"],
                        dmdName.encoderFor["&Type"]!({ printableString: "Evil Corp." }, BER),
                    ),
                ],
                meaninglessLastRDN1,
            ],
        };
        const dn2: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
                [
                    new AttributeTypeAndValue(
                        dmdName["&id"],
                        dmdName.encoderFor["&Type"]!({ printableString: "Good Corp." }, BER),
                    ),
                ],
                meaninglessLastRDN2,
            ],
        };
        assert(!isLocalScope(mockCtx, dn1, dn2));
    });

    it("considers two differing-DMD DNs to be non-local", () => {
        const dn1: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
                [
                    new AttributeTypeAndValue(
                        dmdName["&id"],
                        dmdName.encoderFor["&Type"]!({ printableString: "Evil Corp." }, BER),
                    ),
                ],
                meaninglessLastRDN1,
            ],
        };
        const dn2: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
                [
                    new AttributeTypeAndValue(
                        dmdName["&id"],
                        dmdName.encoderFor["&Type"]!({ printableString: "Good Corp." }, BER),
                    ),
                ],
                meaninglessLastRDN2,
            ],
        };
        assert(!isLocalScope(mockCtx, dn1, dn2));
    });

    it("considers two same DMD DNs but different prefixes to be non-local", () => {
        const dn1: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
                [
                    new AttributeTypeAndValue(
                        stateOrProvinceName["&id"],
                        stateOrProvinceName.encoderFor["&Type"]!({ printableString: "FL" }, BER),
                    ),
                ],
                [
                    new AttributeTypeAndValue(
                        dmdName["&id"],
                        dmdName.encoderFor["&Type"]!({ printableString: "Evil Corp." }, BER),
                    ),
                ],
                meaninglessLastRDN1,
            ],
        };
        const dn2: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        countryName.encoderFor["&Type"]!("US", BER),
                    ),
                ],
                [
                    new AttributeTypeAndValue(
                        dmdName["&id"],
                        dmdName.encoderFor["&Type"]!({ printableString: "Evil Corp." }, BER),
                    ),
                ],
                meaninglessLastRDN2,
            ],
        };
        assert(!isLocalScope(mockCtx, dn1, dn2));
    });

});
