/* eslint-disable */
import { mhs_distribution_list } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-distribution-list.oa";
import { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { structural /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { atn_AF_address } from "../ATNDirectoryObjectIdentifiers/atn-AF-address.oa";
import { atn_der_certificate } from "../ATNDirectoryObjectIdentifiers/atn-der-certificate.oa";
import { atn_ipm_heading_extensions } from "../ATNDirectoryObjectIdentifiers/atn-ipm-heading-extensions.oa";
import { atn_maximum_file_size } from "../ATNDirectoryObjectIdentifiers/atn-maximum-file-size.oa";
import { atn_maximum_number_of_body_parts } from "../ATNDirectoryObjectIdentifiers/atn-maximum-number-of-body-parts.oa";
import { atn_maximum_text_size } from "../ATNDirectoryObjectIdentifiers/atn-maximum-text-size.oa";
import { atn_per_certificate } from "../ATNDirectoryObjectIdentifiers/atn-per-certificate.oa";
import { atn_use_of_amhs_security } from "../ATNDirectoryObjectIdentifiers/atn-use-of-amhs-security.oa";
import { atn_use_of_directory } from "../ATNDirectoryObjectIdentifiers/atn-use-of-directory.oa";
import { id_oc_atn_AmhsDistributionList } from "../ATNDirectoryObjectIdentifiers/id-oc-atn-AmhsDistributionList.va";








/* START_OF_SYMBOL_DEFINITION atn_amhs_distribution_list */
/**
 * @summary atn_amhs_distribution_list
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-amhs-distribution-list OBJECT-CLASS ::= {
 *     SUBCLASS OF     {mhs-distribution-list}
 *     MUST CONTAIN    {atn-ipm-heading-extensions}
 *     MAY CONTAIN     {
 *         atn-maximum-number-of-body-parts
 *         | atn-maximum-text-size
 *         | atn-maximum-file-size
 *         | atn-per-certificate
 *         | atn-der-certificate
 *         | atn-use-of-amhs-security
 *         | atn-use-of-directory
 *         | atn-AF-address
 *     }
 *     ID              id-oc-atn-AmhsDistributionList
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const atn_amhs_distribution_list: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ mhs_distribution_list, ] /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ atn_ipm_heading_extensions, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ atn_maximum_number_of_body_parts, atn_maximum_text_size, atn_maximum_file_size, atn_per_certificate, atn_der_certificate, atn_use_of_amhs_security, atn_use_of_directory, atn_AF_address, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_atn_AmhsDistributionList /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&kind": structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_amhs_distribution_list */

/* eslint-enable */
