import { BIT_STRING, TRUE_BIT, FALSE_BIT } from "asn1-ts";
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
} from "@wildboar/x500/src/lib/dap/extensions";
import criticalExtensionsSupportedByThisDSA from "./criticalExtensionsSupportedByThisDSA";

export
const unsupportedAndCriticalExtensions: BIT_STRING = new Uint8ClampedArray(36);
//                                                                                  Innately critical
unsupportedAndCriticalExtensions[EXT_BIT_SUBENTRIES] =                              (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_SUBENTRIES]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_COPY_SHALL_DO] =                           (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_COPY_SHALL_DO]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_ATTRIBUTE_SIZE_LIMIT] =                    (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_ATTRIBUTE_SIZE_LIMIT]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_EXTRA_ATTRIBUTES] =                        (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_EXTRA_ATTRIBUTES]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_MODIFY_RIGHTS_REQUEST] =                   (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_MODIFY_RIGHTS_REQUEST]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_PAGED_RESULTS_REQUEST] =                   (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_PAGED_RESULTS_REQUEST]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_MATCHED_VALUES_ONLY] =                     (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_MATCHED_VALUES_ONLY]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_EXTENDED_FILTER] =                         (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_EXTENDED_FILTER]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_TARGET_SYSTEM] =                           (TRUE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_TARGET_SYSTEM]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_USE_ALIAS_ON_UPDATE] =                     (TRUE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_USE_ALIAS_ON_UPDATE]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_NEW_SUPERIOR] =                            (TRUE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_NEW_SUPERIOR]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_MANAGE_DSA_IT] =                           (TRUE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_MANAGE_DSA_IT]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_USE_OF_CONTEXTS] =                         (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_USE_OF_CONTEXTS]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_PARTIAL_NAME_RESOLUTION] =                 (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_PARTIAL_NAME_RESOLUTION]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_OVERSPEC_FILTER] =                         (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_OVERSPEC_FILTER]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_SELECTION_ON_MODIFY] =                     (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_SELECTION_ON_MODIFY]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_SECURITY_OPERATION_CODE] =                 (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_SECURITY_OPERATION_CODE]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_SECURITY_ATTRIBUTE_CERTIFICATION_PATH] =   (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_SECURITY_ATTRIBUTE_CERTIFICATION_PATH]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_SECURITY_ERROR_PROTECTION] =               (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_SECURITY_ERROR_PROTECTION]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_SERVICE_ADMINISTRATION] =                  (TRUE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_SERVICE_ADMINISTRATION]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_ENTRY_COUNT] =                             (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_ENTRY_COUNT]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_HIERARCHY_SELECTIONS] =                    (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_HIERARCHY_SELECTIONS]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_RELAXATION] =                              (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_RELAXATION]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_FAMILY_GROUPING] =                         (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_FAMILY_GROUPING]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_FAMILY_RETURN] =                           (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_FAMILY_RETURN]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_DN_ATTRIBUTES] =                           (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_DN_ATTRIBUTES]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_FRIEND_ATTRIBUTES] =                       (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_FRIEND_ATTRIBUTES]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_ABANDON_OF_PAGED_RESULTS] =                (TRUE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_ABANDON_OF_PAGED_RESULTS]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_PAGED_RESULTS_ON_THE_DSP] =                (FALSE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_PAGED_RESULTS_ON_THE_DSP]) ? TRUE_BIT : FALSE_BIT;
unsupportedAndCriticalExtensions[EXT_BIT_REPLACE_VALUES] =                          (TRUE_BIT && !criticalExtensionsSupportedByThisDSA[EXT_BIT_REPLACE_VALUES]) ? TRUE_BIT : FALSE_BIT;

export default unsupportedAndCriticalExtensions;
