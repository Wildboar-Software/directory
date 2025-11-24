/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { apacheDnsAbstractRecord } from '../ApacheDNS-Schema/apacheDnsAbstractRecord.oa';
import { apacheDnsDomainName } from '../ApacheDNS-Schema/apacheDnsDomainName.oa';


/* START_OF_SYMBOL_DEFINITION apacheDnsPointerRecord */
/**
 * @summary apacheDnsPointerRecord
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * apacheDnsPointerRecord OBJECT-CLASS ::= {
 *     SUBCLASS OF     {apacheDnsAbstractRecord}
 *     MUST CONTAIN    {apacheDnsDomainName}
 *     LDAP-NAME       {"apacheDnsPointerRecord"}
 *     LDAP-DESC       "A pointer PTR record"
 *     ID              { 1 3 6 1 4 1 18060 0 4 2 3 3 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const apacheDnsPointerRecord: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [apacheDnsAbstractRecord] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [apacheDnsDomainName] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['apacheDnsPointerRecord'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'A pointer PTR record' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 2, 3, 3,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION apacheDnsPointerRecord */

/* eslint-enable */
