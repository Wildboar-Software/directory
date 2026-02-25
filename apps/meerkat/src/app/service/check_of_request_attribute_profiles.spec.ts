import type { Context, IndexableOID } from "../types/index.js";
import { ContextProfile, SearchRule } from "@wildboar/x500/ServiceAdministration";
import { SearchArgumentData } from "@wildboar/x500/DirectoryAbstractService";
import { RequestAttribute } from "@wildboar/x500/ServiceAdministration";
import { ObjectIdentifier } from "@wildboar/asn1";
import { name, commonName, languageContext, localeContext } from "@wildboar/x500/SelectedAttributeTypes";
import type { Filter } from "@wildboar/x500/DirectoryAbstractService";
import { AttributeValueAssertion, ContextAssertion } from "@wildboar/x500/InformationFramework";
import { check_of_request_attribute_profiles } from "./check_of_request_attribute_profiles.js";
import { BER } from "@wildboar/asn1/functional";
import { getMockCtx } from "../testing.spec.js";

const rule_oid = ObjectIdentifier.fromString("1.2.3.4");

describe("check_of_request_attribute_profiles", () => {
    it("should not find any violations in the simplest compliant case", () => {
        const ctx: Context = getMockCtx();
        const filter: Filter = {
            item: {
                equality: new AttributeValueAssertion(
                    commonName["&id"],
                    commonName.encoderFor["&Type"]!({ uTF8String: "John Doe" }, BER),
                ),
            },
        };
        const search = new SearchArgumentData(
            {
                rdnSequence: [],
            },
            undefined,
            filter,
        );
        const rule = new SearchRule(
            1,
            rule_oid,
            undefined,
            undefined,
            [
                new RequestAttribute(commonName["&id"], true, undefined, undefined, undefined, undefined, undefined),
            ],
        );
        const [failed_step, state] = check_of_request_attribute_profiles(ctx, search, rule);
        expect(failed_step).toBe(0);
        expect(state.searchValuesRequired).toEqual([]);
        expect(state.invalidSearchValues).toEqual([]);
        expect(state.missingSearchContexts).toEqual([]);
        expect(state.contextComboViolations).toEqual([]);
        expect(state.searchContextViolations).toEqual([]);
        expect(state.searchContextValueViolations).toEqual([]);
    });

    it("should not find any violations with subtypes if includeSubtypes is used", () => {
        const ctx: Context = getMockCtx();
        const filter: Filter = {
            item: {
                equality: new AttributeValueAssertion(
                    commonName["&id"],
                    commonName.encoderFor["&Type"]!({ uTF8String: "John Doe" }, BER),
                ),
            },
        };
        const search = new SearchArgumentData(
            {
                rdnSequence: [],
            },
            undefined,
            filter,
        );
        const rule = new SearchRule(
            1,
            rule_oid,
            undefined,
            undefined,
            [
                new RequestAttribute(name["&id"], true, undefined, undefined, undefined, undefined, undefined),
            ],
        );
        const [failed_step, state] = check_of_request_attribute_profiles(ctx, search, rule);
        expect(failed_step).toBe(0);
        expect(state.searchValuesRequired).toEqual([]);
        expect(state.invalidSearchValues).toEqual([]);
        expect(state.missingSearchContexts).toEqual([]);
        expect(state.contextComboViolations).toEqual([]);
        expect(state.searchContextViolations).toEqual([]);
        expect(state.searchContextValueViolations).toEqual([]);
    });

    it("should restrict search filters to selected values if selectedValues is used", () => {
        const SELECTED_VALUE = commonName.encoderFor["&Type"]!({ uTF8String: "James Smith" }, BER);
        const NON_SELECTED_VALUE = commonName.encoderFor["&Type"]!({ uTF8String: "John Doe" }, BER);
        const ctx: Context = getMockCtx();
        const rule = new SearchRule(
            1,
            rule_oid,
            undefined,
            undefined,
            [
                new RequestAttribute(
                    commonName["&id"],
                    true,
                    [SELECTED_VALUE],
                    undefined,
                    undefined,
                    undefined,
                    undefined
                ),
            ],
        );

        { // This should fail because we are using a non-selected value.
            const filter: Filter = {
                item: {
                    equality: new AttributeValueAssertion(
                        commonName["&id"],
                        NON_SELECTED_VALUE,
                    ),
                },
            };
            const search = new SearchArgumentData(
                {
                    rdnSequence: [],
                },
                undefined,
                filter,
            );
            const [failed_step, state] = check_of_request_attribute_profiles(ctx, search, rule);
            expect(failed_step).toBe(2);
            expect(state.searchValuesRequired).toEqual([]);
            expect(state.invalidSearchValues).toEqual([ filter.item ]);
            expect(state.missingSearchContexts).toEqual([]);
            expect(state.contextComboViolations).toEqual([]);
            expect(state.searchContextViolations).toEqual([]);
            expect(state.searchContextValueViolations).toEqual([]);
        }

        { // This should pass because we are using a selected value.
            const filter: Filter = {
                item: {
                    equality: new AttributeValueAssertion(
                        commonName["&id"],
                        SELECTED_VALUE,
                    ),
                },
            };
            const search = new SearchArgumentData(
                {
                    rdnSequence: [],
                },
                undefined,
                filter,
            );
            const [failed_step, state] = check_of_request_attribute_profiles(ctx, search, rule);
            expect(failed_step).toBe(0);
            expect(state.searchValuesRequired).toEqual([]);
            expect(state.invalidSearchValues).toEqual([]);
            expect(state.missingSearchContexts).toEqual([]);
            expect(state.contextComboViolations).toEqual([]);
            expect(state.searchContextViolations).toEqual([]);
            expect(state.searchContextValueViolations).toEqual([]);
        }
    });

    it("should restrict context types used in filters", () => {
        const SELECTED_VALUE = commonName.encoderFor["&Type"]!({ uTF8String: "James Smith" }, BER);
        const ctx: Context = getMockCtx();
        const rule = new SearchRule(
            1,
            rule_oid,
            undefined,
            undefined,
            [
                new RequestAttribute(
                    commonName["&id"],
                    true,
                    undefined,
                    undefined,
                    [
                        new ContextProfile(
                            languageContext["&id"],
                            undefined,
                        ),
                    ],
                    undefined,
                    undefined,
                ),
            ],
        );

        { // This should fail because we are using a non-permitted context type.
            const filter: Filter = {
                item: {
                    equality: new AttributeValueAssertion(
                        commonName["&id"],
                        SELECTED_VALUE,
                        {
                            selectedContexts: [
                                new ContextAssertion(
                                    localeContext["&id"],
                                    [localeContext.encoderFor["&Type"]!({ localeID2: { printableString: "en" } }, BER)],
                                ),
                            ],
                        }
                    ),
                },
            };
            const search = new SearchArgumentData(
                {
                    rdnSequence: [],
                },
                undefined,
                filter,
            );
            const [failed_step, state] = check_of_request_attribute_profiles(ctx, search, rule);
            expect(failed_step).toBe(5);
            expect(state.searchValuesRequired).toEqual([]);
            expect(state.invalidSearchValues).toEqual([]);
            expect(state.missingSearchContexts).toEqual([]);
            expect(state.contextComboViolations).toEqual([]);
            expect(state.searchContextViolations.map(v => v.toString())).toEqual([ localeContext["&id"].toString() ]);
            expect(state.searchContextValueViolations).toEqual([]);
        }

        { // This should succeed because we are using a permitted context type.
            const filter: Filter = {
                item: {
                    equality: new AttributeValueAssertion(
                        commonName["&id"],
                        SELECTED_VALUE,
                        {
                            selectedContexts: [
                                new ContextAssertion(
                                    languageContext["&id"],
                                    [languageContext.encoderFor["&Type"]!("en", BER)],
                                ),
                            ],
                        }
                    ),
                },
            };
            const search = new SearchArgumentData(
                {
                    rdnSequence: [],
                },
                undefined,
                filter,
            );
            const [failed_step, state] = check_of_request_attribute_profiles(ctx, search, rule);
            expect(failed_step).toBe(0);
            expect(state.searchValuesRequired).toEqual([]);
            expect(state.invalidSearchValues).toEqual([]);
            expect(state.missingSearchContexts).toEqual([]);
            expect(state.contextComboViolations).toEqual([]);
            expect(state.searchContextViolations).toEqual([]);
            expect(state.searchContextValueViolations).toEqual([]);
        }
    });

    it("should restrict context values used in filters", () => {
        const SELECTED_VALUE = commonName.encoderFor["&Type"]!({ uTF8String: "James Smith" }, BER);
        const ctx: Context = getMockCtx();
        const rule = new SearchRule(
            1,
            rule_oid,
            undefined,
            undefined,
            [
                new RequestAttribute(
                    commonName["&id"],
                    true,
                    undefined,
                    undefined,
                    [
                        new ContextProfile(
                            languageContext["&id"],
                            [languageContext.encoderFor["&Type"]!("en", BER)],
                        ),
                    ],
                    undefined,
                    undefined,
                ),
            ],
        );

        { // This should fail because we are using a non-permitted context value.
            const filter: Filter = {
                item: {
                    equality: new AttributeValueAssertion(
                        commonName["&id"],
                        SELECTED_VALUE,
                        {
                            selectedContexts: [
                                new ContextAssertion(
                                    languageContext["&id"],
                                    [languageContext.encoderFor["&Type"]!("fr", BER)],
                                ),
                            ],
                        }
                    ),
                },
            };
            const search = new SearchArgumentData(
                {
                    rdnSequence: [],
                },
                undefined,
                filter,
            );
            const [failed_step, state] = check_of_request_attribute_profiles(ctx, search, rule);
            expect(failed_step).toBe(6);
            expect(state.searchValuesRequired).toEqual([]);
            expect(state.invalidSearchValues).toEqual([]);
            expect(state.missingSearchContexts).toEqual([]);
            expect(state.contextComboViolations).toEqual([]);
            expect(state.searchContextViolations).toEqual([]);
            expect(state.searchContextValueViolations).toHaveLength(1);
        }

        { // This should succeed because we are using a permitted context value.
            const filter: Filter = {
                item: {
                    equality: new AttributeValueAssertion(
                        commonName["&id"],
                        SELECTED_VALUE,
                        {
                            selectedContexts: [
                                new ContextAssertion(
                                    languageContext["&id"],
                                    [languageContext.encoderFor["&Type"]!("en", BER)],
                                ),
                            ],
                        }
                    ),
                },
            };
            const search = new SearchArgumentData(
                {
                    rdnSequence: [],
                },
                undefined,
                filter,
            );
            const [failed_step, state] = check_of_request_attribute_profiles(ctx, search, rule);
            expect(failed_step).toBe(0);
            expect(state.searchValuesRequired).toEqual([]);
            expect(state.invalidSearchValues).toEqual([]);
            expect(state.missingSearchContexts).toEqual([]);
            expect(state.contextComboViolations).toEqual([]);
            expect(state.searchContextViolations).toEqual([]);
            expect(state.searchContextValueViolations).toEqual([]);
        }
    });

    it("should restrict context combinations used in filters", () => {
        const SELECTED_VALUE = commonName.encoderFor["&Type"]!({ uTF8String: "James Smith" }, BER);
        const ctx: Context = getMockCtx();
        const rule = new SearchRule(
            1,
            rule_oid,
            undefined,
            undefined,
            [
                new RequestAttribute(
                    commonName["&id"],
                    true,
                    undefined,
                    undefined,
                    [
                        new ContextProfile(
                            languageContext["&id"],
                            undefined,
                        ),
                        new ContextProfile(
                            localeContext["&id"],
                            undefined,
                        ),
                    ],
                    /* Note that, if you change this context combination, you
                    could accidentally make a context type required, which
                    would make the error returned different. */
                    { // Require only one or the other.
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
                                        not: {
                                            context: languageContext["&id"],
                                        },
                                    },
                                    {
                                        context: localeContext["&id"],
                                    },
                                ],
                            },
                        ],
                    },
                    undefined,
                ),
            ],
        );

        { // This should fail because we are using both context types.
            const filter: Filter = {
                item: {
                    equality: new AttributeValueAssertion(
                        commonName["&id"],
                        SELECTED_VALUE,
                        {
                            selectedContexts: [
                                new ContextAssertion(
                                    languageContext["&id"],
                                    [languageContext.encoderFor["&Type"]!("fr", BER)],
                                ),
                                new ContextAssertion(
                                    localeContext["&id"],
                                    [localeContext.encoderFor["&Type"]!({ localeID2: { printableString: "en" } }, BER)],
                                ),
                            ],
                        }
                    ),
                },
            };
            const search = new SearchArgumentData(
                {
                    rdnSequence: [],
                },
                undefined,
                filter,
            );
            const [failed_step, state] = check_of_request_attribute_profiles(ctx, search, rule);
            expect(failed_step).toBe(4);
            expect(state.searchValuesRequired).toEqual([]);
            expect(state.invalidSearchValues).toEqual([]);
            expect(state.missingSearchContexts).toEqual([]);
            expect(state.contextComboViolations).toHaveLength(1);
            expect(state.searchContextViolations).toEqual([]);
            expect(state.searchContextValueViolations).toEqual([]);
        }

        { // This should succeed because we are using a permitted context combination.
            const filter: Filter = {
                item: {
                    equality: new AttributeValueAssertion(
                        commonName["&id"],
                        SELECTED_VALUE,
                        {
                            selectedContexts: [
                                new ContextAssertion(
                                    languageContext["&id"],
                                    [languageContext.encoderFor["&Type"]!("en", BER)],
                                ),
                            ],
                        }
                    ),
                },
            };
            const search = new SearchArgumentData(
                {
                    rdnSequence: [],
                },
                undefined,
                filter,
            );
            const [failed_step, state] = check_of_request_attribute_profiles(ctx, search, rule);
            expect(failed_step).toBe(0);
            expect(state.searchValuesRequired).toEqual([]);
            expect(state.invalidSearchValues).toEqual([]);
            expect(state.missingSearchContexts).toEqual([]);
            expect(state.contextComboViolations).toEqual([]);
            expect(state.searchContextViolations).toEqual([]);
            expect(state.searchContextValueViolations).toEqual([]);
        }
    });
});

// TODO: Fulfill this requirement from X.501
// If this component is present, but empty, it indicates that this component takes all possible values, i.e., a
// filter item for this attribute type always evaluates to TRUE (or to FALSE if negated) if the attribute type
// is absent in an entry.
