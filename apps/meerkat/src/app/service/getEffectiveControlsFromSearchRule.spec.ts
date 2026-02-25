import { FALSE_BIT, TRUE_BIT, ObjectIdentifier } from "@wildboar/asn1";
import { SearchRule, } from "@wildboar/x500/ServiceAdministration";
import {
    HierarchySelections,
    SearchControlOptions,
    ServiceControlOptions,
} from "@wildboar/x500/DirectoryAbstractService";
import { getEffectiveControlsFromSearchRule } from "./getEffectiveControlsFromSearchRule.js";

const rule_oid = ObjectIdentifier.fromString("1.2.3.4");

describe("getEffectiveControlsFromSearchRule", () => {
    // FIXME:
    it.skip("should return the effective controls from the search rule", () => {
        const rule = new SearchRule(
            1,
            rule_oid,
        );
        const effectiveControls = getEffectiveControlsFromSearchRule(rule);
        expect(effectiveControls).toEqual({
            hs: new Uint8ClampedArray([ TRUE_BIT ]),
            search: new Uint8ClampedArray([ TRUE_BIT ]),
            service: new Uint8ClampedArray([ TRUE_BIT ]),
        });
    });
});
