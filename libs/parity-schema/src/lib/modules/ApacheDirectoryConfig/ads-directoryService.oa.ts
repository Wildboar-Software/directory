/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ads_base } from '../ApacheDirectoryConfig/ads-base.oa';
import { ads_directoryServiceId } from '../ApacheDirectoryConfig/ads-directoryServiceId.oa';
import { ads_dsAccessControlEnabled } from '../ApacheDirectoryConfig/ads-dsAccessControlEnabled.oa';
import { ads_dsAllowAnonymousAccess } from '../ApacheDirectoryConfig/ads-dsAllowAnonymousAccess.oa';
import { ads_dsDenormalizeOpAttrsEnabled } from '../ApacheDirectoryConfig/ads-dsDenormalizeOpAttrsEnabled.oa';
import { ads_dsPasswordHidden } from '../ApacheDirectoryConfig/ads-dsPasswordHidden.oa';
import { ads_dsReplicaId } from '../ApacheDirectoryConfig/ads-dsReplicaId.oa';
import { ads_dsSyncPeriodMillis } from '../ApacheDirectoryConfig/ads-dsSyncPeriodMillis.oa';
import { ads_dsTestEntries } from '../ApacheDirectoryConfig/ads-dsTestEntries.oa';
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
export { ads_base } from '../ApacheDirectoryConfig/ads-base.oa';
export { ads_directoryServiceId } from '../ApacheDirectoryConfig/ads-directoryServiceId.oa';
export { ads_dsAccessControlEnabled } from '../ApacheDirectoryConfig/ads-dsAccessControlEnabled.oa';
export { ads_dsAllowAnonymousAccess } from '../ApacheDirectoryConfig/ads-dsAllowAnonymousAccess.oa';
export { ads_dsDenormalizeOpAttrsEnabled } from '../ApacheDirectoryConfig/ads-dsDenormalizeOpAttrsEnabled.oa';
export { ads_dsPasswordHidden } from '../ApacheDirectoryConfig/ads-dsPasswordHidden.oa';
export { ads_dsReplicaId } from '../ApacheDirectoryConfig/ads-dsReplicaId.oa';
export { ads_dsSyncPeriodMillis } from '../ApacheDirectoryConfig/ads-dsSyncPeriodMillis.oa';
export { ads_dsTestEntries } from '../ApacheDirectoryConfig/ads-dsTestEntries.oa';

/* START_OF_SYMBOL_DEFINITION ads_directoryService */
/**
 * @summary ads_directoryService
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-directoryService OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-base}
 *     MUST CONTAIN    {
 *         ads-directoryServiceId
 *         | ads-dsReplicaId
 *         | ads-dsAccessControlEnabled
 *         | ads-dsAllowAnonymousAccess
 *         | ads-dsDenormalizeOpAttrsEnabled
 *         | ads-dsPasswordHidden
 *         | ads-dsSyncPeriodMillis
 *     }
 *     MAY CONTAIN     {ads-dsTestEntries}
 *     LDAP-NAME       {"ads-directoryService"}
 *     LDAP-DESC       "The DirectoryService ObjectClass"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 100 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_directoryService: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_base] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        ads_directoryServiceId,
        ads_dsReplicaId,
        ads_dsAccessControlEnabled,
        ads_dsAllowAnonymousAccess,
        ads_dsDenormalizeOpAttrsEnabled,
        ads_dsPasswordHidden,
        ads_dsSyncPeriodMillis,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [ads_dsTestEntries] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-directoryService'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'The DirectoryService ObjectClass' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 100,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_directoryService */

/* eslint-enable */
