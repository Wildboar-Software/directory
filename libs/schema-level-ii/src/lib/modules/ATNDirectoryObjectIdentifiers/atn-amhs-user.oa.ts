/* eslint-disable */
import { mhs_acceptable_eits } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-acceptable-eits.oa";
import { mhs_deliverable_content_types } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-deliverable-content-types.oa";
import { mhs_exclusively_acceptable_eits } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-exclusively-acceptable-eits.oa";
import { mhs_maximum_content_length } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-maximum-content-length.oa";
import { mhs_message_store_dn } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-message-store-dn.oa";
import { mhs_or_addresses } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-or-addresses.oa";
import { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
import { atn_AF_address } from "../ATNDirectoryObjectIdentifiers/atn-AF-address.oa";
import { atn_amhs_direct_access } from "../ATNDirectoryObjectIdentifiers/atn-amhs-direct-access.oa";
import { atn_der_certificate } from "../ATNDirectoryObjectIdentifiers/atn-der-certificate.oa";
import { atn_group_of_addresses } from "../ATNDirectoryObjectIdentifiers/atn-group-of-addresses.oa";
import { atn_ipm_heading_extensions } from "../ATNDirectoryObjectIdentifiers/atn-ipm-heading-extensions.oa";
import { atn_maximum_file_size } from "../ATNDirectoryObjectIdentifiers/atn-maximum-file-size.oa";
import { atn_maximum_number_of_body_parts } from "../ATNDirectoryObjectIdentifiers/atn-maximum-number-of-body-parts.oa";
import { atn_maximum_text_size } from "../ATNDirectoryObjectIdentifiers/atn-maximum-text-size.oa";
import { atn_per_certificate } from "../ATNDirectoryObjectIdentifiers/atn-per-certificate.oa";
import { atn_use_of_amhs_security } from "../ATNDirectoryObjectIdentifiers/atn-use-of-amhs-security.oa";
import { atn_use_of_directory } from "../ATNDirectoryObjectIdentifiers/atn-use-of-directory.oa";
import { id_oc_atn_AmhsUser } from "../ATNDirectoryObjectIdentifiers/id-oc-atn-AmhsUser.va";
export { mhs_acceptable_eits } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-acceptable-eits.oa";
export { mhs_deliverable_content_types } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-deliverable-content-types.oa";
export { mhs_exclusively_acceptable_eits } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-exclusively-acceptable-eits.oa";
export { mhs_maximum_content_length } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-maximum-content-length.oa";
export { mhs_message_store_dn } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-message-store-dn.oa";
export { mhs_or_addresses } from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-or-addresses.oa";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
export { ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind, _enum_for_ObjectClassKind, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
export { atn_AF_address } from "../ATNDirectoryObjectIdentifiers/atn-AF-address.oa";
export { atn_amhs_direct_access } from "../ATNDirectoryObjectIdentifiers/atn-amhs-direct-access.oa";
export { atn_der_certificate } from "../ATNDirectoryObjectIdentifiers/atn-der-certificate.oa";
export { atn_group_of_addresses } from "../ATNDirectoryObjectIdentifiers/atn-group-of-addresses.oa";
export { atn_ipm_heading_extensions } from "../ATNDirectoryObjectIdentifiers/atn-ipm-heading-extensions.oa";
export { atn_maximum_file_size } from "../ATNDirectoryObjectIdentifiers/atn-maximum-file-size.oa";
export { atn_maximum_number_of_body_parts } from "../ATNDirectoryObjectIdentifiers/atn-maximum-number-of-body-parts.oa";
export { atn_maximum_text_size } from "../ATNDirectoryObjectIdentifiers/atn-maximum-text-size.oa";
export { atn_per_certificate } from "../ATNDirectoryObjectIdentifiers/atn-per-certificate.oa";
export { atn_use_of_amhs_security } from "../ATNDirectoryObjectIdentifiers/atn-use-of-amhs-security.oa";
export { atn_use_of_directory } from "../ATNDirectoryObjectIdentifiers/atn-use-of-directory.oa";
export { id_oc_atn_AmhsUser } from "../ATNDirectoryObjectIdentifiers/id-oc-atn-AmhsUser.va";

/* START_OF_SYMBOL_DEFINITION atn_amhs_user */
/**
 * @summary atn_amhs_user
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-amhs-user OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {
 *         mhs-or-addresses
 *         | atn-ipm-heading-extensions
 *         | atn-amhs-direct-access
 *     }
 *     MAY CONTAIN     {
 *         atn-per-certificate
 *         | mhs-maximum-content-length
 *         | mhs-deliverable-content-types
 *         | mhs-acceptable-eits
 *         | mhs-exclusively-acceptable-eits
 *         | mhs-message-store-dn
 *         | atn-der-certificate
 *         | atn-AF-address
 *         | atn-maximum-number-of-body-parts
 *         | atn-use-of-amhs-security
 *         | atn-use-of-directory
 *         | atn-group-of-addresses
 *         | atn-maximum-text-size
 *         | atn-maximum-file-size
 *
 *     }
 *     ID              id-oc-atn-AmhsUser
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const atn_amhs_user: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ mhs_or_addresses, atn_ipm_heading_extensions, atn_amhs_direct_access, ] /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ atn_per_certificate, mhs_maximum_content_length, mhs_deliverable_content_types, mhs_acceptable_eits, mhs_exclusively_acceptable_eits, mhs_message_store_dn, atn_der_certificate, atn_AF_address, atn_maximum_number_of_body_parts, atn_use_of_amhs_security, atn_use_of_directory, atn_group_of_addresses, atn_maximum_text_size, atn_maximum_file_size, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_oc_atn_AmhsUser /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_amhs_user */

/* eslint-enable */
