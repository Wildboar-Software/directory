/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { apacheDnsAbstractRecord } from '../ApacheDNS-Schema/apacheDnsAbstractRecord.oa';
import { apacheDnsClass } from '../ApacheDNS-Schema/apacheDnsClass.oa';
import { apacheDnsSoaExpire } from '../ApacheDNS-Schema/apacheDnsSoaExpire.oa';
import { apacheDnsSoaMinimum } from '../ApacheDNS-Schema/apacheDnsSoaMinimum.oa';
import { apacheDnsSoaMName } from '../ApacheDNS-Schema/apacheDnsSoaMName.oa';
import { apacheDnsSoaRefresh } from '../ApacheDNS-Schema/apacheDnsSoaRefresh.oa';
import { apacheDnsSoaRetry } from '../ApacheDNS-Schema/apacheDnsSoaRetry.oa';
import { apacheDnsSoaRName } from '../ApacheDNS-Schema/apacheDnsSoaRName.oa';
import { apacheDnsSoaSerial } from '../ApacheDNS-Schema/apacheDnsSoaSerial.oa';
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
export { apacheDnsClass } from '../ApacheDNS-Schema/apacheDnsClass.oa';
export { apacheDnsSoaExpire } from '../ApacheDNS-Schema/apacheDnsSoaExpire.oa';
export { apacheDnsSoaMinimum } from '../ApacheDNS-Schema/apacheDnsSoaMinimum.oa';
export { apacheDnsSoaMName } from '../ApacheDNS-Schema/apacheDnsSoaMName.oa';
export { apacheDnsSoaRefresh } from '../ApacheDNS-Schema/apacheDnsSoaRefresh.oa';
export { apacheDnsSoaRetry } from '../ApacheDNS-Schema/apacheDnsSoaRetry.oa';
export { apacheDnsSoaRName } from '../ApacheDNS-Schema/apacheDnsSoaRName.oa';
export { apacheDnsSoaSerial } from '../ApacheDNS-Schema/apacheDnsSoaSerial.oa';

/* START_OF_SYMBOL_DEFINITION apacheDnsStartOfAuthorityRecord */
/**
 * @summary apacheDnsStartOfAuthorityRecord
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * apacheDnsStartOfAuthorityRecord OBJECT-CLASS ::= {
 *     SUBCLASS OF     {apacheDnsAbstractRecord}
 *     KIND            structural
 *     MUST CONTAIN    {apacheDnsSoaMName | apacheDnsSoaRName | apacheDnsSoaMinimum}
 *     MAY CONTAIN     {apacheDnsClass | apacheDnsSoaSerial | apacheDnsSoaRefresh | apacheDnsSoaRetry | apacheDnsSoaExpire}
 *     LDAP-NAME       {"apacheDnsStartOfAuthorityRecord"}
 *     LDAP-DESC       "A start of authority SOA record"
 *     ID              { 1 3 6 1 4 1 18060 0 4 2 3 5 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const apacheDnsStartOfAuthorityRecord: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [apacheDnsAbstractRecord] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        apacheDnsSoaMName,
        apacheDnsSoaRName,
        apacheDnsSoaMinimum,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        apacheDnsClass,
        apacheDnsSoaSerial,
        apacheDnsSoaRefresh,
        apacheDnsSoaRetry,
        apacheDnsSoaExpire,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['apacheDnsStartOfAuthorityRecord'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'A start of authority SOA record' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 2, 3, 5,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION apacheDnsStartOfAuthorityRecord */

/* eslint-enable */
