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
import { printer_ipp_versions_supported } from "../RFC7612Printer/printer-ipp-versions-supported.oa";
export { printer_ipp_versions_supported } from "../RFC7612Printer/printer-ipp-versions-supported.oa";
import { printer_ipp_features_supported } from "../RFC7612Printer/printer-ipp-features-supported.oa";
export { printer_ipp_features_supported } from "../RFC7612Printer/printer-ipp-features-supported.oa";
import { printer_multiple_document_jobs_supported } from "../RFC7612Printer/printer-multiple-document-jobs-supported.oa";
export { printer_multiple_document_jobs_supported } from "../RFC7612Printer/printer-multiple-document-jobs-supported.oa";


/* START_OF_SYMBOL_DEFINITION printerIPP */
/**
 * @summary printerIPP
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * printerIPP OBJECT-CLASS ::= {
 *     SUBCLASS OF         {top}
 *     KIND                auxiliary
 *     MAY CONTAIN         {
 *         printer-ipp-versions-supported
 *         | printer-ipp-features-supported
 *         | printer-multiple-document-jobs-supported
 *     }
 *     LDAP-NAME           {"printerIPP"}
 *     LDAP-DESC           "Internet Printing Protocol (IPP) information."
 *     ID                  { 1 3 18 0 2 6 256 }
 * }
 * ```
 * 
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export
const printerIPP: OBJECT_CLASS = {
    class: "OBJECT-CLASS",
    decoderFor: {
    },
    encoderFor: {
    },
    "&Superclasses": [ top, ] /* OBJECT_FIELD_SETTING */,
    "&kind": auxiliary /* OBJECT_FIELD_SETTING */,
    "&OptionalAttributes": [ printer_ipp_versions_supported, printer_ipp_features_supported, printer_multiple_document_jobs_supported, ] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["printerIPP"] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "Internet Printing Protocol (IPP) information." /* OBJECT_FIELD_SETTING */,
    "&id": new _OID([1, 3, 18, 0, 2, 6, 256,]) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION printerIPP */

/* eslint-enable */
