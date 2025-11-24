/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { apacheDnsAbstractRecord } from '../ApacheDNS-Schema/apacheDnsAbstractRecord.oa';
import { apacheDnsCharacterString } from '../ApacheDNS-Schema/apacheDnsCharacterString.oa';


/* START_OF_SYMBOL_DEFINITION apacheDnsTextRecord */
/**
 * @summary apacheDnsTextRecord
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * apacheDnsTextRecord OBJECT-CLASS ::= {
 *     SUBCLASS OF     {apacheDnsAbstractRecord}
 *     KIND            structural
 *     MUST CONTAIN    {apacheDnsCharacterString}
 *     LDAP-NAME       {"apacheDnsTextRecord"}
 *     LDAP-DESC       "A text TXT record"
 *     ID              { 1 3 6 1 4 1 18060 0 4 2 3 8 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const apacheDnsTextRecord: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [apacheDnsAbstractRecord] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        apacheDnsCharacterString,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['apacheDnsTextRecord'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'A text TXT record' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 2, 3, 8,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION apacheDnsTextRecord */

/* eslint-enable */
