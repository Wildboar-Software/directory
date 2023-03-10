import { Context, Vertex, ServiceError, ClientAssociation, AttributeError } from "@wildboar/meerkat-types";
import type { OperationDispatcherState } from "./OperationDispatcher";
import { ACDFTupleExtended, ACDFTuple, getACDFTuplesFromACIItem, bacACDF } from "@wildboar/x500";
import {
    serviceAdminSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/serviceAdminSubentry.oa";
import {
    OperationProgress_nameResolutionPhase_completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import {
    SearchRule,
} from "@wildboar/x500/src/lib/modules/ServiceAdministration/SearchRule.ta";
import { SearchArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import { BERElement, ObjectIdentifier } from "asn1-ts";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_requestedServiceNotAvailable,
    ServiceProblem_unwillingToPerform,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import createSecurityParameters from "../x500/createSecurityParameters";
import printInvokeId from "../utils/printInvokeId";
import {
    searchServiceProblem,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/searchServiceProblem.oa";
import {
    serviceType,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/serviceType.oa";
import {
    id_pr_unidentifiedOperation,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-unidentifiedOperation.va";
import {
    id_pr_unavailableOperation,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-unavailableOperation.va";
import {
    id_pr_missingSearchContext,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-missingSearchContext.va";
import {
    id_pr_missingSearchAttribute,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-missingSearchAttribute.va";
import {
    id_pr_hierarchySelectForbidden,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-hierarchySelectForbidden.va";
import {
    id_pr_invalidSearchValue,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-invalidSearchValue.va";
import {
    id_pr_invalidServiceControlOptions,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-invalidServiceControlOptions.va";
// import {
//     id_pr_attributeMatchingViolation,
// } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-attributeMatchingViolation.va";
// import {
//     id_pr_invalidContextSearchValue,
// } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-invalidContextSearchValue.va";
// import {
//     id_pr_matchingUseViolation,
// } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-matchingUseViolation.va";
// import {
//     id_pr_relaxationNotSupported,
// } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-relaxationNotSupported.va";
import {
    id_pr_searchValueRequired,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-searchValueRequired.va";
import {
    id_pr_searchContextValueViolation,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-searchContextValueViolation.va";
import {
    id_pr_invalidSearchControlOptions,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-invalidSearchControlOptions.va";
import {
    id_pr_invalidHierarchySelect,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-invalidHierarchySelect.va";
import {
    id_pr_unavailableHierarchySelect,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-unavailableHierarchySelect.va";
import {
    id_pr_searchContextViolation,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-searchContextViolation.va";
import {
    id_pr_searchValueNotAllowed,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-searchValueNotAllowed.va";
import {
    id_pr_searchAttributeViolation,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-searchAttributeViolation.va";
import {
    id_pr_attributeNegationViolation,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-attributeNegationViolation.va";
import {
    id_pr_searchContextCombinationViolation,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-searchContextCombinationViolation.va";
import {
    id_pr_searchAttributeCombinationViolation,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-pr-searchAttributeCombinationViolation.va";
import { DER } from "asn1-ts/dist/node/functional";
import {
    AttributeErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import {
    AttributeProblem_inappropriateMatching,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import {
    attributeError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/attributeError.oa";
import getDistinguishedName from "../x500/getDistinguishedName";
import {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import { AttributeErrorData_problems_Item } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData-problems-Item.ta";
import {
    attributeTypeList,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/attributeTypeList.oa";
import {
    contextTypeList,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/contextTypeList.oa";
import {
    attributeCombinations,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/attributeCombinations.oa";
import {
    contextCombinations,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/contextCombinations.oa";
import {
    contextList,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/contextList.oa";
import {
    filterItem,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/filterItem.oa";
import {
    hierarchySelectList,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/hierarchySelectList.oa";
import {
    searchControlOptionsList,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/searchControlOptionsList.oa";
import {
    serviceControlOptionsList,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/serviceControlOptionsList.oa";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import { searchRules } from "@wildboar/x500/src/lib/collections/attributes";
import { attributeValueFromDB } from "../database/attributeValueFromDB";
import { _decode_SearchRuleDescription } from "@wildboar/x500/src/lib/modules/InformationFramework/SearchRuleDescription.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import getAdministrativePoints from "../dit/getAdministrativePoints";
import { ID_AC_SPECIFIC, ID_AUTONOMOUS } from "../../oidstr";
import getACIItems from "../authz/getACIItems";
import getIsGroupMember from "../authz/getIsGroupMember";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import preprocessTuples from "../authz/preprocessTuples";
import { UNTRUSTED_REQ_AUTH_LEVEL } from "../constants";
import { PERMISSION_CATEGORY_INVOKE } from "@wildboar/x500/src/lib/bac/bacACDF";
import { bacSettings } from "../authz/bacSettings";
import { AttributeTypeAndValue } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AttributeTypeAndValue.ta";
import { getServiceAdminPoint } from "../dit/getServiceAdminPoint";
import accessControlSchemesThatUseACIItems from "../authz/accessControlSchemesThatUseACIItems";
import { is_empty_search_rule } from "../service/is_empty_search_rule";
import { general_check_of_search_filter } from "../service/general_check_of_search_filter";
import { check_of_request_attribute_profiles } from "../service/check_of_request_attribute_profiles";
import { check_of_controls_and_hierarchy_selections } from "../service/check_of_controls_and_hierarchy_selections";
import { check_of_matching_use } from "../service/check_of_matching_use";

const SEARCH_RULE_BYTES: Buffer = searchRules["&id"].toBytes();

export
interface SearchRuleCheckResult {
    clause_and_step_failed?: [ number, number ];
    notification: Attribute[];
}

/**
 * @summary Evaluate a search argument against a search rule
 * @description
 *
 * This function evaluates a search argument against a search rule as described
 * in [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
 * Section 15. If there is any failure, the clause and step of X.511 (2019),
 * Section 15 on which validation failed is returned. Notification attributes
 * are returned as well.
 *
 * @param ctx The context object
 * @param search The unsigned search argument data
 * @param rule The search rule to evaluate
 * @returns Information about what failed validation, if anything
 *
 * @function
 */
export
function check_search_rule (
    ctx: Context,
    search: SearchArgumentData,
    rule: SearchRule,
): SearchRuleCheckResult {
    const state: SearchRuleCheckResult = {
        notification: [],
    };
    const [general_result_step, general_result_state] = general_check_of_search_filter(ctx, search, rule);
    if (general_result_step !== 0) {
        if (search.serviceControls?.serviceType) {
            state.notification.push(new Attribute(
                serviceType["&id"],
                [serviceType.encoderFor["&Type"]!(search.serviceControls.serviceType, DER)],
            ));
        }
        if (general_result_state.searchAttributeViolations.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_searchAttributeViolation, DER)],
            ));
            state.notification.push(new Attribute(
                attributeTypeList["&id"],
                general_result_state.searchAttributeViolations
                    .map((oid) => attributeTypeList.encoderFor["&Type"]!(oid, DER)),
            ));
        }
        if (general_result_state.attributeNegationViolations.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_attributeNegationViolation, DER)],
            ));
            state.notification.push(new Attribute(
                attributeTypeList["&id"],
                general_result_state.attributeNegationViolations
                    .map((oid) => attributeTypeList.encoderFor["&Type"]!(oid, DER)),
            ));
        }
        if (general_result_state.missingSearchAttributes.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_missingSearchAttribute, DER)],
            ));
            state.notification.push(new Attribute(
                attributeTypeList["&id"],
                general_result_state.missingSearchAttributes
                    .map((oid) => attributeTypeList.encoderFor["&Type"]!(oid, DER)),
            ));
        }
        if (general_result_state.searchAttributeCombinationViolations.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_searchAttributeCombinationViolation, DER)],
            ));
            state.notification.push(new Attribute(
                attributeCombinations["&id"],
                general_result_state.searchAttributeCombinationViolations
                    .map((combo) => attributeCombinations.encoderFor["&Type"]!(combo, DER)),
            ));
        }
        if (general_result_state.searchValuesDisallowed.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_searchValueNotAllowed, DER)],
            ));
            state.notification.push(new Attribute(
                filterItem["&id"],
                general_result_state.searchValuesDisallowed
                    .map((item) => filterItem.encoderFor["&Type"]!(item, DER)),
            ));
        }
        if (general_result_state.searchContextViolations.size > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_searchContextViolation, DER)],
            ));
            state.notification.push(new Attribute(
                contextTypeList["&id"],
                Array.from(general_result_state.searchContextViolations)
                    .map((ct) => contextTypeList.encoderFor["&Type"]!(ObjectIdentifier.fromString(ct), DER)),
            ));
        }
        state.clause_and_step_failed = [1, general_result_step];
        return state;
    }
    const [request_attrs_step, request_attrs_state] = check_of_request_attribute_profiles(ctx, search, rule);
    if (request_attrs_step !== 0) {
        if (search.serviceControls?.serviceType) {
            state.notification.push(new Attribute(
                serviceType["&id"],
                [serviceType.encoderFor["&Type"]!(search.serviceControls.serviceType, DER)],
            ));
        }
        if (request_attrs_state.searchValuesRequired.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_searchValueRequired, DER)],
            ));
            state.notification.push(new Attribute(
                attributeTypeList["&id"],
                request_attrs_state.searchValuesRequired
                    .map((oid) => attributeTypeList.encoderFor["&Type"]!(oid, DER)),
            ));
        }
        if (request_attrs_state.invalidSearchValues.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_invalidSearchValue, DER)],
            ));
            state.notification.push(new Attribute(
                attributeTypeList["&id"],
                request_attrs_state.invalidSearchValues
                    .map((item) => filterItem.encoderFor["&Type"]!(item, DER)),
            ));
        }
        if (request_attrs_state.missingSearchContexts.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_missingSearchContext, DER)],
            ));
            if (request_attrs_state.missingSearchContextAttr) {
                state.notification.push(new Attribute(
                    attributeTypeList["&id"],
                    [attributeTypeList.encoderFor["&Type"]!(request_attrs_state.missingSearchContextAttr, DER)],
                ));
            }
            state.notification.push(new Attribute(
                contextTypeList["&id"],
                request_attrs_state.missingSearchContexts
                    .map((oid) => contextTypeList.encoderFor["&Type"]!(oid, DER)),
            ));
        }
        if (request_attrs_state.contextComboViolations.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_searchContextCombinationViolation, DER)],
            ));
            if (request_attrs_state.contextComboViolationAttr) {
                state.notification.push(new Attribute(
                    attributeTypeList["&id"],
                    [attributeTypeList.encoderFor["&Type"]!(request_attrs_state.contextComboViolationAttr, DER)],
                ));
            }
            state.notification.push(new Attribute(
                contextCombinations["&id"],
                request_attrs_state.contextComboViolations
                    .map((combo) => contextCombinations.encoderFor["&Type"]!(combo, DER)),
            ));
        }
        if (request_attrs_state.searchContextViolations.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_searchContextViolation, DER)],
            ));
            if (request_attrs_state.searchContextViolationsAttr) {
                state.notification.push(new Attribute(
                    attributeTypeList["&id"],
                    [attributeTypeList.encoderFor["&Type"]!(request_attrs_state.searchContextViolationsAttr, DER)],
                ));
            }
            state.notification.push(new Attribute(
                contextTypeList["&id"],
                request_attrs_state.searchContextViolations
                    .map((oid) => contextTypeList.encoderFor["&Type"]!(oid, DER)),
            ));
        }
        if (request_attrs_state.searchContextValueViolations.length > 0) {
            state.notification.push(new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_searchContextValueViolation, DER)],
            ));
            if (request_attrs_state.searchContextValueViolationAttr) {
                state.notification.push(new Attribute(
                    attributeTypeList["&id"],
                    [attributeTypeList.encoderFor["&Type"]!(request_attrs_state.searchContextValueViolationAttr, DER)],
                ));
            }
            state.notification.push(new Attribute(
                contextList["&id"],
                request_attrs_state.searchContextValueViolations
                    .map((c) => contextList.encoderFor["&Type"]!(c, DER)),
            ));
        }
        state.clause_and_step_failed = [2, request_attrs_step];
        return state;
    }
    const controls_result = check_of_controls_and_hierarchy_selections(search, rule);
    if (controls_result.step_failed) {
        if (search.serviceControls?.serviceType) {
            state.notification.push(new Attribute(
                serviceType["&id"],
                [serviceType.encoderFor["&Type"]!(search.serviceControls.serviceType, DER)],
            ));
        }
        switch (controls_result.step_failed) {
            case (1): {
                state.notification.push(new Attribute(
                    searchServiceProblem["&id"],
                    [searchServiceProblem.encoderFor["&Type"]!(id_pr_hierarchySelectForbidden, DER)],
                ));
                break;
            }
            case (2): {
                state.notification.push(new Attribute(
                    searchServiceProblem["&id"],
                    [searchServiceProblem.encoderFor["&Type"]!(id_pr_invalidHierarchySelect, DER)],
                ));
                break;
            }
            case (3): {
                state.notification.push(new Attribute(
                    searchServiceProblem["&id"],
                    [searchServiceProblem.encoderFor["&Type"]!(id_pr_unavailableHierarchySelect, DER)],
                ));
                break;
            }
            case (4): {
                state.notification.push(new Attribute(
                    searchServiceProblem["&id"],
                    [searchServiceProblem.encoderFor["&Type"]!(id_pr_invalidSearchControlOptions, DER)],
                ));
                break;
            }
            case (5): {
                state.notification.push(new Attribute(
                    searchServiceProblem["&id"],
                    [searchServiceProblem.encoderFor["&Type"]!(id_pr_invalidServiceControlOptions, DER)],
                ));
                break;
            }
        }
        if (controls_result.hierarchySelectList) {
            state.notification.push(new Attribute(
                hierarchySelectList["&id"],
                [hierarchySelectList.encoderFor["&Type"]!(controls_result.hierarchySelectList, DER)],
            ));
        }
        if (controls_result.searchControlOptionsList) {
            state.notification.push(new Attribute(
                searchControlOptionsList["&id"],
                [searchControlOptionsList.encoderFor["&Type"]!(controls_result.searchControlOptionsList, DER)],
            ));
        }
        if (controls_result.serviceControlOptionsList) {
            state.notification.push(new Attribute(
                serviceControlOptionsList["&id"],
                [serviceControlOptionsList.encoderFor["&Type"]!(controls_result.serviceControlOptionsList, DER)],
            ));
        }
        state.clause_and_step_failed = [3, controls_result.step_failed];
        return state;
    }
    const matching_result = check_of_matching_use();
    if (matching_result.problem) {
        state.notification.push(new Attribute(
            searchServiceProblem["&id"],
            [searchServiceProblem.encoderFor["&Type"]!(matching_result.problem, DER)],
        ));
        if (search.serviceControls?.serviceType) {
            state.notification.push(new Attribute(
                serviceType["&id"],
                [serviceType.encoderFor["&Type"]!(search.serviceControls.serviceType, DER)],
            ));
        }
        if (matching_result.violatingAttributes) {
            state.notification.push(new Attribute(
                attributeTypeList["&id"],
                matching_result.violatingAttributes
                    .map((attr) => attributeTypeList.encoderFor["&Type"]!(attr, DER)),
            ));
        }
        state.clause_and_step_failed = [4, 1];
        return state;
    }
    return {
        notification: [],
    };
}

