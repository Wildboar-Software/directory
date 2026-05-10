import {
    type AllowedAttributeAssignments,
    AllowedAttributeAssignments_Item,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import { DER } from "@wildboar/asn1/functional";
import { aaaIsImproperSubset } from "./aaaIsImproperSubset.js";
import {
    commonName,
    surname,
    telephoneNumber,
    serialNumber,
    languageContext,
    localeContext,
    temporalContext,
    localityName,
    facsimileTelephoneNumber,
    TimeSpecification,
    TimeSpecification_time_absolute,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    Attribute,
    Attribute_valuesWithContext_Item,
    Context,
} from "@wildboar/pki-stub";
import { ObjectIdentifier } from "@wildboar/asn1";

describe("aaaIsImproperSubset", () => {
    it("returns true for identical sets", () => {
        const superset: AllowedAttributeAssignments = [
            new AllowedAttributeAssignments_Item(
                [],
                {
                    dNSName: "example.com",
                },
            ),
        ];
        const subset: AllowedAttributeAssignments = [
            new AllowedAttributeAssignments_Item(
                [],
                {
                    dNSName: "example.com",
                },
            ),
        ];
        const result = aaaIsImproperSubset(superset, subset);
        expect(result).toBe(true);
    });

    it("returns true for sets for which the superset's holder domain is a prefix", () => {
        const superset: AllowedAttributeAssignments = [
            new AllowedAttributeAssignments_Item(
                [],
                {
                    dNSName: "example.com",
                },
            ),
        ];
        const subset: AllowedAttributeAssignments = [
            new AllowedAttributeAssignments_Item(
                [],
                {
                    dNSName: "boofus.example.com",
                },
            ),
        ];
        const result = aaaIsImproperSubset(superset, subset);
        expect(result).toBe(true);
    });

    it("returns false for sets for which the subsets's holder domain is a prefix", () => {
        const superset: AllowedAttributeAssignments = [
            new AllowedAttributeAssignments_Item(
                [],
                {
                    dNSName: "example.com",
                },
            ),
        ];
        const subset: AllowedAttributeAssignments = [
            new AllowedAttributeAssignments_Item(
                [],
                {
                    dNSName: "com",
                },
            ),
        ];
        const result = aaaIsImproperSubset(superset, subset);
        expect(result).toBe(false);
    });

    it("returns false for sets that don't even use the same name forms for holder domains", () => {
        const superset: AllowedAttributeAssignments = [
            new AllowedAttributeAssignments_Item(
                [],
                {
                    dNSName: "example.com",
                },
            ),
        ];
        const subset: AllowedAttributeAssignments = [
            new AllowedAttributeAssignments_Item(
                [],
                {
                    directoryName: {
                        rdnSequence: [],
                    },
                },
            ),
        ];
        const result = aaaIsImproperSubset(superset, subset);
        expect(result).toBe(false);
    });

    it("correctly evaluates attribute type-only sets with same holder domains", () => {
        const superset: AllowedAttributeAssignments = [
            new AllowedAttributeAssignments_Item(
                [
                    {
                        attributeType: commonName["&id"],
                    },
                    {
                        attributeType: surname["&id"],
                    },
                ],
                {
                    dNSName: "example.com",
                },
            ),
        ];
        const subset: AllowedAttributeAssignments = [
            new AllowedAttributeAssignments_Item(
                [
                    {
                        attributeType: surname["&id"],
                    },
                ],
                {
                    dNSName: "example.com",
                },
            ),
        ];
        const result1 = aaaIsImproperSubset(superset, subset);
        expect(result1).toBe(true);

        superset[0].attributes.pop();
        const result2 = aaaIsImproperSubset(superset, subset);
        expect(result2).toBe(false);
    });

    it("correctly evaluates attribute value sets with same holder domains", () => {
        const superset: AllowedAttributeAssignments = [
            new AllowedAttributeAssignments_Item(
                [
                    {
                        attributeTypeandValues: new Attribute(
                            commonName["&id"],
                            [
                                commonName.encoderFor["&Type"]!({ printableString: "John Doe" }, DER),
                            ],
                        ),
                    },
                    {
                        attributeTypeandValues: new Attribute(
                            surname["&id"],
                            [
                                surname.encoderFor["&Type"]!({ printableString: "Doe" }, DER),
                            ],
                        ),
                    },
                ],
                {
                    dNSName: "example.com",
                },
            ),
        ];
        const subset: AllowedAttributeAssignments = [
            new AllowedAttributeAssignments_Item(
                [
                    {
                        attributeTypeandValues: new Attribute(
                            commonName["&id"],
                            [
                                commonName.encoderFor["&Type"]!({ printableString: "John Doe" }, DER),
                            ],
                        ),
                    },
                ],
                {
                    dNSName: "example.com",
                },
            ),
        ];
        const result1 = aaaIsImproperSubset(superset, subset);
        expect(result1).toBe(true);

        superset[0].attributes.pop();
        const result2 = aaaIsImproperSubset(superset, subset);
        expect(result2).toBe(true);

        superset[0].attributes.pop();
        const result3 = aaaIsImproperSubset(superset, subset);
        expect(result3).toBe(false);
    });

    it("correctly evaluates sets with attribute values with contexts and with same holder domains", () => {
        const superset: AllowedAttributeAssignments = [
            new AllowedAttributeAssignments_Item(
                [
                    {
                        attributeTypeandValues: new Attribute(
                            commonName["&id"],
                            [],
                            [
                                new Attribute_valuesWithContext_Item(
                                    commonName.encoderFor["&Type"]!({ printableString: "John Doe" }, DER),
                                    [
                                        new Context(
                                            languageContext["&id"],
                                            [ languageContext.encoderFor["&Type"]!("en", DER) ],
                                        ),
                                    ],
                                ),
                            ],
                        ),
                    },
                    {
                        attributeTypeandValues: new Attribute(
                            surname["&id"],
                            [],
                            [
                                new Attribute_valuesWithContext_Item(
                                    surname.encoderFor["&Type"]!({ printableString: "Doe" }, DER),
                                    [
                                        new Context(
                                            languageContext["&id"],
                                            [ languageContext.encoderFor["&Type"]!("fr", DER) ],
                                        ),
                                    ],
                                ),
                            ],
                        ),
                    },
                    {
                        attributeTypeandValues: new Attribute(
                            surname["&id"],
                            [],
                            [
                                new Attribute_valuesWithContext_Item(
                                    surname.encoderFor["&Type"]!({ printableString: "Doe" }, DER),
                                    [
                                        new Context(
                                            languageContext["&id"],
                                            [ languageContext.encoderFor["&Type"]!("en", DER) ],
                                        ),
                                    ],
                                ),
                            ],
                        ),
                    },
                ],
                {
                    dNSName: "example.com",
                },
            ),
        ];
        const subset: AllowedAttributeAssignments = [
            new AllowedAttributeAssignments_Item(
                [
                    {
                        attributeTypeandValues: new Attribute(
                            surname["&id"],
                            [],
                            [
                                new Attribute_valuesWithContext_Item(
                                    surname.encoderFor["&Type"]!({ printableString: "Doe" }, DER),
                                    [
                                        new Context(
                                            languageContext["&id"],
                                            [ languageContext.encoderFor["&Type"]!("en", DER) ],
                                        ),
                                    ],
                                ),
                            ],
                        ),
                    },
                ],
                {
                    dNSName: "example.com",
                },
            ),
        ];
        const result1 = aaaIsImproperSubset(superset, subset);
        expect(result1).toBe(true);

        superset[0].attributes.pop();
        const result2 = aaaIsImproperSubset(superset, subset);
        expect(result2).toBe(false);

        superset[0].attributes.pop();
        const result3 = aaaIsImproperSubset(superset, subset);
        expect(result3).toBe(false);
    });

    it("correctly combines multiple allowed attribute assignments in vertices beneath the holder domain", () => {
        const now = new Date();
        const superset: AllowedAttributeAssignments = [
            new AllowedAttributeAssignments_Item(
                [
                    {
                        attributeType: commonName["&id"],
                    },
                    {
                        attributeTypeandValues: new Attribute(
                            surname["&id"],
                            [],
                            [
                                new Attribute_valuesWithContext_Item(
                                    surname.encoderFor["&Type"]!({ printableString: "Doe" }, DER),
                                    [
                                        new Context(
                                            languageContext["&id"],
                                            [ languageContext.encoderFor["&Type"]!("fr", DER) ],
                                        ),
                                    ],
                                ),
                            ],
                        ),
                    },
                    {
                        attributeTypeandValues: new Attribute(
                            surname["&id"],
                            [],
                            [
                                new Attribute_valuesWithContext_Item(
                                    surname.encoderFor["&Type"]!({ printableString: "Doe" }, DER),
                                    [
                                        new Context(
                                            languageContext["&id"],
                                            [ languageContext.encoderFor["&Type"]!("en", DER) ],
                                        ),
                                    ],
                                ),
                            ],
                        ),
                    },
                ],
                {
                    registeredID: ObjectIdentifier.fromString("1.2.3"),
                },
            ),
            new AllowedAttributeAssignments_Item(
                [
                    {
                        attributeTypeandValues: new Attribute(
                            telephoneNumber["&id"],
                            [],
                            [
                                new Attribute_valuesWithContext_Item(
                                    telephoneNumber.encoderFor["&Type"]!("+1 234 567 8901", DER),
                                    [
                                        new Context(
                                            localeContext["&id"],
                                            [ localeContext.encoderFor["&Type"]!({
                                                localeID1: ObjectIdentifier.fromString("1.2.3.4.5.6.7.8"),
                                            }, DER) ],
                                        ),
                                    ],
                                ),
                            ],
                        ),
                    },
                ],
                {
                    registeredID: ObjectIdentifier.fromString("1.2.3.4.5"),
                },
            ),
            new AllowedAttributeAssignments_Item(
                [
                    {
                        attributeTypeandValues: new Attribute(
                            serialNumber["&id"],
                            [],
                            [
                                new Attribute_valuesWithContext_Item(
                                    serialNumber.encoderFor["&Type"]!("12345678901", DER),
                                    [
                                        new Context(
                                            languageContext["&id"],
                                            [
                                                languageContext.encoderFor["&Type"]!("en", DER),
                                                languageContext.encoderFor["&Type"]!("de", DER),
                                                languageContext.encoderFor["&Type"]!("fr", DER),
                                            ],
                                        ),
                                        new Context(
                                            temporalContext["&id"],
                                            [ temporalContext.encoderFor["&Type"]!(new TimeSpecification(
                                                {
                                                    absolute: new TimeSpecification_time_absolute(now),
                                                },
                                                false,
                                            ), DER) ],
                                        ),
                                    ],
                                ),
                            ],
                        ),
                    },
                ],
                {
                    registeredID: ObjectIdentifier.fromString("1.2.3.4.5.6.7"),
                },
            ),
            new AllowedAttributeAssignments_Item(
                [
                    {
                        attributeTypeandValues: new Attribute(
                            serialNumber["&id"],
                            [serialNumber.encoderFor["&Type"]!("555", DER)],
                        ),
                    },
                ],
                {
                    registeredID: ObjectIdentifier.fromString("1.2.3.4.5.6"),
                },
            ),
            // This value should not apply because it is for a totally different holder domain.
            new AllowedAttributeAssignments_Item(
                [
                    {
                        attributeTypeandValues: new Attribute(
                            serialNumber["&id"],
                            [serialNumber.encoderFor["&Type"]!("444", DER)],
                        ),
                    },
                ],
                {
                    registeredID: ObjectIdentifier.fromString("2.2.3.4.5.6.7"),
                },
            ),
        ];
        const subset: AllowedAttributeAssignments = [
            new AllowedAttributeAssignments_Item(
                [],
                {
                    registeredID: ObjectIdentifier.fromString("1.2.3.4.5.6.7.8"),
                },
            ),
        ];

        {
            const result = aaaIsImproperSubset(superset, subset);
            expect(result).toBe(true);
        }

        {
            subset[0].attributes.push({
                attributeType: commonName["&id"],
            });
            const result = aaaIsImproperSubset(superset, subset);
            expect(result).toBe(true);
        }

        {
            subset[0].attributes.push({
                attributeType: localityName["&id"],
            });
            const result = aaaIsImproperSubset(superset, subset);
            expect(result).toBe(false);
            subset[0].attributes.pop();
        }

        {
            subset[0].attributes.push({
                attributeTypeandValues: new Attribute(
                    serialNumber["&id"],
                    [serialNumber.encoderFor["&Type"]!("555", DER)],
                ),
            });
            const result = aaaIsImproperSubset(superset, subset);
            expect(result).toBe(true);
            // subset[0].attributes.pop();
        }

        {
            // This should not cause the result to change.
            subset.push(new AllowedAttributeAssignments_Item(
                [],
                {
                    registeredID: ObjectIdentifier.fromString("1.2.3.4.5.6.7.8"),
                },
            ));
            const result = aaaIsImproperSubset(superset, subset);
            expect(result).toBe(true);
        }

        {
            // This should cause failure.
            subset.push(new AllowedAttributeAssignments_Item(
                [
                    {
                        attributeType: facsimileTelephoneNumber["&id"],
                    }
                ],
                {
                    registeredID: ObjectIdentifier.fromString("1.2.3.4.5.6.7.8"),
                },
            ));
            const result = aaaIsImproperSubset(superset, subset);
            expect(result).toBe(false);
            subset.pop();
        }

        { // This should be allowed: explicitly allowed value.
            subset[0].attributes.push(
                {
                    attributeTypeandValues: new Attribute(
                        telephoneNumber["&id"],
                        [],
                        [
                            new Attribute_valuesWithContext_Item(
                                telephoneNumber.encoderFor["&Type"]!("+1 234 567 8901", DER),
                                [
                                    new Context(
                                        localeContext["&id"],
                                        [ localeContext.encoderFor["&Type"]!({
                                            localeID1: ObjectIdentifier.fromString("1.2.3.4.5.6.7.8"),
                                        }, DER) ],
                                    ),
                                ],
                            ),
                        ],
                    ),
                },
            );
            const result = aaaIsImproperSubset(superset, subset);
            expect(result).toBe(true);
            // subset[0].attributes.pop();
        }

        { // This should be forbidden: explicitly allowed value, but extra contexts
            subset[0].attributes.push(
                {
                    attributeTypeandValues: new Attribute(
                        telephoneNumber["&id"],
                        [],
                        [
                            new Attribute_valuesWithContext_Item(
                                telephoneNumber.encoderFor["&Type"]!("+1 234 567 8901", DER),
                                [
                                    new Context(
                                        localeContext["&id"],
                                        [ localeContext.encoderFor["&Type"]!({
                                            localeID1: ObjectIdentifier.fromString("1.2.3.4.5.6.7.8"),
                                        }, DER) ],
                                    ),
                                    new Context(
                                        localeContext["&id"],
                                        [ localeContext.encoderFor["&Type"]!({
                                            localeID1: ObjectIdentifier.fromString("1.2.3.4.5.6.7.9"),
                                        }, DER) ],
                                    ),
                                ],
                            ),
                        ],
                    ),
                },
            );
            const result = aaaIsImproperSubset(superset, subset);
            expect(result).toBe(false);
            subset[0].attributes.pop();
        }

        {
            const langContextList = [
                languageContext.encoderFor["&Type"]!("en", DER),
                languageContext.encoderFor["&Type"]!("de", DER),
                languageContext.encoderFor["&Type"]!("fr", DER),
            ];

            subset[0].attributes.push(
                {
                    attributeTypeandValues: new Attribute(
                        serialNumber["&id"],
                        [],
                        [
                            new Attribute_valuesWithContext_Item(
                                serialNumber.encoderFor["&Type"]!("12345678901", DER),
                                [
                                    new Context(
                                        languageContext["&id"],
                                        langContextList,
                                    ),
                                    new Context(
                                        temporalContext["&id"],
                                        [ temporalContext.encoderFor["&Type"]!(new TimeSpecification(
                                            {
                                                absolute: new TimeSpecification_time_absolute(now),
                                            },
                                            false,
                                        ), DER) ],
                                    ),
                                ],
                            ),
                        ],
                    ),
                },
            );

            {
                const result = aaaIsImproperSubset(superset, subset);
                expect(result).toBe(true);
            }

            const lang1 = langContextList.shift();
            {
                const result = aaaIsImproperSubset(superset, subset);
                expect(result).toBe(false);
            }

            langContextList.push(lang1!);
            {
                const result = aaaIsImproperSubset(superset, subset);
                expect(result).toBe(true);
            }
            
            // subset[0].attributes.pop();
        }
    });

});
