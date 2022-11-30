/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { printer_uri } from '../RFC7612Printer/printer-uri.oa';
import { printer_xri_supported } from '../RFC7612Printer/printer-xri-supported.oa';
import { printerAbstract } from '../RFC7612Printer/printerAbstract.oa';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
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
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
export { printer_uri } from '../RFC7612Printer/printer-uri.oa';
export { printer_xri_supported } from '../RFC7612Printer/printer-xri-supported.oa';
export { printerAbstract } from '../RFC7612Printer/printerAbstract.oa';

/* START_OF_SYMBOL_DEFINITION printerService */
/**
 * @summary printerService
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * printerService OBJECT-CLASS ::= {
 *     SUBCLASS OF         {printerAbstract}
 *     KIND                structrual
 *     MAY CONTAIN         {printer-uri | printer-xri-supported}
 *     LDAP-NAME           {"printerService"}
 *     LDAP-DESC           "Printer information."
 *     ID                  { 1 3 18 0 2 6 255 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const printerService: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [printerAbstract] /* OBJECT_FIELD_SETTING */,
    '&kind': ObjectClassKind_structural /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        printer_uri,
        printer_xri_supported,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['printerService'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Printer information.' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 18, 0, 2, 6, 255,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION printerService */

/* eslint-enable */
