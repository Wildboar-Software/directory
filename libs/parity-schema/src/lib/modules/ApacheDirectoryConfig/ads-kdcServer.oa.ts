/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ads_dsBasedServer } from '../ApacheDirectoryConfig/ads-dsBasedServer.oa';
import { ads_krbAllowableClockSkew } from '../ApacheDirectoryConfig/ads-krbAllowableClockSkew.oa';
import { ads_krbBodyChecksumVerified } from '../ApacheDirectoryConfig/ads-krbBodyChecksumVerified.oa';
import { ads_krbEmptyAddressesAllowed } from '../ApacheDirectoryConfig/ads-krbEmptyAddressesAllowed.oa';
import { ads_krbEncryptionTypes } from '../ApacheDirectoryConfig/ads-krbEncryptionTypes.oa';
import { ads_krbForwardableAllowed } from '../ApacheDirectoryConfig/ads-krbForwardableAllowed.oa';
import { ads_krbMaximumRenewableLifetime } from '../ApacheDirectoryConfig/ads-krbMaximumRenewableLifetime.oa';
import { ads_krbMaximumTicketLifetime } from '../ApacheDirectoryConfig/ads-krbMaximumTicketLifetime.oa';
import { ads_krbPaEncTimestampRequired } from '../ApacheDirectoryConfig/ads-krbPaEncTimestampRequired.oa';
import { ads_krbPostdatedAllowed } from '../ApacheDirectoryConfig/ads-krbPostdatedAllowed.oa';
import { ads_krbPrimaryRealm } from '../ApacheDirectoryConfig/ads-krbPrimaryRealm.oa';
import { ads_krbProxiableAllowed } from '../ApacheDirectoryConfig/ads-krbProxiableAllowed.oa';
import { ads_krbRenewableAllowed } from '../ApacheDirectoryConfig/ads-krbRenewableAllowed.oa';
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
export { ads_dsBasedServer } from '../ApacheDirectoryConfig/ads-dsBasedServer.oa';
export { ads_krbAllowableClockSkew } from '../ApacheDirectoryConfig/ads-krbAllowableClockSkew.oa';
export { ads_krbBodyChecksumVerified } from '../ApacheDirectoryConfig/ads-krbBodyChecksumVerified.oa';
export { ads_krbEmptyAddressesAllowed } from '../ApacheDirectoryConfig/ads-krbEmptyAddressesAllowed.oa';
export { ads_krbEncryptionTypes } from '../ApacheDirectoryConfig/ads-krbEncryptionTypes.oa';
export { ads_krbForwardableAllowed } from '../ApacheDirectoryConfig/ads-krbForwardableAllowed.oa';
export { ads_krbMaximumRenewableLifetime } from '../ApacheDirectoryConfig/ads-krbMaximumRenewableLifetime.oa';
export { ads_krbMaximumTicketLifetime } from '../ApacheDirectoryConfig/ads-krbMaximumTicketLifetime.oa';
export { ads_krbPaEncTimestampRequired } from '../ApacheDirectoryConfig/ads-krbPaEncTimestampRequired.oa';
export { ads_krbPostdatedAllowed } from '../ApacheDirectoryConfig/ads-krbPostdatedAllowed.oa';
export { ads_krbPrimaryRealm } from '../ApacheDirectoryConfig/ads-krbPrimaryRealm.oa';
export { ads_krbProxiableAllowed } from '../ApacheDirectoryConfig/ads-krbProxiableAllowed.oa';
export { ads_krbRenewableAllowed } from '../ApacheDirectoryConfig/ads-krbRenewableAllowed.oa';

/* START_OF_SYMBOL_DEFINITION ads_kdcServer */
/**
 * @summary ads_kdcServer
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-kdcServer OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-dsBasedServer}
 *     MUST CONTAIN    {
 *         ads-krbAllowableClockSkew
 *         | ads-krbEncryptionTypes
 *         | ads-krbEmptyAddressesAllowed
 *         | ads-krbForwardableAllowed
 *         | ads-krbPaEncTimestampRequired
 *         | ads-krbPostdatedAllowed
 *         | ads-krbProxiableAllowed
 *         | ads-krbRenewableAllowed
 *         | ads-krbMaximumRenewableLifetime
 *         | ads-krbMaximumTicketLifetime
 *         | ads-krbPrimaryRealm
 *         | ads-krbBodyChecksumVerified
 *     }
 *     LDAP-NAME       {"ads-kdcServer"}
 *     LDAP-DESC       "The KerberosServer ObjectClass"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 400 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_kdcServer: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_dsBasedServer] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        ads_krbAllowableClockSkew,
        ads_krbEncryptionTypes,
        ads_krbEmptyAddressesAllowed,
        ads_krbForwardableAllowed,
        ads_krbPaEncTimestampRequired,
        ads_krbPostdatedAllowed,
        ads_krbProxiableAllowed,
        ads_krbRenewableAllowed,
        ads_krbMaximumRenewableLifetime,
        ads_krbMaximumTicketLifetime,
        ads_krbPrimaryRealm,
        ads_krbBodyChecksumVerified,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-kdcServer'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'The KerberosServer ObjectClass' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 400,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_kdcServer */

/* eslint-enable */
