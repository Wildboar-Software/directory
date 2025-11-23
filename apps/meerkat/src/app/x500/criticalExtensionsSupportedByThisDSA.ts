import { BIT_STRING, TRUE_BIT, FALSE_BIT } from "@wildboar/asn1";
import {
    EXT_BIT_SUBENTRIES,
    EXT_BIT_COPY_SHALL_DO,
    EXT_BIT_ATTRIBUTE_SIZE_LIMIT,
    EXT_BIT_EXTRA_ATTRIBUTES,
    EXT_BIT_MODIFY_RIGHTS_REQUEST,
    EXT_BIT_PAGED_RESULTS_REQUEST,
    EXT_BIT_MATCHED_VALUES_ONLY,
    EXT_BIT_EXTENDED_FILTER,
    EXT_BIT_TARGET_SYSTEM,
    EXT_BIT_USE_ALIAS_ON_UPDATE,
    EXT_BIT_NEW_SUPERIOR,
    EXT_BIT_MANAGE_DSA_IT,
    EXT_BIT_USE_OF_CONTEXTS,
    EXT_BIT_PARTIAL_NAME_RESOLUTION,
    EXT_BIT_OVERSPEC_FILTER,
    EXT_BIT_SELECTION_ON_MODIFY,
    EXT_BIT_SECURITY_OPERATION_CODE,
    EXT_BIT_SECURITY_ATTRIBUTE_CERTIFICATION_PATH,
    EXT_BIT_SECURITY_ERROR_PROTECTION,
    EXT_BIT_SERVICE_ADMINISTRATION,
    EXT_BIT_ENTRY_COUNT,
    EXT_BIT_HIERARCHY_SELECTIONS,
    EXT_BIT_RELAXATION,
    EXT_BIT_FAMILY_GROUPING,
    EXT_BIT_FAMILY_RETURN,
    EXT_BIT_DN_ATTRIBUTES,
    EXT_BIT_FRIEND_ATTRIBUTES,
    EXT_BIT_ABANDON_OF_PAGED_RESULTS,
    EXT_BIT_PAGED_RESULTS_ON_THE_DSP,
    EXT_BIT_REPLACE_VALUES,
} from "@wildboar/x500";

export
const criticalExtensionsSupportedByThisDSA: BIT_STRING = new Uint8ClampedArray(36);
criticalExtensionsSupportedByThisDSA[EXT_BIT_SUBENTRIES - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_COPY_SHALL_DO - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_ATTRIBUTE_SIZE_LIMIT - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_EXTRA_ATTRIBUTES - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_MODIFY_RIGHTS_REQUEST - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_PAGED_RESULTS_REQUEST - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_MATCHED_VALUES_ONLY - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_EXTENDED_FILTER - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_TARGET_SYSTEM - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_USE_ALIAS_ON_UPDATE - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_NEW_SUPERIOR - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_MANAGE_DSA_IT - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_USE_OF_CONTEXTS - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_PARTIAL_NAME_RESOLUTION - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_OVERSPEC_FILTER - 1] = FALSE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_SELECTION_ON_MODIFY - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_SECURITY_OPERATION_CODE - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_SECURITY_ATTRIBUTE_CERTIFICATION_PATH - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_SECURITY_ERROR_PROTECTION - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_SERVICE_ADMINISTRATION - 1] = FALSE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_ENTRY_COUNT - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_HIERARCHY_SELECTIONS - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_RELAXATION - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_FAMILY_GROUPING - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_FAMILY_RETURN - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_DN_ATTRIBUTES - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_FRIEND_ATTRIBUTES - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_ABANDON_OF_PAGED_RESULTS - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_PAGED_RESULTS_ON_THE_DSP - 1] = TRUE_BIT;
criticalExtensionsSupportedByThisDSA[EXT_BIT_REPLACE_VALUES - 1] = TRUE_BIT;

export default criticalExtensionsSupportedByThisDSA;
