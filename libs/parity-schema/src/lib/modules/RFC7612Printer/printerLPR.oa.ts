/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { printer_aliases } from '../RFC7612Printer/printer-aliases.oa';
import { printer_name } from '../RFC7612Printer/printer-name.oa';
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
export { printer_aliases } from '../RFC7612Printer/printer-aliases.oa';
export { printer_name } from '../RFC7612Printer/printer-name.oa';

/* START_OF_SYMBOL_DEFINITION printerLPR */
/**
 * @summary printerLPR
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * printerLPR OBJECT-CLASS ::= {
 *     SUBCLASS OF         {top}
 *     KIND                auxiliary
 *     MUST CONTAIN        {printer-name}
 *     MAY CONTAIN         {printer-aliases}
 *     LDAP-NAME           {"printerLPR"}
 *     LDAP-DESC           "LPR information."
 *     ID                  { 1 3 18 0 2 6 253 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const printerLPR: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [printer_name] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [printer_aliases] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['printerLPR'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'LPR information.' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 18, 0, 2, 6, 253,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION printerLPR */

/* eslint-enable */
