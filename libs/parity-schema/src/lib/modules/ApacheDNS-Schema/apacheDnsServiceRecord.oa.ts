/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { apacheDnsAbstractRecord } from '../ApacheDNS-Schema/apacheDnsAbstractRecord.oa';
import { apacheDnsDomainName } from '../ApacheDNS-Schema/apacheDnsDomainName.oa';
import { apacheDnsServicePort } from '../ApacheDNS-Schema/apacheDnsServicePort.oa';
import { apacheDnsServicePriority } from '../ApacheDNS-Schema/apacheDnsServicePriority.oa';
import { apacheDnsServiceWeight } from '../ApacheDNS-Schema/apacheDnsServiceWeight.oa';
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
export { apacheDnsAbstractRecord } from '../ApacheDNS-Schema/apacheDnsAbstractRecord.oa';
export { apacheDnsDomainName } from '../ApacheDNS-Schema/apacheDnsDomainName.oa';
export { apacheDnsServicePort } from '../ApacheDNS-Schema/apacheDnsServicePort.oa';
export { apacheDnsServicePriority } from '../ApacheDNS-Schema/apacheDnsServicePriority.oa';
export { apacheDnsServiceWeight } from '../ApacheDNS-Schema/apacheDnsServiceWeight.oa';

/* START_OF_SYMBOL_DEFINITION apacheDnsServiceRecord */
/**
 * @summary apacheDnsServiceRecord
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * apacheDnsServiceRecord OBJECT-CLASS ::= {
 *     SUBCLASS OF     {apacheDnsAbstractRecord}
 *     MUST CONTAIN    {apacheDnsServicePriority | apacheDnsServiceWeight | apacheDnsServicePort | apacheDnsDomainName}
 *     LDAP-NAME       {"apacheDnsServiceRecord"}
 *     LDAP-DESC       "A service SRV record"
 *     ID              { 1 3 6 1 4 1 18060 0 4 2 3 9 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const apacheDnsServiceRecord: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [apacheDnsAbstractRecord] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        apacheDnsServicePriority,
        apacheDnsServiceWeight,
        apacheDnsServicePort,
        apacheDnsDomainName,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['apacheDnsServiceRecord'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'A service SRV record' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 2, 3, 9,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION apacheDnsServiceRecord */

/* eslint-enable */
