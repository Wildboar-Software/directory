/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { printer_uri } from '../RFC7612Printer/printer-uri.oa';
import { printer_xri_supported } from '../RFC7612Printer/printer-xri-supported.oa';
import { printerAbstract } from '../RFC7612Printer/printerAbstract.oa';


/* START_OF_SYMBOL_DEFINITION printerServiceAuxClass */
/**
 * @summary printerServiceAuxClass
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * printerServiceAuxClass OBJECT-CLASS ::= {
 *     SUBCLASS OF         {printerAbstract}
 *     KIND                auxiliary
 *     MAY CONTAIN         {printer-uri | printer-xri-supported}
 *     LDAP-NAME           {"printerServiceAuxClass"}
 *     LDAP-DESC           "Printer information."
 *     ID                  { 1 3 18 0 2 6 257 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const printerServiceAuxClass: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [printerAbstract] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        printer_uri,
        printer_xri_supported,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['printerServiceAuxClass'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Printer information.' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 18, 0, 2, 6, 257,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION printerServiceAuxClass */

/* eslint-enable */
