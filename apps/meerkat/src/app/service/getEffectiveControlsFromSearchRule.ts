import { FALSE_BIT, TRUE, TRUE_BIT } from "asn1-ts";
import type {
    SearchRule,
} from "@wildboar/x500/src/lib/modules/ServiceAdministration/SearchRule.ta";
import {
    HierarchySelections,
    HierarchySelections_all,
    HierarchySelections_children,
    HierarchySelections_hierarchy,
    HierarchySelections_parent,
    HierarchySelections_self,
    HierarchySelections_siblingChildren,
    HierarchySelections_siblingSubtree,
    HierarchySelections_siblings,
    HierarchySelections_subtree,
    HierarchySelections_top,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/HierarchySelections.ta";
import {
    SearchControlOptions,
    SearchControlOptions_checkOverspecified,
    SearchControlOptions_dnAttribute,
    SearchControlOptions_entryCount,
    SearchControlOptions_includeAllAreas,
    SearchControlOptions_matchOnResidualName,
    SearchControlOptions_matchedValuesOnly,
    SearchControlOptions_noSystemRelaxation,
    SearchControlOptions_performExactly,
    SearchControlOptions_searchAliases,
    SearchControlOptions_searchFamily,
    SearchControlOptions_separateFamilyMembers,
    SearchControlOptions_useSubset,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchControlOptions.ta";
import {
    ServiceControlOptions,
    ServiceControlOptions_allowWriteableCopy,
    ServiceControlOptions_chainingProhibited,
    ServiceControlOptions_copyShallDo,
    ServiceControlOptions_countFamily,
    ServiceControlOptions_dontDereferenceAliases,
    ServiceControlOptions_dontMatchFriends,
    ServiceControlOptions_dontSelectFriends,
    ServiceControlOptions_dontUseCopy,
    ServiceControlOptions_localScope,
    ServiceControlOptions_manageDSAIT,
    ServiceControlOptions_noSubtypeMatch,
    ServiceControlOptions_noSubtypeSelection,
    ServiceControlOptions_partialNameResolution,
    ServiceControlOptions_preferChaining,
    ServiceControlOptions_subentries,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";

export
interface EffectiveControls {
    service: ServiceControlOptions;
    search: SearchControlOptions;
    hs: HierarchySelections;
}

export
function getEffectiveControlsFromSearchRule (
    rule: SearchRule,
    user_hs?: HierarchySelections,
    user_search_opts?: SearchControlOptions,
    user_service_opts?: ServiceControlOptions,
    is_search: boolean = true,
): EffectiveControls {
    const default_hs = rule.defaultControls?.hierarchyOptions;
    const effective_hs: HierarchySelections = new Uint8ClampedArray(10);
    effective_hs[HierarchySelections_all] = user_hs?.[HierarchySelections_all] ?? default_hs?.[HierarchySelections_all] ?? FALSE_BIT;
    effective_hs[HierarchySelections_children] = user_hs?.[HierarchySelections_children] ?? default_hs?.[HierarchySelections_children] ?? FALSE_BIT;
    effective_hs[HierarchySelections_hierarchy] = user_hs?.[HierarchySelections_hierarchy] ?? default_hs?.[HierarchySelections_hierarchy] ?? FALSE_BIT;
    effective_hs[HierarchySelections_parent] = user_hs?.[HierarchySelections_parent] ?? default_hs?.[HierarchySelections_parent] ?? FALSE_BIT;
    effective_hs[HierarchySelections_self] = user_hs?.[HierarchySelections_self] ?? default_hs?.[HierarchySelections_self] ?? TRUE_BIT; // TODO: Review me and possibly fix SRC (I)
    effective_hs[HierarchySelections_siblingChildren] = user_hs?.[HierarchySelections_siblingChildren] ?? default_hs?.[HierarchySelections_siblingChildren] ?? FALSE_BIT;
    effective_hs[HierarchySelections_siblingSubtree] = user_hs?.[HierarchySelections_siblingSubtree] ?? default_hs?.[HierarchySelections_siblingSubtree] ?? FALSE_BIT;
    effective_hs[HierarchySelections_siblings] = user_hs?.[HierarchySelections_siblings] ?? default_hs?.[HierarchySelections_siblings] ?? FALSE_BIT;
    effective_hs[HierarchySelections_subtree] = user_hs?.[HierarchySelections_subtree] ?? default_hs?.[HierarchySelections_subtree] ?? FALSE_BIT;
    effective_hs[HierarchySelections_top] = user_hs?.[HierarchySelections_top] ?? default_hs?.[HierarchySelections_top] ?? FALSE_BIT;

    const default_search_opts = rule.defaultControls?.searchOptions;
    const effective_search_opts: SearchControlOptions = new Uint8ClampedArray(12);
    effective_search_opts[SearchControlOptions_checkOverspecified] = user_search_opts?.[SearchControlOptions_checkOverspecified] ?? default_search_opts?.[SearchControlOptions_checkOverspecified] ?? FALSE_BIT;
    effective_search_opts[SearchControlOptions_dnAttribute] = user_search_opts?.[SearchControlOptions_dnAttribute] ?? default_search_opts?.[SearchControlOptions_dnAttribute] ?? FALSE_BIT;
    effective_search_opts[SearchControlOptions_entryCount] = user_search_opts?.[SearchControlOptions_entryCount] ?? default_search_opts?.[SearchControlOptions_entryCount] ?? FALSE_BIT;
    effective_search_opts[SearchControlOptions_includeAllAreas] = user_search_opts?.[SearchControlOptions_includeAllAreas] ?? default_search_opts?.[SearchControlOptions_includeAllAreas] ?? FALSE_BIT;
    effective_search_opts[SearchControlOptions_matchOnResidualName] = user_search_opts?.[SearchControlOptions_matchOnResidualName] ?? default_search_opts?.[SearchControlOptions_matchOnResidualName] ?? FALSE_BIT;
    effective_search_opts[SearchControlOptions_matchedValuesOnly] = user_search_opts?.[SearchControlOptions_matchedValuesOnly] ?? default_search_opts?.[SearchControlOptions_matchedValuesOnly] ?? FALSE_BIT;
    effective_search_opts[SearchControlOptions_noSystemRelaxation] = user_search_opts?.[SearchControlOptions_noSystemRelaxation] ?? default_search_opts?.[SearchControlOptions_noSystemRelaxation] ?? FALSE_BIT;
    effective_search_opts[SearchControlOptions_performExactly] = user_search_opts?.[SearchControlOptions_performExactly] ?? default_search_opts?.[SearchControlOptions_performExactly] ?? FALSE_BIT;
    effective_search_opts[SearchControlOptions_searchAliases] = user_search_opts?.[SearchControlOptions_searchAliases] ?? default_search_opts?.[SearchControlOptions_searchAliases] ?? TRUE_BIT;
    effective_search_opts[SearchControlOptions_searchFamily] = user_search_opts?.[SearchControlOptions_searchFamily] ?? default_search_opts?.[SearchControlOptions_searchFamily] ?? FALSE_BIT;
    effective_search_opts[SearchControlOptions_separateFamilyMembers] = user_search_opts?.[SearchControlOptions_separateFamilyMembers] ?? default_search_opts?.[SearchControlOptions_separateFamilyMembers] ?? FALSE_BIT;
    effective_search_opts[SearchControlOptions_useSubset] = user_search_opts?.[SearchControlOptions_useSubset] ?? default_search_opts?.[SearchControlOptions_useSubset] ?? FALSE_BIT;

    const default_service_opts = rule.defaultControls?.serviceControls;
    const effective_service_opts: ServiceControlOptions = new Uint8ClampedArray(15);
    effective_service_opts[ServiceControlOptions_allowWriteableCopy] = user_service_opts?.[ServiceControlOptions_allowWriteableCopy] ?? default_service_opts?.[ServiceControlOptions_allowWriteableCopy] ?? FALSE_BIT;
    effective_service_opts[ServiceControlOptions_chainingProhibited] = user_service_opts?.[ServiceControlOptions_chainingProhibited] ?? default_service_opts?.[ServiceControlOptions_chainingProhibited] ?? FALSE_BIT;
    effective_service_opts[ServiceControlOptions_copyShallDo] = user_service_opts?.[ServiceControlOptions_copyShallDo] ?? default_service_opts?.[ServiceControlOptions_copyShallDo] ?? FALSE_BIT;
    effective_service_opts[ServiceControlOptions_countFamily] = user_service_opts?.[ServiceControlOptions_countFamily] ?? default_service_opts?.[ServiceControlOptions_countFamily] ?? FALSE_BIT;
    effective_service_opts[ServiceControlOptions_dontDereferenceAliases] = user_service_opts?.[ServiceControlOptions_dontDereferenceAliases] ?? default_service_opts?.[ServiceControlOptions_dontDereferenceAliases] ?? FALSE_BIT;
    effective_service_opts[ServiceControlOptions_dontMatchFriends] = user_service_opts?.[ServiceControlOptions_dontMatchFriends] ?? default_service_opts?.[ServiceControlOptions_dontMatchFriends] ?? FALSE_BIT;
    effective_service_opts[ServiceControlOptions_dontSelectFriends] = user_service_opts?.[ServiceControlOptions_dontSelectFriends] ?? default_service_opts?.[ServiceControlOptions_dontSelectFriends] ?? FALSE_BIT;
    effective_service_opts[ServiceControlOptions_dontUseCopy] = user_service_opts?.[ServiceControlOptions_dontUseCopy] ?? default_service_opts?.[ServiceControlOptions_dontUseCopy] ?? FALSE_BIT;
    effective_service_opts[ServiceControlOptions_localScope] = user_service_opts?.[ServiceControlOptions_localScope] ?? default_service_opts?.[ServiceControlOptions_localScope] ?? FALSE_BIT;
    effective_service_opts[ServiceControlOptions_manageDSAIT] = user_service_opts?.[ServiceControlOptions_manageDSAIT] ?? default_service_opts?.[ServiceControlOptions_manageDSAIT] ?? FALSE_BIT;
    effective_service_opts[ServiceControlOptions_noSubtypeMatch] = user_service_opts?.[ServiceControlOptions_noSubtypeMatch] ?? default_service_opts?.[ServiceControlOptions_noSubtypeMatch] ?? FALSE_BIT;
    effective_service_opts[ServiceControlOptions_noSubtypeSelection] = user_service_opts?.[ServiceControlOptions_noSubtypeSelection] ?? default_service_opts?.[ServiceControlOptions_noSubtypeSelection] ?? FALSE_BIT;
    effective_service_opts[ServiceControlOptions_partialNameResolution] = user_service_opts?.[ServiceControlOptions_partialNameResolution] ?? default_service_opts?.[ServiceControlOptions_partialNameResolution] ?? FALSE_BIT;
    effective_service_opts[ServiceControlOptions_preferChaining] = user_service_opts?.[ServiceControlOptions_preferChaining] ?? default_service_opts?.[ServiceControlOptions_preferChaining] ?? FALSE_BIT;
    effective_service_opts[ServiceControlOptions_subentries] = user_service_opts?.[ServiceControlOptions_subentries] ?? default_service_opts?.[ServiceControlOptions_subentries] ?? FALSE_BIT;

    if (is_search && rule.searchRuleControls) {
        const sr_hs = rule.searchRuleControls.hierarchyOptions;
        effective_hs[HierarchySelections_all] = (sr_hs?.[HierarchySelections_all] === TRUE_BIT) ? (default_hs?.[HierarchySelections_all] ?? FALSE_BIT) : effective_hs[HierarchySelections_all];
        effective_hs[HierarchySelections_children] = (sr_hs?.[HierarchySelections_children] === TRUE_BIT) ? (default_hs?.[HierarchySelections_children] ?? FALSE_BIT) : effective_hs[HierarchySelections_children];
        effective_hs[HierarchySelections_hierarchy] = (sr_hs?.[HierarchySelections_hierarchy] === TRUE_BIT) ? (default_hs?.[HierarchySelections_hierarchy] ?? FALSE_BIT) : effective_hs[HierarchySelections_hierarchy];
        effective_hs[HierarchySelections_parent] = (sr_hs?.[HierarchySelections_parent] === TRUE_BIT) ? (default_hs?.[HierarchySelections_parent] ?? FALSE_BIT) : effective_hs[HierarchySelections_parent];
        effective_hs[HierarchySelections_self] = (sr_hs?.[HierarchySelections_self] === TRUE_BIT) ? (default_hs?.[HierarchySelections_self] ?? TRUE_BIT) : effective_hs[HierarchySelections_self];
        effective_hs[HierarchySelections_siblingChildren] = (sr_hs?.[HierarchySelections_siblingChildren] === TRUE_BIT) ? (default_hs?.[HierarchySelections_siblingChildren] ?? FALSE_BIT) : effective_hs[HierarchySelections_siblingChildren];
        effective_hs[HierarchySelections_siblingSubtree] = (sr_hs?.[HierarchySelections_siblingSubtree] === TRUE_BIT) ? (default_hs?.[HierarchySelections_siblingSubtree] ?? FALSE_BIT) : effective_hs[HierarchySelections_siblingSubtree];
        effective_hs[HierarchySelections_siblings] = (sr_hs?.[HierarchySelections_siblings] === TRUE_BIT) ? (default_hs?.[HierarchySelections_siblings] ?? FALSE_BIT) : effective_hs[HierarchySelections_siblings];
        effective_hs[HierarchySelections_subtree] = (sr_hs?.[HierarchySelections_subtree] === TRUE_BIT) ? (default_hs?.[HierarchySelections_subtree] ?? FALSE_BIT) : effective_hs[HierarchySelections_subtree];
        effective_hs[HierarchySelections_top] = (sr_hs?.[HierarchySelections_top] === TRUE_BIT) ? (default_hs?.[HierarchySelections_top] ?? FALSE_BIT) : effective_hs[HierarchySelections_top];

        const sr_src = rule.searchRuleControls.searchOptions;
        effective_search_opts[SearchControlOptions_checkOverspecified] = (sr_src?.[SearchControlOptions_checkOverspecified] === TRUE_BIT) ? (default_search_opts?.[SearchControlOptions_checkOverspecified] ?? FALSE_BIT) : effective_search_opts[SearchControlOptions_checkOverspecified];
        effective_search_opts[SearchControlOptions_dnAttribute] = (sr_src?.[SearchControlOptions_dnAttribute] === TRUE_BIT) ? (default_search_opts?.[SearchControlOptions_dnAttribute] ?? FALSE_BIT) : effective_search_opts[SearchControlOptions_dnAttribute];
        effective_search_opts[SearchControlOptions_entryCount] = (sr_src?.[SearchControlOptions_entryCount] === TRUE_BIT) ? (default_search_opts?.[SearchControlOptions_entryCount] ?? FALSE_BIT) : effective_search_opts[SearchControlOptions_entryCount];
        effective_search_opts[SearchControlOptions_includeAllAreas] = (sr_src?.[SearchControlOptions_includeAllAreas] === TRUE_BIT) ? (default_search_opts?.[SearchControlOptions_includeAllAreas] ?? FALSE_BIT) : effective_search_opts[SearchControlOptions_includeAllAreas];
        effective_search_opts[SearchControlOptions_matchOnResidualName] = (sr_src?.[SearchControlOptions_matchOnResidualName] === TRUE_BIT) ? (default_search_opts?.[SearchControlOptions_matchOnResidualName] ?? FALSE_BIT) : effective_search_opts[SearchControlOptions_matchOnResidualName];
        effective_search_opts[SearchControlOptions_matchedValuesOnly] = (sr_src?.[SearchControlOptions_matchedValuesOnly] === TRUE_BIT) ? (default_search_opts?.[SearchControlOptions_matchedValuesOnly] ?? FALSE_BIT) : effective_search_opts[SearchControlOptions_matchedValuesOnly];
        effective_search_opts[SearchControlOptions_noSystemRelaxation] = (sr_src?.[SearchControlOptions_noSystemRelaxation] === TRUE_BIT) ? (default_search_opts?.[SearchControlOptions_noSystemRelaxation] ?? FALSE_BIT) : effective_search_opts[SearchControlOptions_noSystemRelaxation];
        effective_search_opts[SearchControlOptions_performExactly] = (sr_src?.[SearchControlOptions_performExactly] === TRUE_BIT) ? (default_search_opts?.[SearchControlOptions_performExactly] ?? FALSE_BIT) : effective_search_opts[SearchControlOptions_performExactly];
        effective_search_opts[SearchControlOptions_searchAliases] = (sr_src?.[SearchControlOptions_searchAliases] === TRUE_BIT) ? (default_search_opts?.[SearchControlOptions_searchAliases] ?? TRUE_BIT) : effective_search_opts[SearchControlOptions_searchAliases];
        effective_search_opts[SearchControlOptions_searchFamily] = (sr_src?.[SearchControlOptions_searchFamily] === TRUE_BIT) ? (default_search_opts?.[SearchControlOptions_searchFamily] ?? FALSE_BIT) : effective_search_opts[SearchControlOptions_searchFamily];
        effective_search_opts[SearchControlOptions_separateFamilyMembers] = (sr_src?.[SearchControlOptions_separateFamilyMembers] === TRUE_BIT) ? (default_search_opts?.[SearchControlOptions_separateFamilyMembers] ?? FALSE_BIT) : effective_search_opts[SearchControlOptions_separateFamilyMembers];
        effective_search_opts[SearchControlOptions_useSubset] = (sr_src?.[SearchControlOptions_useSubset] === TRUE_BIT) ? (default_search_opts?.[SearchControlOptions_useSubset] ?? FALSE_BIT) : effective_search_opts[SearchControlOptions_useSubset];

        const sr_svc = rule.searchRuleControls.serviceControls;
        effective_service_opts[ServiceControlOptions_allowWriteableCopy] = (sr_svc?.[ServiceControlOptions_allowWriteableCopy] === TRUE_BIT) ? (default_service_opts?.[ServiceControlOptions_allowWriteableCopy] ?? FALSE_BIT) : effective_service_opts[ServiceControlOptions_allowWriteableCopy];
        effective_service_opts[ServiceControlOptions_chainingProhibited] = (sr_svc?.[ServiceControlOptions_chainingProhibited] === TRUE_BIT) ? (default_service_opts?.[ServiceControlOptions_chainingProhibited] ?? FALSE_BIT) : effective_service_opts[ServiceControlOptions_chainingProhibited];
        effective_service_opts[ServiceControlOptions_copyShallDo] = (sr_svc?.[ServiceControlOptions_copyShallDo] === TRUE_BIT) ? (default_service_opts?.[ServiceControlOptions_copyShallDo] ?? FALSE_BIT) : effective_service_opts[ServiceControlOptions_copyShallDo];
        effective_service_opts[ServiceControlOptions_countFamily] = (sr_svc?.[ServiceControlOptions_countFamily] === TRUE_BIT) ? (default_service_opts?.[ServiceControlOptions_countFamily] ?? FALSE_BIT) : effective_service_opts[ServiceControlOptions_countFamily];
        effective_service_opts[ServiceControlOptions_dontDereferenceAliases] = (sr_svc?.[ServiceControlOptions_dontDereferenceAliases] === TRUE_BIT) ? (default_service_opts?.[ServiceControlOptions_dontDereferenceAliases] ?? FALSE_BIT) : effective_service_opts[ServiceControlOptions_dontDereferenceAliases];
        effective_service_opts[ServiceControlOptions_dontMatchFriends] = (sr_svc?.[ServiceControlOptions_dontMatchFriends] === TRUE_BIT) ? (default_service_opts?.[ServiceControlOptions_dontMatchFriends] ?? FALSE_BIT) : effective_service_opts[ServiceControlOptions_dontMatchFriends];
        effective_service_opts[ServiceControlOptions_dontSelectFriends] = (sr_svc?.[ServiceControlOptions_dontSelectFriends] === TRUE_BIT) ? (default_service_opts?.[ServiceControlOptions_dontSelectFriends] ?? FALSE_BIT) : effective_service_opts[ServiceControlOptions_dontSelectFriends];
        effective_service_opts[ServiceControlOptions_dontUseCopy] = (sr_svc?.[ServiceControlOptions_dontUseCopy] === TRUE_BIT) ? (default_service_opts?.[ServiceControlOptions_dontUseCopy] ?? FALSE_BIT) : effective_service_opts[ServiceControlOptions_dontUseCopy];
        effective_service_opts[ServiceControlOptions_localScope] = (sr_svc?.[ServiceControlOptions_localScope] === TRUE_BIT) ? (default_service_opts?.[ServiceControlOptions_localScope] ?? FALSE_BIT) : effective_service_opts[ServiceControlOptions_localScope];
        effective_service_opts[ServiceControlOptions_manageDSAIT] = (sr_svc?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT) ? (default_service_opts?.[ServiceControlOptions_manageDSAIT] ?? FALSE_BIT) : effective_service_opts[ServiceControlOptions_manageDSAIT];
        effective_service_opts[ServiceControlOptions_noSubtypeMatch] = (sr_svc?.[ServiceControlOptions_noSubtypeMatch] === TRUE_BIT) ? (default_service_opts?.[ServiceControlOptions_noSubtypeMatch] ?? FALSE_BIT) : effective_service_opts[ServiceControlOptions_noSubtypeMatch];
        effective_service_opts[ServiceControlOptions_noSubtypeSelection] = (sr_svc?.[ServiceControlOptions_noSubtypeSelection] === TRUE_BIT) ? (default_service_opts?.[ServiceControlOptions_noSubtypeSelection] ?? FALSE_BIT) : effective_service_opts[ServiceControlOptions_noSubtypeSelection];
        effective_service_opts[ServiceControlOptions_partialNameResolution] = (sr_svc?.[ServiceControlOptions_partialNameResolution] === TRUE_BIT) ? (default_service_opts?.[ServiceControlOptions_partialNameResolution] ?? FALSE_BIT) : effective_service_opts[ServiceControlOptions_partialNameResolution];
        effective_service_opts[ServiceControlOptions_preferChaining] = (sr_svc?.[ServiceControlOptions_preferChaining] === TRUE_BIT) ? (default_service_opts?.[ServiceControlOptions_preferChaining] ?? FALSE_BIT) : effective_service_opts[ServiceControlOptions_preferChaining];
        effective_service_opts[ServiceControlOptions_subentries] = (sr_svc?.[ServiceControlOptions_subentries] === TRUE_BIT) ? (default_service_opts?.[ServiceControlOptions_subentries] ?? FALSE_BIT) : effective_service_opts[ServiceControlOptions_subentries];
    }

    return {
        hs: effective_hs,
        search: effective_search_opts,
        service: effective_service_opts,
    };
}
