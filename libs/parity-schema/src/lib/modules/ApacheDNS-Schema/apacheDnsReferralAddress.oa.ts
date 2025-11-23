/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { apacheDnsAbstractRecord } from '../ApacheDNS-Schema/apacheDnsAbstractRecord.oa';
import { apacheDnsDomainName } from '../ApacheDNS-Schema/apacheDnsDomainName.oa';
import { apacheDnsIpAddress } from '../ApacheDNS-Schema/apacheDnsIpAddress.oa';
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
export { apacheDnsAbstractRecord } from '../ApacheDNS-Schema/apacheDnsAbstractRecord.oa';
export { apacheDnsDomainName } from '../ApacheDNS-Schema/apacheDnsDomainName.oa';
export { apacheDnsIpAddress } from '../ApacheDNS-Schema/apacheDnsIpAddress.oa';

/* START_OF_SYMBOL_DEFINITION apacheDnsReferralAddress */
/**
 * @summary apacheDnsReferralAddress
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * apacheDnsReferralAddress OBJECT-CLASS ::= {
 *     SUBCLASS OF     {apacheDnsAbstractRecord}
 *     KIND            structural
 *     MUST CONTAIN    {apacheDnsDomainName | apacheDnsIpAddress}
 *     LDAP-NAME       {"apacheDnsReferralAddress"}
 *     LDAP-DESC       "A non-authoritative referral or glue address record"
 *     ID              { 1 3 6 1 4 1 18060 0 4 2 3 11 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const apacheDnsReferralAddress: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [apacheDnsAbstractRecord] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        apacheDnsDomainName,
        apacheDnsIpAddress,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['apacheDnsReferralAddress'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'A non-authoritative referral or glue address record' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 2, 3, 11,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION apacheDnsReferralAddress */

/* eslint-enable */
