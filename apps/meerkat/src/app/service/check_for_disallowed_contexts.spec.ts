import type { Context, IndexableOID } from "../types/index.js";
import type { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import type { Filter } from "@wildboar/x500/DirectoryAbstractService";
import { ContextProfile } from "@wildboar/x500/ServiceAdministration";
import { ContextAssertion } from "@wildboar/x500/InformationFramework";
import { BER } from "@wildboar/asn1/functional";
import { commonName, languageContext } from "@wildboar/x500/SelectedAttributeTypes";
import { AttributeValueAssertion } from "@wildboar/x500/InformationFramework";
import { check_for_disallowed_contexts } from "./check_for_disallowed_contexts.js";
import { getMockCtx } from "../testing.spec.js";

describe("check_for_disallowed_contexts", () => {
    it("should not find any violations in the simplest compliant case", () => {
        const ctx: Context = getMockCtx();
        const violations: Set<IndexableOID> = new Set();
        const filter: Filter = {
            item: {
                equality: new AttributeValueAssertion(
                    commonName["&id"],
                    commonName.encoderFor["&Type"]!({ uTF8String: "John Doe" }, BER),
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
        const profiles: Map<IndexableOID, Map<IndexableOID, ContextProfile>> = new Map();
        profiles.set(commonName["&id"].toString(), new Map([
            [languageContext["&id"].toString(), new ContextProfile(
                languageContext["&id"],
                [languageContext.encoderFor["&Type"]!("en", BER)],
            )],
        ]));
        check_for_disallowed_contexts(ctx, filter, profiles, violations);
        expect(violations.size).toBe(0);
    });

    it("should find violations in the simplest non-compliant case", () => {
        const ctx: Context = getMockCtx();
        const violations: Set<IndexableOID> = new Set();
        const filter: Filter = {
            item: {
                equality: new AttributeValueAssertion(
                    commonName["&id"],
                    commonName.encoderFor["&Type"]!({ uTF8String: "John Doe" }, BER),
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
        const profiles: Map<IndexableOID, Map<IndexableOID, ContextProfile>> = new Map();
        profiles.set(commonName["&id"].toString(), new Map()); // No contexts allowed.
        check_for_disallowed_contexts(ctx, filter, profiles, violations);
        expect(violations.size).toBe(1);
    });
});
