import { SearchRule } from "@wildboar/x500/ServiceAdministration";
import { TRUE_BIT, BIT_STRING, ObjectIdentifier, FALSE_BIT } from "@wildboar/asn1";
import {
    HierarchySelections_children,
    SearchControlOptions_checkOverspecified, // 2
    SearchControlOptions_dnAttribute, // 6
    ServiceControlOptions_allowWriteableCopy, // 14
    ServiceControlOptions_manageDSAIT, // 8
} from "@wildboar/x500/DirectoryAbstractService";
import { ControlOptions } from "@wildboar/x500/ServiceAdministration";
import { getEffectiveControlsFromSearchRule } from "./getEffectiveControlsFromSearchRule.js";

const rule_oid = ObjectIdentifier.fromString("1.2.3.4");

const BITS_WE_USE = 16;

function int_to_bits(int: number): BIT_STRING {
    const ret = new Uint8ClampedArray(BITS_WE_USE);
    for (let i = 0; i < BITS_WE_USE; i++) {
        ret[i] = (int & (1 << i)) ? TRUE_BIT : FALSE_BIT;
    }
    return ret;
}


describe("getEffectiveControlsFromSearchRule", () => {
    it("should set effective controls using the searchRuleControls values", () => {
        const hs = new Uint8ClampedArray(HierarchySelections_children + 1);
        hs[HierarchySelections_children] = TRUE_BIT;
        const search_co = new Uint8ClampedArray(SearchControlOptions_dnAttribute + 1);
        search_co[SearchControlOptions_dnAttribute] = TRUE_BIT;
        const service_co = new Uint8ClampedArray(ServiceControlOptions_allowWriteableCopy + 1);
        service_co[ServiceControlOptions_allowWriteableCopy] = TRUE_BIT;
        const default_controls = new ControlOptions(
            service_co, // service_co
            search_co, // search_co
            hs,
        );
        const search_rule_controls = new ControlOptions(
            service_co, // service_co,
            search_co, // search_co,
            hs,
        );
        const rule = new SearchRule(
            1,
            rule_oid,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            default_controls, // default_controls
            undefined, // mandatory_controls
            search_rule_controls, // search_rule_controls
        );

        const user_search_co = new Uint8ClampedArray(SearchControlOptions_checkOverspecified + 1);
        user_search_co[SearchControlOptions_checkOverspecified] = TRUE_BIT;
        const user_service_co = new Uint8ClampedArray(ServiceControlOptions_manageDSAIT + 1);
        user_service_co[ServiceControlOptions_manageDSAIT] = TRUE_BIT;

        const result1 = getEffectiveControlsFromSearchRule(
            rule,
            new Uint8ClampedArray(0),
            user_search_co,
            user_service_co,
        );
        expect(result1).toEqual({
            hs: int_to_bits(2),
            search: int_to_bits((1 << SearchControlOptions_dnAttribute)
                | (1 << SearchControlOptions_checkOverspecified)),
            service: int_to_bits((1 << ServiceControlOptions_manageDSAIT)
                | (1 << ServiceControlOptions_allowWriteableCopy)),
        });
    });
});
