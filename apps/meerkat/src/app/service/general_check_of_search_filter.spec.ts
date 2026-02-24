import { Context, IndexableOID } from "../types/index.js";
import {
    ResultAttribute,
    SearchRule,
} from "@wildboar/x500/ServiceAdministration";
import {
    RequestAttribute,
} from "@wildboar/x500/ServiceAdministration";
import { SearchArgumentData, TypeAndContextAssertion } from "@wildboar/x500/DirectoryAbstractService";
import { ObjectIdentifier, TRUE_BIT } from "@wildboar/asn1";
import { ContextProfile } from "@wildboar/x500/ServiceAdministration";
import getAttributeParentTypes from "../x500/getAttributeParentTypes.js";
import { getAttributeTypeNegationFromFilter } from "./getAttributeTypeNegationFromFilter.js";
import { getRequiredAttributesFromAttributeCombination } from "./getRequiredAttributesFromAttributeCombination.js";
import { checkAttributeCombination } from "./checkAttributeCombination.js";
import { check_for_disallowed_search_values } from "./check_for_disallowed_search_values.js";
import { check_for_disallowed_contexts } from "./check_for_disallowed_contexts.js";
import type { AttributeCombination } from "@wildboar/x500/ServiceAdministration";
import { FilterItem } from "@wildboar/x500/DirectoryAbstractService";
import { type AttributeType, AttributeValueAssertion, ContextAssertion } from "@wildboar/x500/InformationFramework";
import { general_check_of_search_filter } from "./general_check_of_search_filter.js";
import { getMockCtx } from "../testing.spec.js";
import { commonName, languageContext, streetAddress } from "@wildboar/x500/SelectedAttributeTypes";
import { BER } from "@wildboar/asn1/functional";

const rule_oid = ObjectIdentifier.fromString("1.2.3.4");

