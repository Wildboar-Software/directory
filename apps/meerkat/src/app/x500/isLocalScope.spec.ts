import { isLocalScope } from "./isLocalScope.js";
import type { Name, RelativeDistinguishedName } from "@wildboar/pki-stub";
import { AttributeTypeAndValue } from "@wildboar/pki-stub";
import { countryCode3c, countryCode3n, countryName, serialNumber } from "@wildboar/x500/SelectedAttributeTypes";
import { BER } from "@wildboar/asn1/functional";
import { strict as assert } from "node:assert";

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

describe("isLocalScope()", () => {

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
        assert(isLocalScope(dn1, dn2));
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
        assert(!isLocalScope(dn1, dn2));
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
        assert(isLocalScope(dn1, dn2));
        assert(isLocalScope(dn2, dn3));
        assert(isLocalScope(dn1, dn3));
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
        assert(!isLocalScope(dn1, dn2));
        assert(!isLocalScope(dn2, dn3));
        assert(!isLocalScope(dn1, dn3));
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
        assert(!isLocalScope(dn1, dn2));
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
        assert(!isLocalScope(dn1, dn2));
    });

    it("considers two DNs non-local if both are the same, but have no country attributes", () => {
        const dn1: Name = {
            rdnSequence: [
                meaninglessLastRDN1,
            ],
        };
        const dn2: Name = dn1;
        assert(!isLocalScope(dn1, dn2));
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
        assert(!isLocalScope(dn1, dn2));
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
        assert(isLocalScope(dn1, dn2));
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
        assert(!isLocalScope(dn1, dn2));
    });

});
