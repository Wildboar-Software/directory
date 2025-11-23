/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { printer_ipp_features_supported } from '../RFC7612Printer/printer-ipp-features-supported.oa';
import { printer_ipp_versions_supported } from '../RFC7612Printer/printer-ipp-versions-supported.oa';
import { printer_multiple_document_jobs_supported } from '../RFC7612Printer/printer-multiple-document-jobs-supported.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    ObjectClassKind,
    ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */,
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_ObjectClassKind,
    _encode_ObjectClassKind,
    _enum_for_ObjectClassKind,
} from '@wildboar/x500/InformationFramework';
export { top } from '@wildboar/x500/InformationFramework';
export { printer_ipp_features_supported } from '../RFC7612Printer/printer-ipp-features-supported.oa';
export { printer_ipp_versions_supported } from '../RFC7612Printer/printer-ipp-versions-supported.oa';
export { printer_multiple_document_jobs_supported } from '../RFC7612Printer/printer-multiple-document-jobs-supported.oa';

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
export const printerIPP: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        printer_ipp_versions_supported,
        printer_ipp_features_supported,
        printer_multiple_document_jobs_supported,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['printerIPP'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Internet Printing Protocol (IPP) information.' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 18, 0, 2, 6, 256,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION printerIPP */

/* eslint-enable */
