/* eslint-disable */
import {
    itu_t,
    itu_r,
    ccitt,
    iso,
    joint_iso_itu_t,
    joint_iso_ccitt,
    OPTIONAL,
    BOOLEAN,
    INTEGER,
    BIT_STRING,
    OCTET_STRING,
    NULL,
    OBJECT_IDENTIFIER,
    ObjectDescriptor,
    EXTERNAL,
    REAL,
    INSTANCE_OF,
    ENUMERATED,
    EMBEDDED_PDV,
    UTF8String,
    RELATIVE_OID,
    SEQUENCE,
    SEQUENCE_OF,
    SET,
    SET_OF,
    GraphicString,
    NumericString,
    VisibleString,
    PrintableString,
    ISO646String,
    TeletexString,
    GeneralString,
    T61String,
    UniversalString,
    VideotexString,
    BMPString,
    IA5String,
    CharacterString,
    UTCTime,
    GeneralizedTime,
    TIME,
    DATE,
    TIME_OF_DAY,
    DATE_TIME,
    DURATION,
    OID_IRI,
    RELATIVE_OID_IRI,
    TRUE,
    FALSE,
    TRUE_BIT,
    FALSE_BIT,
    PLUS_INFINITY,
    MINUS_INFINITY,
    NOT_A_NUMBER,
    TYPE_IDENTIFIER,
    ABSTRACT_SYNTAX,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    ASN1Construction as _Construction,
    ASN1UniversalType as _UniversalType,
    ObjectIdentifier as _OID,
    External as _External,
    EmbeddedPDV as _PDV,
    ASN1ConstructionError as _ConstructionError,
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
export { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import { ObjectClassKind, _enum_for_ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
export { ObjectClassKind, _enum_for_ObjectClassKind, ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */, abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */, structural /* IMPORTED_SHORT_ENUMERATION_ITEM */, ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */, auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_ObjectClassKind, _encode_ObjectClassKind } from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
export { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
import { printer_name } from "../RFC7612Printer/printer-name.oa";
export { printer_name } from "../RFC7612Printer/printer-name.oa";
import { printer_natural_language_configured } from "../RFC7612Printer/printer-natural-language-configured.oa";
export { printer_natural_language_configured } from "../RFC7612Printer/printer-natural-language-configured.oa";
import { printer_location } from "../RFC7612Printer/printer-location.oa";
export { printer_location } from "../RFC7612Printer/printer-location.oa";
import { printer_info } from "../RFC7612Printer/printer-info.oa";
export { printer_info } from "../RFC7612Printer/printer-info.oa";
import { printer_more_info } from "../RFC7612Printer/printer-more-info.oa";
export { printer_more_info } from "../RFC7612Printer/printer-more-info.oa";
import { printer_make_and_model } from "../RFC7612Printer/printer-make-and-model.oa";
export { printer_make_and_model } from "../RFC7612Printer/printer-make-and-model.oa";
import { printer_multiple_document_jobs_supported } from "../RFC7612Printer/printer-multiple-document-jobs-supported.oa";
export { printer_multiple_document_jobs_supported } from "../RFC7612Printer/printer-multiple-document-jobs-supported.oa";
import { printer_charset_configured } from "../RFC7612Printer/printer-charset-configured.oa";
export { printer_charset_configured } from "../RFC7612Printer/printer-charset-configured.oa";
import { printer_charset_supported } from "../RFC7612Printer/printer-charset-supported.oa";
export { printer_charset_supported } from "../RFC7612Printer/printer-charset-supported.oa";
import { printer_generated_natural_language_supported } from "../RFC7612Printer/printer-generated-natural-language-supported.oa";
export { printer_generated_natural_language_supported } from "../RFC7612Printer/printer-generated-natural-language-supported.oa";
import { printer_document_format_supported } from "../RFC7612Printer/printer-document-format-supported.oa";
export { printer_document_format_supported } from "../RFC7612Printer/printer-document-format-supported.oa";
import { printer_color_supported } from "../RFC7612Printer/printer-color-supported.oa";
export { printer_color_supported } from "../RFC7612Printer/printer-color-supported.oa";
import { printer_compression_supported } from "../RFC7612Printer/printer-compression-supported.oa";
export { printer_compression_supported } from "../RFC7612Printer/printer-compression-supported.oa";
import { printer_pages_per_minute } from "../RFC7612Printer/printer-pages-per-minute.oa";
export { printer_pages_per_minute } from "../RFC7612Printer/printer-pages-per-minute.oa";
import { printer_pages_per_minute_color } from "../RFC7612Printer/printer-pages-per-minute-color.oa";
export { printer_pages_per_minute_color } from "../RFC7612Printer/printer-pages-per-minute-color.oa";
import { printer_finishings_supported } from "../RFC7612Printer/printer-finishings-supported.oa";
export { printer_finishings_supported } from "../RFC7612Printer/printer-finishings-supported.oa";
import { printer_number_up_supported } from "../RFC7612Printer/printer-number-up-supported.oa";
export { printer_number_up_supported } from "../RFC7612Printer/printer-number-up-supported.oa";
import { printer_sides_supported } from "../RFC7612Printer/printer-sides-supported.oa";
export { printer_sides_supported } from "../RFC7612Printer/printer-sides-supported.oa";
import { printer_media_supported } from "../RFC7612Printer/printer-media-supported.oa";
export { printer_media_supported } from "../RFC7612Printer/printer-media-supported.oa";
import { printer_media_local_supported } from "../RFC7612Printer/printer-media-local-supported.oa";
export { printer_media_local_supported } from "../RFC7612Printer/printer-media-local-supported.oa";
import { printer_resolution_supported } from "../RFC7612Printer/printer-resolution-supported.oa";
export { printer_resolution_supported } from "../RFC7612Printer/printer-resolution-supported.oa";
import { printer_print_quality_supported } from "../RFC7612Printer/printer-print-quality-supported.oa";
export { printer_print_quality_supported } from "../RFC7612Printer/printer-print-quality-supported.oa";
import { printer_job_priority_supported } from "../RFC7612Printer/printer-job-priority-supported.oa";
export { printer_job_priority_supported } from "../RFC7612Printer/printer-job-priority-supported.oa";
import { printer_copies_supported } from "../RFC7612Printer/printer-copies-supported.oa";
export { printer_copies_supported } from "../RFC7612Printer/printer-copies-supported.oa";
import { printer_job_k_octets_supported } from "../RFC7612Printer/printer-job-k-octets-supported.oa";
export { printer_job_k_octets_supported } from "../RFC7612Printer/printer-job-k-octets-supported.oa";
import { printer_current_operator } from "../RFC7612Printer/printer-current-operator.oa";
export { printer_current_operator } from "../RFC7612Printer/printer-current-operator.oa";
import { printer_service_person } from "../RFC7612Printer/printer-service-person.oa";
export { printer_service_person } from "../RFC7612Printer/printer-service-person.oa";
import { printer_delivery_orientation_supported } from "../RFC7612Printer/printer-delivery-orientation-supported.oa";
export { printer_delivery_orientation_supported } from "../RFC7612Printer/printer-delivery-orientation-supported.oa";
import { printer_stacking_order_supported } from "../RFC7612Printer/printer-stacking-order-supported.oa";
export { printer_stacking_order_supported } from "../RFC7612Printer/printer-stacking-order-supported.oa";
import { printer_output_features_supported } from "../RFC7612Printer/printer-output-features-supported.oa";
export { printer_output_features_supported } from "../RFC7612Printer/printer-output-features-supported.oa";
import { printer_device_id } from "../RFC7612Printer/printer-device-id.oa";
export { printer_device_id } from "../RFC7612Printer/printer-device-id.oa";
import { printer_device_service_count } from "../RFC7612Printer/printer-device-service-count.oa";
export { printer_device_service_count } from "../RFC7612Printer/printer-device-service-count.oa";
import { printer_uuid } from "../RFC7612Printer/printer-uuid.oa";
export { printer_uuid } from "../RFC7612Printer/printer-uuid.oa";
import { printer_charge_info } from "../RFC7612Printer/printer-charge-info.oa";
export { printer_charge_info } from "../RFC7612Printer/printer-charge-info.oa";
import { printer_charge_info_uri } from "../RFC7612Printer/printer-charge-info-uri.oa";
export { printer_charge_info_uri } from "../RFC7612Printer/printer-charge-info-uri.oa";
import { printer_geo_location } from "../RFC7612Printer/printer-geo-location.oa";
export { printer_geo_location } from "../RFC7612Printer/printer-geo-location.oa";


/* START_OF_SYMBOL_DEFINITION printerAbstract */
/**
 * @summary printerAbstract
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * printerAbstract OBJECT-CLASS ::= {
 *     SUBCLASS OF         {top}
 *     KIND                abstract
 *     MAY CONTAIN         {
 *         printer-name
 *         | printer-natural-language-configured
 *         | printer-location
 *         | printer-info
 *         | printer-more-info
 *         | printer-make-and-model
 *         | printer-multiple-document-jobs-supported
 *         | printer-charset-configured
 *         | printer-charset-supported
 *         | printer-generated-natural-language-supported
 *         | printer-document-format-supported
 *         | printer-color-supported
 *         | printer-compression-supported
 *         | printer-pages-per-minute
 *         | printer-pages-per-minute-color
 *         | printer-finishings-supported
 *         | printer-number-up-supported
 *         | printer-sides-supported
 *         | printer-media-supported
 *         | printer-media-local-supported
 *         | printer-resolution-supported
 *         | printer-print-quality-supported
 *         | printer-job-priority-supported
 *         | printer-copies-supported
 *         | printer-job-k-octets-supported
 *         | printer-current-operator
 *         | printer-service-person
 *         | printer-delivery-orientation-supported
 *         | printer-stacking-order-supported
 *         | printer-output-features-supported
 *         | printer-device-id
 *         | printer-device-service-count
 *         | printer-uuid
 *         | printer-charge-info
 *         | printer-charge-info-uri
 *         | printer-geo-location
 *     }
 *     LDAP-NAME           {"printerAbstract"}
 *     LDAP-DESC           "Printer-related information."
 *     ID                  { 1 3 18 0 2 6 258 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const printerAbstract: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": abstract /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ printer_name, printer_natural_language_configured, printer_location, printer_info, printer_more_info, printer_make_and_model, printer_multiple_document_jobs_supported, printer_charset_configured, printer_charset_supported, printer_generated_natural_language_supported, printer_document_format_supported, printer_color_supported, printer_compression_supported, printer_pages_per_minute, printer_pages_per_minute_color, printer_finishings_supported, printer_number_up_supported, printer_sides_supported, printer_media_supported, printer_media_local_supported, printer_resolution_supported, printer_print_quality_supported, printer_job_priority_supported, printer_copies_supported, printer_job_k_octets_supported, printer_current_operator, printer_service_person, printer_delivery_orientation_supported, printer_stacking_order_supported, printer_output_features_supported, printer_device_id, printer_device_service_count, printer_uuid, printer_charge_info, printer_charge_info_uri, printer_geo_location, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["printerAbstract"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "Printer-related information." /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 3, 18, 0, 2, 6, 258,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION printerAbstract */

/* eslint-enable */
