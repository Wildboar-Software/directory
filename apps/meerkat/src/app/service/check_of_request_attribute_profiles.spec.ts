import type { Context, IndexableOID } from "../types/index.js";
import { SearchRule } from "@wildboar/x500/ServiceAdministration";
import { SearchArgumentData } from "@wildboar/x500/DirectoryAbstractService";
import { RequestAttribute } from "@wildboar/x500/ServiceAdministration";
import { ObjectIdentifier } from "@wildboar/asn1";
import { commonName } from "@wildboar/x500/SelectedAttributeTypes";
import type { Filter } from "@wildboar/x500/DirectoryAbstractService";
import { AttributeValueAssertion } from "@wildboar/x500/InformationFramework";
import { check_of_request_attribute_profiles } from "./check_of_request_attribute_profiles.js";
import { BER } from "@wildboar/asn1/functional";
import { getMockCtx } from "../testing.spec.js";

const rule_oid = ObjectIdentifier.fromString("1.2.3.4");

describe("check_of_request_attribute_profiles", () => {
    it("should not find any violations in the simplest compliant case", () => {
        const ctx: Context = getMockCtx();
        const violations: Set<IndexableOID> = new Set();
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
});