describe("general_check_of_search_filter", () => {
    it("should return 0 for an empty search if the search rule is empty", () => {
        const ctx = getMockCtx();
        const search = new SearchArgumentData(
            {
                rdnSequence: [],
            },
        );
        const rule = new SearchRule(
            1,
            rule_oid,
        );
        const [failed_step] = general_check_of_search_filter(ctx, search, rule);
        expect(failed_step).toBe(0);
    });

    it("should return non-zero for an empty search if the search rule requires an attribute", () => {
        const ctx = getMockCtx();
        const search = new SearchArgumentData(
            {
                rdnSequence: [],
            },
            undefined,
            // A filter using an attribute type not whitelisted.
            {
                item: {
                    equality: new AttributeValueAssertion(
                        streetAddress["&id"],
                        streetAddress.encoderFor["&Type"]!({ uTF8String: "123 Main St" }, BER),
                    ),
                },
            }
        );
        const rule = new SearchRule(
            1,
            rule_oid,
            undefined,
            undefined,
            [ // Only commonName is whitelisted.
                new RequestAttribute( // TODO: Make request attributes having trailing default values.
                    commonName["&id"],
                    true,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            ],
        );
        const [failed_step] = general_check_of_search_filter(ctx, search, rule);
        expect(failed_step).not.toBe(0);
    });

    it("evaluates attribute combinations correctly", () => {
        const ctx = getMockCtx();
        const search = new SearchArgumentData(
            {
                rdnSequence: [],
            },
            undefined,
            {
                item: {
                    equality: new AttributeValueAssertion(
                        streetAddress["&id"],
                        streetAddress.encoderFor["&Type"]!({ uTF8String: "123 Main St" }, BER),
                    ),
                },
            }
        );

        const getRule = (attr_combo: AttributeCombination): SearchRule => new SearchRule(
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
                    undefined,
                    undefined,
                    undefined,
                ),
                new RequestAttribute(
                    streetAddress["&id"],
                    true,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            ],
            attr_combo,
        );
        const rule1 = getRule({
            and: [ // Both attributes are required.
                {
                    attribute: commonName["&id"],
                },
                {
                    attribute: streetAddress["&id"],
                },
            ],
        });
        const [failed_step1] = general_check_of_search_filter(ctx, search, rule1);
        expect(failed_step1).not.toBe(0);

        // Either commonName must be present and streetAddress must not, or vice versa.
        // Since streetAddress is used alone, this should match.
        const rule2 = getRule({
            or: [
                {
                    and: [
                        {
                            attribute: commonName["&id"],
                        },
                        {
                            not: {
                                attribute: streetAddress["&id"],
                            },
                        }
                    ],
                },
                {
                    and: [
                        {
                            attribute: streetAddress["&id"],
                        },
                        {
                            not: {
                                attribute: commonName["&id"],
                            },
                        }
                    ],
                },
            ],
        });
        const [failed_step2] = general_check_of_search_filter(ctx, search, rule2);
        expect(failed_step2).toBe(0);
    });

    // TODO: "If a matched entry or compound entry does not contain any of the attributes defined in this component, it is not included in the result."
    it("is not impacted by outputAttributeTypes", () => {
        const ctx = getMockCtx();
        const search = new SearchArgumentData(
            {
                rdnSequence: [],
            },
            undefined,
            {
                item: {
                    equality: new AttributeValueAssertion(
                        streetAddress["&id"],
                        streetAddress.encoderFor["&Type"]!({ uTF8String: "123 Main St" }, BER),
                    ),
                },
            }
        );

        const rule1 = new SearchRule(
            1,
            rule_oid,
            undefined,
            undefined,
            undefined,
            undefined,
            [
                new ResultAttribute(
                    streetAddress["&id"],
                ),
            ],
        );
        const [failed_step1] = general_check_of_search_filter(ctx, search, rule1);
        expect(failed_step1).toBe(0);
    });

    // TODO: filter contexts
    // TODO: allowedSubset
    // TODO: "If an empty set of attribute values is given, this attribute type can only be effectively present in..."

    // This is skipped (forever) because this procedure does not check for
    // selected values. There is a separate procedure that does this.
    it.skip("restricts what individual attribute values may be used", () => {
        const ctx = getMockCtx();
        const search = new SearchArgumentData(
            {
                rdnSequence: [],
            },
            undefined,
            {
                item: {
                    equality: new AttributeValueAssertion(
                        commonName["&id"],
                        commonName.encoderFor["&Type"]!({ uTF8String: "Santa Claus" }, BER),
                    ),
                },
            }
        );

        const rule1 = new SearchRule(
            1,
            rule_oid,
            undefined,
            undefined,
            [
                new RequestAttribute(
                    commonName["&id"],
                    true,
                    [
                        commonName.encoderFor["&Type"]!({ uTF8String: "Saint Nicholas" }, BER),
                    ],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            ],
            undefined,
            undefined,

        );
        const [failed_step1] = general_check_of_search_filter(ctx, search, rule1);
        expect(failed_step1).toBe(4);
    });

    it("restricts what context types may be used in a search filter", () => {
        const ctx = getMockCtx();
        const search = new SearchArgumentData(
            {
                rdnSequence: [],
            },
            undefined,
            {
                item: {
                    equality: new AttributeValueAssertion(
                        commonName["&id"],
                        commonName.encoderFor["&Type"]!({ uTF8String: "Santa Claus" }, BER),
                        {
                            selectedContexts: [
                                new ContextAssertion(
                                    languageContext["&id"],
                                    [languageContext.encoderFor["&Type"]!("en", BER)],
                                ),
                            ],
                        },
                    ),
                },
            }
        );

        const rule1 = new SearchRule(
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
                    [],
                    undefined,
                    undefined,
                ),
            ],
            undefined,
            undefined,

        );
        // This rule forbids any contexts at all.
        const [failed_step1] = general_check_of_search_filter(ctx, search, rule1);
        expect(failed_step1).toBe(5);

        const rule2 = new SearchRule(
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
            undefined,
            undefined,

        );
        // This rule allows the language context, so it should pass.
        const [failed_step2] = general_check_of_search_filter(ctx, search, rule2);
        expect(failed_step2).toBe(0);
    });
});