/**
 * @summary The Search Rule Check Procedure (I) defined in ITU Recommendation X.518.
 * @description
 *
 * This function implements the procedure defined in
 * [ITU Recommendation X.518 (2019)](https://www.itu.int/rec/T-REC-X.518/en),
 * Section 19.3.2.2.2: the Search Rule Check Procedure (I).
 *
 * @param ctx The context object
 * @param assn The client association
 * @param state The operation dispatcher state
 * @param target The target DSE
 * @param searchArg The unsigned search argument data
 * @param signErrors Whether to digitally sign errors
 * @returns The governing search rule, or `undefined` if none could be found
 * @throws {ServiceError} if no search rules permit the search within a service
 *  administrative area
 *
 * @function
 * @async
 */
export
async function searchRuleCheckProcedure_i (
    ctx: Context,
    assn: ClientAssociation,
    state: OperationDispatcherState,
    target: Vertex,
    searchArg: SearchArgumentData,
    signErrors: boolean,
): Promise<SearchRule | undefined> {
    const searchRuleId = state.chainingArguments.searchRuleId;
    const service_admin_point = getServiceAdminPoint(target);
    if (!service_admin_point) {
        if (searchRuleId) {
            throw new ServiceError(
                ctx.i18n.t("err:search_escaped_svc_admin_area", { iid: printInvokeId(state.invokeId) }),
                new ServiceErrorData(
                    ServiceProblem_unwillingToPerform,
                    undefined,
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                ),
            );
        } else {
            return;
        }
    }

    // If the target DSE is within a service-specific administrative area and the
    // traceInformation reveals that the operation has been in a previous
    // evaluation phase, return with an unwillingToPerform service error.
    for (const trace_item of state.chainingArguments.traceInformation) {
        if (trace_item.operationProgress.nameResolutionPhase === OperationProgress_nameResolutionPhase_completed) {
            throw new ServiceError(
                ctx.i18n.t("err:search_escaped_svc_admin_area", { iid: printInvokeId(state.invokeId) }),
                new ServiceErrorData(
                    ServiceProblem_unwillingToPerform,
                    undefined,
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                ),
            );
        }
    }

    const data = searchArg;
    let candidate_search_rules: SearchRule[] = [];

    const targetDN = getDistinguishedName(target);
    const target_subentries: Vertex[] = await getRelevantSubentries(ctx, target, targetDN, service_admin_point);

    // #region Access Control

    const requestor: DistinguishedName | undefined = data
        .securityParameters
        ?.certification_path
        ?.userCertificate
        .toBeSigned
        .subject
        .rdnSequence
        ?? state.chainingArguments.originator
        ?? data.requestor
        ?? assn.boundNameAndUID?.dn;

    const user = requestor
        ? new NameAndOptionalUID(
            requestor,
            state.chainingArguments.uniqueIdentifier,
        )
        : undefined;

    /**
     * We get admin points of the subentries' admin point, because prescriptive
     * ACI within the same admin area does not apply to the subentries, but
     * those in superior admin areas do.
     */
    const adm_points = (
        service_admin_point.dse.admPoint?.administrativeRole.has(ID_AC_SPECIFIC)
        || service_admin_point.dse.admPoint?.administrativeRole.has(ID_AUTONOMOUS)
    )
        ? [ service_admin_point ]
        : getAdministrativePoints(service_admin_point.immediateSuperior!);
    const accessControlScheme = [ ...adm_points ] // Array.reverse() works in-place, so we create a new array.
        .reverse()
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const namingMatcher = getNamingMatcherGetter(ctx);
    const isMemberOfGroup = getIsGroupMember(ctx, namingMatcher);

    const db_subentries = await ctx.db.entry.findMany({
        where: {
            id: {
                in: target_subentries.map((s) => s.dse.id),
            },
            EntryObjectClass: {
                some: {
                    object_class: serviceAdminSubentry["&id"].toString(),
                },
            },
        },
        select: {
            id: true,
            AttributeValue: {
                where: {
                    type_oid: SEARCH_RULE_BYTES,
                },
                select: {
                    type_oid: true,
                    tag_class: true,
                    constructed: true,
                    tag_number: true,
                    content_octets: true,
                },
            },
        },
    });

    let chainedSearchRule: SearchRule | undefined;
    const search_rules_by_subentry_id: Map<Vertex["dse"]["id"], [BERElement, SearchRule][]> = new Map();
    for (const db_sub of db_subentries) {
        const search_rules: [BERElement, SearchRule][] = [];
        for (const attr of db_sub.AttributeValue) {
            const value = attributeValueFromDB(attr);
            const search_rule = _decode_SearchRuleDescription(value);
            search_rules.push([value, search_rule]);
            if (
                !chainedSearchRule
                && searchRuleId
                && search_rule.id === searchRuleId.id
                && search_rule.dmdId.isEqualTo(searchRuleId.dmdId)
            ) {
                chainedSearchRule = search_rule;
            }
        }
        search_rules_by_subentry_id.set(db_sub.id, search_rules);
    }

    if (searchRuleId) {
        if (chainedSearchRule) {
            return chainedSearchRule;
        } else {
            throw new ServiceError(
                ctx.i18n.t("err:unrecognized_search_rule", {
                    uuid: target.dse.uuid,
                    dmd_id: searchRuleId.dmdId.toString(),
                    id: searchRuleId.id.toString(),
                }),
                new ServiceErrorData(
                    ServiceProblem_unwillingToPerform,
                    undefined,
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                ),
            );
        }
    }

    const DeniedSR: SearchRule[] = [];
    if (accessControlScheme && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())) {
        for (const subentry of target_subentries) {
            const subentryDN = getDistinguishedName(subentry);
            const relevantSubentries: Vertex[] = (await Promise.all(
                adm_points.map((ap) => getRelevantSubentries(ctx, subentry, subentryDN, ap)),
            )).flat();
            const relevantACIItems = await getACIItems(
                ctx,
                accessControlScheme,
                subentry.immediateSuperior,
                subentry,
                relevantSubentries,
                Boolean(target.dse.subentry),
            );
            const acdfTuples: ACDFTuple[] = (relevantACIItems ?? [])
                .flatMap((aci) => getACDFTuplesFromACIItem(aci));
            const relevantTuples: ACDFTupleExtended[] = await preprocessTuples(
                accessControlScheme,
                acdfTuples,
                user,
                state.chainingArguments.authenticationLevel
                    ?? assn?.authLevel
                    ?? UNTRUSTED_REQ_AUTH_LEVEL,
                subentryDN,
                isMemberOfGroup,
                namingMatcher,
            );
            const search_rules = search_rules_by_subentry_id.get(subentry.dse.id);
            if (!search_rules?.length) {
                continue;
            }
            const { authorized: authorizedToInvokeSearchRules } = bacACDF(
                relevantTuples,
                user,
                {
                    attributeType: searchRules["&id"],
                },
                [PERMISSION_CATEGORY_INVOKE],
                bacSettings,
                true,
            );
            if (!authorizedToInvokeSearchRules) {
                continue;
            }
            for (const [ undecoded, sr ] of search_rules) {
                const { authorized: authorizedToInvokeThisSearchRule } = bacACDF(
                    relevantTuples,
                    user,
                    {
                        value: new AttributeTypeAndValue(
                            searchRules["&id"],
                            undecoded,
                        ),
                        operational: true,
                    },
                    [PERMISSION_CATEGORY_INVOKE],
                    bacSettings,
                    true,
                );
                if (authorizedToInvokeThisSearchRule) {
                    candidate_search_rules.push(sr);
                } else {
                    DeniedSR.push(sr);
                }
            }
        }
    } else {
        for (const subentry of target_subentries) {
            const search_rules = search_rules_by_subentry_id.get(subentry.dse.id);
            if (!search_rules?.length) {
                continue;
            }
            for (const [ , sr ] of search_rules) {
                candidate_search_rules.push(sr);
            }
        }
    }


    // #endregion Access Control

    if (candidate_search_rules.length === 0) {
        throw new ServiceError(
            ctx.i18n.t("err:requestedServiceNotAvailable", { iid: printInvokeId(state.invokeId) }),
            new ServiceErrorData(
                ServiceProblem_requestedServiceNotAvailable,
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                [
                    new Attribute(
                        searchServiceProblem["&id"],
                        [searchServiceProblem.encoderFor["&Type"]!(id_pr_unidentifiedOperation, DER)],
                    ),
                ],
            ),
        );
    }

    if (data.serviceControls?.userClass !== undefined) {
        const uc: number = Number(data.serviceControls.userClass);
        candidate_search_rules = candidate_search_rules
            .filter((sr) => sr.userClass === uc);
    }
    if (data.serviceControls?.serviceType) {
        const st = data.serviceControls.serviceType;
        candidate_search_rules = candidate_search_rules
            .filter((sr) => sr.serviceType?.isEqualTo(st));
    }
    if (candidate_search_rules.length === 0) {
        const notification: Attribute[] = [
            new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_unidentifiedOperation, DER)],
            ),
        ];
        if (data.serviceControls?.serviceType) {
            notification.push(new Attribute(
                serviceType["&id"],
                [serviceType.encoderFor["&Type"]!(data.serviceControls.serviceType, DER)],
            ));
        }
        throw new ServiceError(
            ctx.i18n.t("err:requestedServiceNotAvailable", { iid: printInvokeId(state.invokeId) }),
            new ServiceErrorData(
                ServiceProblem_requestedServiceNotAvailable,
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                notification,
            ),
        );
    }

    let GoodPermittedSR: SearchRule[] = [];
    const MatchProblemSR: SearchRule[] = [];
    let BadPermittedSR: SearchRule[] = [];
    // NOTE: DeniedSR is populated earlier.

    const search_rule_evals: Map<SearchRule, SearchRuleCheckResult> = new Map();
    for (const rule of candidate_search_rules) {
        const result = check_search_rule(ctx, data, rule);
        search_rule_evals.set(rule, result);
        if (result.clause_and_step_failed) {
            const [ clause ] = result.clause_and_step_failed;
            if (clause === 4) {
                MatchProblemSR.push(rule);
            } else {
                BadPermittedSR.push(rule);
            }
        } else {
            GoodPermittedSR.push(rule);
        }
    }

    // Step 4.
    const empty_search_rule: SearchRule | undefined = candidate_search_rules.find(is_empty_search_rule);
    if (empty_search_rule) {
        return empty_search_rule; // This is the governing search rule.
    }

    // Step 5.
    if (GoodPermittedSR.length > 0) {
        let highest_user_class: number = 0;
        for (const sr of GoodPermittedSR) {
            // "This component shall always be present, except for the empty search rule."
            if (sr.userClass === undefined) {
                continue;
            }
            highest_user_class = Math.max(Number(sr.userClass), highest_user_class);
        }
        GoodPermittedSR = GoodPermittedSR
            .filter((sr) => (sr.userClass ?? 0) === highest_user_class);

        // Step 6.
        if (GoodPermittedSR.length > 1) {
            /* "If in the list above there are several search-rules to select
            from, the implementation should log the incident for administrative
            attention, as the search-rule definitions probably need re-working."
            */
            ctx.log.warn(ctx.i18n.t("log:multiple_search_rules_of_same_user_class", {
                user_class: highest_user_class,
            }));
        }
        return GoodPermittedSR[0];

    }

    // Step 7
    if (MatchProblemSR.length > 0) {
        const badMatchingAttrs: AttributeType[] = [];
        throw new AttributeError(
            ctx.i18n.t("err:invalid_matching_use", {
                attrs: badMatchingAttrs
                    .map((oid) => oid.toString())
                    .join(","),
            }),
            new AttributeErrorData(
                {
                    rdnSequence: getDistinguishedName(target),
                },
                badMatchingAttrs
                    .map((attr) => new AttributeErrorData_problems_Item(
                        AttributeProblem_inappropriateMatching,
                        attr,
                    )),
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        )
    }

    // Step 8
    if (DeniedSR.length > 0) {
        const compliant_non_empty_but_denied_rules: SearchRule[] = DeniedSR
            .filter((sr) => (
                !is_empty_search_rule(sr)
                && !check_search_rule(ctx, searchArg, sr).clause_and_step_failed
            ));
        if (compliant_non_empty_but_denied_rules.length > 0) {
            const notification: Attribute[] = [
                new Attribute(
                    searchServiceProblem["&id"],
                    [searchServiceProblem.encoderFor["&Type"]!(id_pr_unavailableOperation, DER)],
                ),
            ];
            if (data.serviceControls?.serviceType) {
                notification.push(new Attribute(
                    serviceType["&id"],
                    [serviceType.encoderFor["&Type"]!(data.serviceControls.serviceType, DER)],
                ));
            }
            throw new ServiceError(
                ctx.i18n.t("err:requestedServiceNotAvailable", { iid: printInvokeId(state.invokeId) }),
                new ServiceErrorData(
                    ServiceProblem_requestedServiceNotAvailable,
                    undefined,
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    notification,
                ),
            );
        }
    }

    // WARNING: Step 9 is unreachable. I will report this defect.
    // if (BadPermittedSR.length === 0) {
    //     throw new ServiceError(
    //         ctx.i18n.t("err:requestedServiceNotAvailable", { iid: printInvokeId(state.invokeId) }),
    //         new ServiceErrorData(
    //             ServiceProblem_requestedServiceNotAvailable,
    //             undefined,
    //             createSecurityParameters(
    //                 ctx,
    //                 signErrors,
    //                 assn.boundNameAndUID?.dn,
    //                 undefined,
    //                 serviceError["&errorCode"],
    //             ),
    //             ctx.dsa.accessPoint.ae_title.rdnSequence,
    //             state.chainingArguments.aliasDereferenced,
    //             [
    //                 new Attribute(
    //                     searchServiceProblem["&id"],
    //                     [searchServiceProblem.encoderFor["&Type"]!(id_pr_unidentifiedOperation, DER)],
    //                 ),
    //             ],
    //         ),
    //     );
    // }

    // Step 10
    for (const asserted_step of [ 1, 2, 3, 4, 5, 6 ]) {
        BadPermittedSR = BadPermittedSR
            .filter((sr) => {
                const result = search_rule_evals.get(sr);
                if (!result?.clause_and_step_failed) {
                    return false; // This should never happen.
                }
                const [ clause, step ] = result.clause_and_step_failed;
                if (clause > 1) { // If it failed on a later clause...
                    return true; // The rule survives.
                }
                if (step > asserted_step) { // Or it failed on a later step...
                    return true; // The rule survives.
                }
                return false; // Otherwise, the rule is dropped.
            });
        if (BadPermittedSR.length === 1) {
            const result = search_rule_evals.get(BadPermittedSR[0]);
            // NOTE: The spec is somewhat vague as to what is supposed to happen here.
            if (result) {
                throw new ServiceError(
                    ctx.i18n.t("err:requestedServiceNotAvailable", { iid: printInvokeId(state.invokeId) }),
                    new ServiceErrorData(
                        ServiceProblem_requestedServiceNotAvailable,
                        undefined,
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            serviceError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        result.notification,
                    ),
                );
            }
        }
    }

    // Step 11
    const all_non_compliant_so_far: boolean = BadPermittedSR
        .every((sr) => {
            const result = search_rule_evals.get(sr);
            if (!result?.clause_and_step_failed) {
                return true;
            }
            const [ clause ] = result.clause_and_step_failed;
            return (clause === 1);
        });
    if (all_non_compliant_so_far) {
        const notification: Attribute[] = [
            new Attribute(
                searchServiceProblem["&id"],
                [searchServiceProblem.encoderFor["&Type"]!(id_pr_unidentifiedOperation, DER)],
            ),
        ];
        if (data.serviceControls?.serviceType) {
            notification.push(new Attribute(
                serviceType["&id"],
                [serviceType.encoderFor["&Type"]!(data.serviceControls.serviceType, DER)],
            ));
        }
        throw new ServiceError(
            ctx.i18n.t("err:requestedServiceNotAvailable", { iid: printInvokeId(state.invokeId) }),
            new ServiceErrorData(
                ServiceProblem_requestedServiceNotAvailable,
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                notification,
            ),
        );
    }

    // Step 12
    for (const asserted_step of [ 1, 2, 3, 4, 5, 6 ]) {
        BadPermittedSR = BadPermittedSR
            .filter((sr) => {
                const result = search_rule_evals.get(sr);
                if (!result?.clause_and_step_failed) {
                    return false; // This should never happen.
                }
                const [ clause, step ] = result.clause_and_step_failed;
                if (clause > 2) { // If it failed on a later clause...
                    return true; // The rule survives.
                }
                if (step > asserted_step) { // Or it failed on a later step...
                    return true; // The rule survives.
                }
                return false; // Otherwise, the rule is dropped.
            });
        if (BadPermittedSR.length === 1) {
            const result = search_rule_evals.get(BadPermittedSR[0]);
            // NOTE: The spec is somewhat vague as to what is supposed to happen here.
            if (result) {
                throw new ServiceError(
                    ctx.i18n.t("err:requestedServiceNotAvailable", { iid: printInvokeId(state.invokeId) }),
                    new ServiceErrorData(
                        ServiceProblem_requestedServiceNotAvailable,
                        undefined,
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            serviceError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        result.notification,
                    ),
                );
            }
        }
    }

    // Step 13
    for (const asserted_step of [ 1, 2, 3, 4, 5 ]) {
        BadPermittedSR = BadPermittedSR
            .filter((sr) => {
                const result = search_rule_evals.get(sr);
                if (!result?.clause_and_step_failed) {
                    return false; // This should never happen.
                }
                const [ clause, step ] = result.clause_and_step_failed;
                if (clause > 3) { // If it failed on a later clause...
                    return true; // The rule survives.
                }
                if (step > asserted_step) { // Or it failed on a later step...
                    return true; // The rule survives.
                }
                return false; // Otherwise, the rule is dropped.
            });
        if (BadPermittedSR.length === 1) {
            const result = search_rule_evals.get(BadPermittedSR[0]);
            // NOTE: The spec is somewhat vague as to what is supposed to happen here.
            if (result) {
                throw new ServiceError(
                    ctx.i18n.t("err:requestedServiceNotAvailable", { iid: printInvokeId(state.invokeId) }),
                    new ServiceErrorData(
                        ServiceProblem_requestedServiceNotAvailable,
                        undefined,
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            serviceError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        result.notification,
                    ),
                );
            }
        }
    }

    // Step 14
    const notification: Attribute[] = [
        new Attribute(
            searchServiceProblem["&id"],
            [searchServiceProblem.encoderFor["&Type"]!(id_pr_unidentifiedOperation, DER)],
        ),
    ];
    if (data.serviceControls?.serviceType) {
        notification.push(new Attribute(
            serviceType["&id"],
            [serviceType.encoderFor["&Type"]!(data.serviceControls.serviceType, DER)],
        ));
    }
    throw new ServiceError(
        ctx.i18n.t("err:requestedServiceNotAvailable", { iid: printInvokeId(state.invokeId) }),
        new ServiceErrorData(
            ServiceProblem_requestedServiceNotAvailable,
            undefined,
            createSecurityParameters(
                ctx,
                signErrors,
                assn.boundNameAndUID?.dn,
                undefined,
                serviceError["&errorCode"],
            ),
            ctx.dsa.accessPoint.ae_title.rdnSequence,
            state.chainingArguments.aliasDereferenced,
            notification,
        ),
    );

}
