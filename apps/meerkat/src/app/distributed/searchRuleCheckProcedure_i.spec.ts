import type { Buffer } from "node:buffer";
import type {
    Context,
    Vertex,
    ServiceError,
    ClientAssociation,
} from "../types/index.js";
import { AttributeError } from "../types/index.js";
import type { OperationDispatcherState } from "./OperationDispatcher.js";
import {
    type ACDFTupleExtended,
    type ACDFTuple,
    getACDFTuplesFromACIItem,
    PERMISSION_CATEGORY_INVOKE,
} from "@wildboar/x500";
import {
    OperationProgress_nameResolutionPhase_completed,
} from "@wildboar/x500/DistributedOperations";
import {
    SearchRule,
} from "@wildboar/x500/ServiceAdministration";
import { BERElement, ObjectIdentifier } from "@wildboar/asn1";
import {
    Attribute,
    searchRules,
    serviceAdminSubentry,
} from "@wildboar/x500/InformationFramework";
import {
    type SearchArgumentData,
    ServiceErrorData,
    ServiceProblem_requestedServiceNotAvailable,
    ServiceProblem_unwillingToPerform,
    serviceError,
    AttributeErrorData,
    AttributeProblem_inappropriateMatching,
    attributeError,
    AttributeErrorData_problems_Item,
} from "@wildboar/x500/DirectoryAbstractService";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import printInvokeId from "../utils/printInvokeId.js";
import {
    searchServiceProblem,
    serviceType,
    id_pr_unidentifiedOperation,
    id_pr_unavailableOperation,
    id_pr_missingSearchContext,
    id_pr_missingSearchAttribute,
    id_pr_hierarchySelectForbidden,
    id_pr_invalidSearchValue,
    id_pr_invalidServiceControlOptions,
    id_pr_searchValueRequired,
    id_pr_searchContextValueViolation,
    id_pr_invalidSearchControlOptions,
    id_pr_invalidHierarchySelect,
    id_pr_unavailableHierarchySelect,
    id_pr_searchContextViolation,
    id_pr_searchValueNotAllowed,
    id_pr_searchAttributeViolation,
    id_pr_attributeNegationViolation,
    id_pr_searchContextCombinationViolation,
    id_pr_searchAttributeCombinationViolation,
    attributeTypeList,
    contextTypeList,
    attributeCombinations,
    contextCombinations,
    contextList,
    filterItem,
    hierarchySelectList,
    searchControlOptionsList,
    serviceControlOptionsList,
    NameAndOptionalUID,
} from "@wildboar/x500/SelectedAttributeTypes";
import { DER } from "@wildboar/asn1/functional";
import getDistinguishedName from "../x500/getDistinguishedName.js";
import type {
    AttributeType,
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { attributeValueFromDB } from "../database/attributeValueFromDB.js";
import { _decode_SearchRuleDescription } from "@wildboar/x500/InformationFramework";
import getRelevantSubentries from "../dit/getRelevantSubentries.js";
import getAdministrativePoints from "../dit/getAdministrativePoints.js";
import { ID_AC_SPECIFIC, ID_AUTONOMOUS } from "../../oidstr.js";
import getACIItems from "../authz/getACIItems.js";
import getIsGroupMember from "../authz/getIsGroupMember.js";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter.js";
import preprocessTuples from "../authz/preprocessTuples.js";
import { UNTRUSTED_REQ_AUTH_LEVEL } from "../constants.js";
import { bacSettings } from "../authz/bacSettings.js";
import { AttributeTypeAndValue } from "@wildboar/pki-stub";
import { getServiceAdminPoint } from "../dit/getServiceAdminPoint.js";
import { is_empty_search_rule } from "../service/is_empty_search_rule.js";
import { general_check_of_search_filter } from "../service/general_check_of_search_filter.js";
import { check_of_request_attribute_profiles } from "../service/check_of_request_attribute_profiles.js";
import { check_of_controls_and_hierarchy_selections } from "../service/check_of_controls_and_hierarchy_selections.js";
import { check_of_matching_use } from "../service/check_of_matching_use.js";
import { acdf } from "../authz/acdf.js";
import { searchRuleCheckProcedure_i } from "./searchRuleCheckProcedure_i.js";
import { getMockCtx } from "../testing.spec.js";

describe("searchRuleCheckProcedure_i", () => {
    it("should return the search rule if it is valid", async () => {
        const ctx = getMockCtx();
    });
});
