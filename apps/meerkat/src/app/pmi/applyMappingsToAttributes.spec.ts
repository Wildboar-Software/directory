import { vi } from "vitest";
import type { IndexableOID } from "../types/index.js";
import {
    Attribute,
    Attribute_valuesWithContext_Item,
} from "@wildboar/pki-stub";
import {
    AttributeMappings_Item_typeMappings,
    AttributeMappings_Item_typeValueMappings,
    type AttributeMappings,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import {
    compareElements,
    groupByOID,
    type EqualityMatcher,
} from "@wildboar/x500";
import { ASN1Element } from "@wildboar/asn1";
import { AttributeTypeAndValue, type AttributeType } from "@wildboar/x500/InformationFramework";
import { applyMappingsToAttributes } from "./applyMappingsToAttributes.js";
import {
    commonName,
    localityName,
    telephoneNumber,
    pseudonym,
    organizationIdentifier,
    organizationName,
    dmdName,
} from "@wildboar/x500/SelectedAttributeTypes";
import { DER } from "@wildboar/asn1/functional";

const mappings1: AttributeMappings = [
    {
        typeMappings: new AttributeMappings_Item_typeMappings(
            commonName["&id"],
            localityName["&id"],
        ),
    },
    {
        typeValueMappings: new AttributeMappings_Item_typeValueMappings(
            new AttributeTypeAndValue(
                commonName["&id"],
                commonName.encoderFor["&Type"]!({ printableString: "St. Augustine" }, DER),
            ),
            new AttributeTypeAndValue(
                localityName["&id"],
                localityName.encoderFor["&Type"]!({ printableString: "Saint Augustine" }, DER),
            ),
        ),
    },
];

const mappings2: AttributeMappings = [
    ...mappings1,
    {
        typeValueMappings: new AttributeMappings_Item_typeValueMappings(
            new AttributeTypeAndValue(
                commonName["&id"],
                commonName.encoderFor["&Type"]!({ printableString: "St. Aug" }, DER),
            ),
            new AttributeTypeAndValue(
                localityName["&id"],
                localityName.encoderFor["&Type"]!({ printableString: "Saint Augustine" }, DER),
            ),
        ),
    },
];

const typeMappings: AttributeMappings = [
    {
        typeMappings: new AttributeMappings_Item_typeMappings(
            commonName["&id"],
            localityName["&id"],
        ),
    },
    {
        typeMappings: new AttributeMappings_Item_typeMappings(
            organizationIdentifier["&id"],
            pseudonym["&id"],
        ),
    },
];

describe("applyMappingsToAttributes", () => {
    it("handles empty mapping gracefully", () => {
        const attributesMap = new Map();
        const remoteToLocalResult = applyMappingsToAttributes(
            attributesMap,
            [],
            () => "",
            () => undefined,
            true,
        );
        expect(remoteToLocalResult.next().done).to.be.true;
        const localToRemoteResult = applyMappingsToAttributes(
            attributesMap,
            [],
            () => "",
            () => undefined,
            false,
        );
        expect(localToRemoteResult.next().done).to.be.true;
    });

    it("handles empty attribute arrays gracefully", () => {
        const attributesMap = new Map([
            [ commonName["&id"].toString(), [] ],
            [ localityName["&id"].toString(), [] ],
        ]);
        const remoteToLocalResult = applyMappingsToAttributes(
            attributesMap,
            mappings1,
            () => "",
            () => undefined,
            true,
        );
        expect(remoteToLocalResult.next().done).to.be.true;
        const localToRemoteResult = applyMappingsToAttributes(
            attributesMap,
            mappings1,
            () => "",
            () => undefined,
            false,
        );
        expect(localToRemoteResult.next().done).to.be.true;
    });

    it("handles empty attributes gracefully", () => {
        const attributes: Attribute[] = [
            new Attribute(
                commonName["&id"],
                [],
            ),
            new Attribute(
                telephoneNumber["&id"],
                [],
            ),
        ];
        const attributesMap = groupByOID(attributes, (a) => a.type_);
        const remoteToLocalResult = applyMappingsToAttributes(
            attributesMap,
            mappings1,
            () => "",
            () => undefined,
            true,
        );
        expect(remoteToLocalResult.next().done).to.be.true;
        const localToRemoteResult = applyMappingsToAttributes(
            attributesMap,
            mappings1,
            () => "",
            () => undefined,
            false,
        );
        // commonName gets translated to localityName, despite no values
        expect(localToRemoteResult.next().done).to.be.false;
        expect(localToRemoteResult.next().done).to.be.true;
    });

    it("handles empty attribute values with context gracefully", () => {
        const attributes: Attribute[] = [
            new Attribute(
                commonName["&id"],
                [commonName.encoderFor["&Type"]!({ printableString: "St. Augustine" }, DER)],
                [],
            ),
            new Attribute(
                telephoneNumber["&id"],
                [telephoneNumber.encoderFor["&Type"]!("+1 234 456 7890", DER)],
                [],
            ),
        ];
        const attributesMap = groupByOID(attributes, (a) => a.type_);
        const remoteToLocalResult = applyMappingsToAttributes(
            attributesMap,
            mappings1,
            () => "",
            () => undefined,
            true,
        );
        expect(remoteToLocalResult.next().done).to.be.true;
        const localToRemoteResult = applyMappingsToAttributes(
            attributesMap,
            mappings1,
            () => "",
            () => undefined,
            false,
        );
        // commonName gets mapped to localityName, despite no values
        expect(localToRemoteResult.next().done).to.be.false;
        // ...then, commonName "St. Augustine" gets mapped to localityName "Saint Augustine"
        expect(localToRemoteResult.next().done).to.be.false;
        expect(localToRemoteResult.next().done).to.be.true;
    });

    it("handles value indexing errors gracefully", () => {
        const attributes: Attribute[] = [
            new Attribute(
                commonName["&id"],
                [commonName.encoderFor["&Type"]!({ printableString: "St. Augustine" }, DER)],
                [],
            ),
            new Attribute(
                telephoneNumber["&id"],
                [telephoneNumber.encoderFor["&Type"]!("+1 234 456 7890", DER)],
                [],
            ),
        ];
        const attributesMap = groupByOID(attributes, (a) => a.type_);

        // This indexer should fail
        const indexer = (_: AttributeType, v: ASN1Element) => v.external.toString();
        const getEqualityMatcher = () => compareElements;
        const obj = { indexer } as const;
        const spiedIndexer = vi.spyOn(obj, "indexer");
        // We need multiple value mappings for the same mapped attribute type to
        // trigger usage of the attribute value indexing function, which is why
        // we use mappings2 in this test.
        const remoteToLocalResult = applyMappingsToAttributes(
            attributesMap,
            mappings2,
            spiedIndexer,
            getEqualityMatcher,
            true,
        );
        // There no localityName to map to commonName and all attribute value mappings fail.
        expect(remoteToLocalResult.next().done).to.be.true;
        const localToRemoteResult = applyMappingsToAttributes(
            attributesMap,
            mappings2,
            spiedIndexer,
            getEqualityMatcher,
            false,
        );
        // There is one mapping from the local commonName to localityName
        expect(localToRemoteResult.next().done).to.be.false;
        // ...all subsequent attribute value comparisons fail.
        expect(localToRemoteResult.next().done).to.be.true;
        // We want to make sure that this code path is actually taken.
        expect(spiedIndexer).toHaveBeenCalled;
    });

    it("handles value matching errors gracefully", () => {
        const attributes: Attribute[] = [
            new Attribute(
                commonName["&id"],
                [commonName.encoderFor["&Type"]!({ printableString: "St. Augustine" }, DER)],
                [],
            ),
            new Attribute(
                telephoneNumber["&id"],
                [telephoneNumber.encoderFor["&Type"]!("+1 234 456 7890", DER)],
                [],
            ),
        ];
        const attributesMap = groupByOID(attributes, (a) => a.type_);

        const indexer = (_: AttributeType, v: ASN1Element) => v.printableString;
        // This equality matcher should fail.
        const getEqualityMatcher = () => (a: ASN1Element) => !a.external;
        const obj = { getEqualityMatcher } as const;
        const spiedMatcher = vi.spyOn(obj, "getEqualityMatcher");
        const remoteToLocalResult = applyMappingsToAttributes(
            attributesMap,
            mappings1,
            indexer,
            spiedMatcher,
            true,
        );
        // There no localityName to map to commonName and all attribute value mappings fail.
        expect(remoteToLocalResult.next().done).to.be.true;
        const localToRemoteResult = applyMappingsToAttributes(
            attributesMap,
            mappings1,
            indexer,
            spiedMatcher,
            false,
        );
        // There is one mapping of the localityName type to commonName
        expect(localToRemoteResult.next().done).to.be.false;
        expect(localToRemoteResult.next().done).to.be.true;
        // We want to make sure that this code path is actually taken.
        expect(spiedMatcher).toHaveBeenCalled;
    });

    it("maps types correctly", () => {
        const attributes: Attribute[] = [
            new Attribute(
                commonName["&id"],
                [commonName.encoderFor["&Type"]!({ printableString: "St. Augustine" }, DER)],
                [],
            ),
            new Attribute( // This should have no impact on this test.
                telephoneNumber["&id"],
                [telephoneNumber.encoderFor["&Type"]!("+1 234 456 7890", DER)],
                [],
            ),
            new Attribute(
                pseudonym["&id"],
                [pseudonym.encoderFor["&Type"]!({ printableString: "NYSE:AAPL" }, DER)],
                [],
            ),
        ];
        const attributesMap = groupByOID(attributes, (a) => a.type_);
        const indexer = (_: AttributeType, v: ASN1Element) => v.printableString;
        const getEqualityMatcher = () => (a: ASN1Element, v: ASN1Element) => a.printableString === v.printableString;

        const remoteToLocalResult = applyMappingsToAttributes(
            attributesMap,
            typeMappings,
            indexer,
            getEqualityMatcher,
            true,
        );
        const remoteToLocalResults = Array.from(remoteToLocalResult);
        expect(remoteToLocalResults).to.have.length(1);
        expect(remoteToLocalResults[0].type_.toString()).to.equal(organizationIdentifier["&id"].toString());
        expect(remoteToLocalResults[0].values).to.have.length(1);
        expect(remoteToLocalResults[0].values[0].printableString).to.equal("NYSE:AAPL");

        const localToRemoteResult = applyMappingsToAttributes(
            attributesMap,
            typeMappings,
            indexer,
            getEqualityMatcher,
            false,
        );
        const localToRemoteResults = Array.from(localToRemoteResult);
        expect(localToRemoteResults).to.have.length(1);
        expect(localToRemoteResults[0].type_.toString()).to.equal(localityName["&id"].toString());
        expect(localToRemoteResults[0].values).to.have.length(1);
        expect(localToRemoteResults[0].values[0].printableString).to.equal("St. Augustine");
    });

    it("maps individual values correctly", () => {
        const attributes: Attribute[] = [
            new Attribute(
                commonName["&id"],
                [commonName.encoderFor["&Type"]!({ printableString: "St. Augustine" }, DER)],
                [],
            ),
            new Attribute( // This should have no impact on this test.
                telephoneNumber["&id"],
                [telephoneNumber.encoderFor["&Type"]!("+1 234 456 7890", DER)],
                [],
            ),
            new Attribute(
                pseudonym["&id"],
                [pseudonym.encoderFor["&Type"]!({ printableString: "Apple" }, DER)],
                [],
            ),
        ];
        const attributesMap = groupByOID(attributes, (a) => a.type_);
        const indexer = (_: AttributeType, v: ASN1Element) => v.printableString;
        const getEqualityMatcher = () => (a: ASN1Element, v: ASN1Element) => a.printableString === v.printableString;
        const valueMappings: AttributeMappings = [
            {
                typeValueMappings: new AttributeMappings_Item_typeValueMappings(
                    new AttributeTypeAndValue(
                        commonName["&id"],
                        commonName.encoderFor["&Type"]!({ printableString: "St. Augustine" }, DER),
                    ),
                    new AttributeTypeAndValue(
                        localityName["&id"],
                        localityName.encoderFor["&Type"]!({ printableString: "Saint Augustine" }, DER),
                    ),
                ),
            },
            { // Totally unused one just to make sure it works.
                typeValueMappings: new AttributeMappings_Item_typeValueMappings(
                    new AttributeTypeAndValue(
                        organizationName["&id"],
                        organizationName.encoderFor["&Type"]!({ printableString: "Apple, Inc." }, DER),
                    ),
                    new AttributeTypeAndValue(
                        dmdName["&id"],
                        dmdName.encoderFor["&Type"]!({ printableString: "APPLE DMD" }, DER),
                    ),
                ),
            },
            {
                typeValueMappings: new AttributeMappings_Item_typeValueMappings(
                    new AttributeTypeAndValue(
                        organizationIdentifier["&id"],
                        organizationIdentifier.encoderFor["&Type"]!({ printableString: "NYSE:AAPL" }, DER),
                    ),
                    new AttributeTypeAndValue(
                        pseudonym["&id"],
                        pseudonym.encoderFor["&Type"]!({ printableString: "Apple" }, DER),
                    ),
                ),
            },
        ];

        const remoteToLocalResult = applyMappingsToAttributes(
            attributesMap,
            valueMappings,
            indexer,
            getEqualityMatcher,
            true,
        );
        const remoteToLocalResults = Array.from(remoteToLocalResult);
        expect(remoteToLocalResults).to.have.length(1);
        expect(remoteToLocalResults[0].type_.toString()).to.equal(organizationIdentifier["&id"].toString());
        expect(remoteToLocalResults[0].values).to.have.length(1);
        expect(remoteToLocalResults[0].values[0].printableString).to.equal("NYSE:AAPL");

        const localToRemoteResult = applyMappingsToAttributes(
            attributesMap,
            valueMappings,
            indexer,
            getEqualityMatcher,
            false,
        );
        const localToRemoteResults = Array.from(localToRemoteResult);
        expect(localToRemoteResults).to.have.length(1);
        expect(localToRemoteResults[0].type_.toString()).to.equal(localityName["&id"].toString());
        expect(localToRemoteResults[0].values).to.have.length(1);
        expect(localToRemoteResults[0].values[0].printableString).to.equal("Saint Augustine");
    });

    it("maps multiple values correctly", () => {
        const attributes: Attribute[] = [
            new Attribute(
                commonName["&id"],
                [commonName.encoderFor["&Type"]!({ printableString: "St. Augustine" }, DER)],
                [],
            ),
            new Attribute( // This should have no impact on this test.
                telephoneNumber["&id"],
                [telephoneNumber.encoderFor["&Type"]!("+1 234 456 7890", DER)],
                [],
            ),
            new Attribute(
                pseudonym["&id"],
                [pseudonym.encoderFor["&Type"]!({ printableString: "Apple" }, DER)],
                [],
            ),
        ];
        const attributesMap = groupByOID(attributes, (a) => a.type_);
        const indexer = (_: AttributeType, v: ASN1Element) => v.printableString;
        const getEqualityMatcher = () => (a: ASN1Element, v: ASN1Element) => a.printableString === v.printableString;
        const valueMappings: AttributeMappings = [
            {
                typeValueMappings: new AttributeMappings_Item_typeValueMappings(
                    new AttributeTypeAndValue(
                        commonName["&id"],
                        commonName.encoderFor["&Type"]!({ printableString: "St. Augustine" }, DER),
                    ),
                    new AttributeTypeAndValue(
                        localityName["&id"],
                        localityName.encoderFor["&Type"]!({ printableString: "Saint Augustine" }, DER),
                    ),
                ),
            },
            { // Totally unused one just to make sure it works.
                typeValueMappings: new AttributeMappings_Item_typeValueMappings(
                    new AttributeTypeAndValue(
                        organizationName["&id"],
                        organizationName.encoderFor["&Type"]!({ printableString: "Apple, Inc." }, DER),
                    ),
                    new AttributeTypeAndValue(
                        dmdName["&id"],
                        dmdName.encoderFor["&Type"]!({ printableString: "APPLE DMD" }, DER),
                    ),
                ),
            },
            {
                typeValueMappings: new AttributeMappings_Item_typeValueMappings(
                    new AttributeTypeAndValue(
                        organizationIdentifier["&id"],
                        organizationIdentifier.encoderFor["&Type"]!({ printableString: "NYSE:AAPL" }, DER),
                    ),
                    new AttributeTypeAndValue(
                        pseudonym["&id"],
                        pseudonym.encoderFor["&Type"]!({ printableString: "Apple" }, DER),
                    ),
                ),
            },
            {
                typeValueMappings: new AttributeMappings_Item_typeValueMappings(
                    new AttributeTypeAndValue(
                        commonName["&id"],
                        commonName.encoderFor["&Type"]!({ printableString: "St. Augustine 2" }, DER),
                    ),
                    new AttributeTypeAndValue(
                        localityName["&id"],
                        localityName.encoderFor["&Type"]!({ printableString: "Saint Augustine 2" }, DER),
                    ),
                ),
            },
            { // Totally unused one just to make sure it works.
                typeValueMappings: new AttributeMappings_Item_typeValueMappings(
                    new AttributeTypeAndValue(
                        organizationName["&id"],
                        organizationName.encoderFor["&Type"]!({ printableString: "Apple, Inc. 2" }, DER),
                    ),
                    new AttributeTypeAndValue(
                        dmdName["&id"],
                        dmdName.encoderFor["&Type"]!({ printableString: "APPLE DMD 2" }, DER),
                    ),
                ),
            },
            {
                typeValueMappings: new AttributeMappings_Item_typeValueMappings(
                    new AttributeTypeAndValue(
                        organizationIdentifier["&id"],
                        organizationIdentifier.encoderFor["&Type"]!({ printableString: "NYSE:AAPL 2" }, DER),
                    ),
                    new AttributeTypeAndValue(
                        pseudonym["&id"],
                        pseudonym.encoderFor["&Type"]!({ printableString: "Apple 2" }, DER),
                    ),
                ),
            },
        ];

        const remoteToLocalResult = applyMappingsToAttributes(
            attributesMap,
            valueMappings,
            indexer,
            getEqualityMatcher,
            true,
        );
        const remoteToLocalResults = Array.from(remoteToLocalResult);
        expect(remoteToLocalResults).to.have.length(1);
        expect(remoteToLocalResults[0].type_.toString()).to.equal(organizationIdentifier["&id"].toString());
        expect(remoteToLocalResults[0].values).to.have.length(1);
        expect(remoteToLocalResults[0].values[0].printableString).to.equal("NYSE:AAPL");

        const localToRemoteResult = applyMappingsToAttributes(
            attributesMap,
            valueMappings,
            indexer,
            getEqualityMatcher,
            false,
        );
        const localToRemoteResults = Array.from(localToRemoteResult);
        expect(localToRemoteResults).to.have.length(1);
        expect(localToRemoteResults[0].type_.toString()).to.equal(localityName["&id"].toString());
        expect(localToRemoteResults[0].values).to.have.length(1);
        expect(localToRemoteResults[0].values[0].printableString).to.equal("Saint Augustine");
    });

});
