import { SearchRule } from "@wildboar/x500/ServiceAdministration";
import { SearchArgumentData, ServiceControls } from "@wildboar/x500/DirectoryAbstractService";
import { TRUE_BIT, BIT_STRING, ObjectIdentifier, FALSE_BIT } from "@wildboar/asn1";
import {
    HierarchySelections_children,
    HierarchySelections_top,
    SearchControlOptions_checkOverspecified, // 2
    SearchControlOptions_dnAttribute, // 6
    ServiceControlOptions_allowWriteableCopy, // 14
    ServiceControlOptions_manageDSAIT, // 8
} from "@wildboar/x500/DirectoryAbstractService";
import { ControlOptions } from "@wildboar/x500/ServiceAdministration";
import { check_of_controls_and_hierarchy_selections } from "./check_of_controls_and_hierarchy_selections.js";

const rule_oid = ObjectIdentifier.fromString("1.2.3.4");

const BITS_WE_USE = 16;

function int_to_bits(int: number): BIT_STRING {
    const ret = new Uint8ClampedArray(BITS_WE_USE);
    for (let i = 0; i < BITS_WE_USE; i++) {
        ret[i] = (int & (1 << i)) ? TRUE_BIT : FALSE_BIT;
    }
    return ret;
}

function createSearchArg(
    hs: BIT_STRING,
    search_co: BIT_STRING,
    service_co: BIT_STRING,
): SearchArgumentData {
    return new SearchArgumentData(
        {
            rdnSequence: [],
        },
        undefined,
        undefined,
        undefined, // TODO: Test the BOOLEANs that later become control bits?
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        hs,
        search_co,
        undefined,
        undefined,
        undefined,
        new ServiceControls(
            service_co,
        ),
    );
}

describe("check_of_controls_and_hierarchy_selections", () => {
    it("should validate hierarchy selections with no defaults", () => {
        const hs = new Uint8ClampedArray(HierarchySelections_children + 1);
        hs[HierarchySelections_children] = TRUE_BIT;
        const search_co = new Uint8ClampedArray([]);
        const service_co = new Uint8ClampedArray([]);

        // ...except these defaults. For some reason, you have to have
        // defaults defined to use hierarchy selections, per the procedures.
        const default_controls = new ControlOptions(
            undefined, // search_co
            undefined, // service_co
            hs,
        );
        const mandatory_controls = new ControlOptions(
            undefined, // search_co,
            undefined, // service_co,
            hs,
        );
        // const search_rule_controls = new ControlOptions(
        //     undefined, // search_co,
        //     undefined, // service_co,
        //     hs,
        // );
        const rule = new SearchRule(
            1,
            rule_oid,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            default_controls, // default_controls,
            mandatory_controls,
            undefined, // search_rule_controls,
        );

        const hs1 = new Uint8ClampedArray(HierarchySelections_children + 1);
        // hs2[HierarchySelections_children] = TRUE_BIT;
        const hs2 = new Uint8ClampedArray(HierarchySelections_children + 1);
        hs2[HierarchySelections_children] = TRUE_BIT;

        const search1 = createSearchArg(hs1, search_co, service_co);
        const result1 = check_of_controls_and_hierarchy_selections(search1, rule);
        expect(result1).toEqual({
            step_failed: 2,
            hierarchySelectList: int_to_bits(2), // Second bit is children.
        });

        const search2 = createSearchArg(hs2, search_co, service_co);
        const result2 = check_of_controls_and_hierarchy_selections(search2, rule);
        expect(result2).toEqual({
            hierarchySelectList: int_to_bits(2),
            searchControlOptionsList: int_to_bits(1),
            serviceControlOptionsList: int_to_bits(0),
        });
    });

    it("should validate hierarchy selections with defaults", () => {
        const hs = new Uint8ClampedArray(HierarchySelections_children + 1);
        hs[HierarchySelections_children] = TRUE_BIT;
        const search_co = new Uint8ClampedArray([]);
        const service_co = new Uint8ClampedArray([]);

        // ...except these defaults. For some reason, you have to have
        // defaults defined to use hierarchy selections, per the procedures.
        const default_controls = new ControlOptions(
            undefined, // search_co
            undefined, // service_co
            hs,
        );
        const mandatory_controls = new ControlOptions(
            undefined, // search_co,
            undefined, // service_co,
            hs,
        );
        // const search_rule_controls = new ControlOptions(
        //     undefined, // search_co,
        //     undefined, // service_co,
        //     hs,
        // );
        const rule = new SearchRule(
            1,
            rule_oid,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            default_controls, // default_controls,
            mandatory_controls,
            undefined, // search_rule_controls,
        );

        // This should pass because the default bits are appended to the user
        // bits, and those default bits satisfy the mandatory bits.       
        const hs1 = new Uint8ClampedArray(0);
        const search1 = createSearchArg(hs1, search_co, service_co);
        const result1 = check_of_controls_and_hierarchy_selections(search1, rule);
        expect(result1).toEqual({
            hierarchySelectList: int_to_bits(2),
            searchControlOptionsList: int_to_bits(1),
            serviceControlOptionsList: int_to_bits(0),
        });

        // This should also succeed, because the user bits include the mandatory bit.
        const hs2 = new Uint8ClampedArray(HierarchySelections_top + 1);
        hs2[HierarchySelections_top] = TRUE_BIT;
        hs2[HierarchySelections_children] = TRUE_BIT;
        const search2 = createSearchArg(hs2, search_co, service_co);
        const result2 = check_of_controls_and_hierarchy_selections(search2, rule);
        expect(result2).toEqual({
            hierarchySelectList: int_to_bits(2 | (1 << HierarchySelections_top)),
            searchControlOptionsList: int_to_bits(1),
            serviceControlOptionsList: int_to_bits(0),
        });

        // This should fail because the user bits do not include the mandatory bit.
        const hs3 = new Uint8ClampedArray(HierarchySelections_top + 1);
        hs3[HierarchySelections_top] = TRUE_BIT;
        // hs3[HierarchySelections_children] = TRUE_BIT; (Specifically NOT set for this sub-test.)
        const search3 = createSearchArg(hs3, search_co, service_co);
        const result3 = check_of_controls_and_hierarchy_selections(search3, rule);
        expect(result3).toEqual({
            step_failed: 2,
            hierarchySelectList: int_to_bits(2), // Second bit is children.
        });
    });

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

        const search1 = createSearchArg(new Uint8ClampedArray(0), user_search_co, user_service_co);
        const result1 = check_of_controls_and_hierarchy_selections(search1, rule);
        expect(result1).toEqual({
            hierarchySelectList: int_to_bits(2),
            searchControlOptionsList: int_to_bits((1 << SearchControlOptions_dnAttribute)
                | (1 << SearchControlOptions_checkOverspecified)),
            serviceControlOptionsList: int_to_bits((1 << ServiceControlOptions_manageDSAIT)
                | (1 << ServiceControlOptions_allowWriteableCopy)),
        });
    });

});
