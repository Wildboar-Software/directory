/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ads_base } from '../ApacheDirectoryConfig/ads-base.oa';
import { ads_dsReplicaId } from '../ApacheDirectoryConfig/ads-dsReplicaId.oa';
import { ads_replCookie } from './ads-replCookie.oa';
import { ads_replLogMaxIdle } from './ads-replLogMaxIdle.oa';
import { ads_replLogPurgeThresholdCount } from './ads-replLogPurgeThresholdCount.oa';
import { ads_replRefreshNPersist } from './ads-replRefreshNPersist.oa';
import { ads_replSearchFilter } from './ads-replSearchFilter.oa';
import { ads_searchBaseDN } from './ads-searchBaseDN.oa';
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
export { ads_base } from '../ApacheDirectoryConfig/ads-base.oa';
export { ads_dsReplicaId } from '../ApacheDirectoryConfig/ads-dsReplicaId.oa';

/* START_OF_SYMBOL_DEFINITION ads_replEventLog */
/**
 * @summary ads_replEventLog
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-replEventLog OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-base}
 *     MUST CONTAIN    {
 *         ads-dsReplicaId
 *         -- | ads-replAliasDerefMode
 *         | ads-searchBaseDN
 *         -- | ads-replSearchScope
 *         | ads-replSearchFilter
 *         | ads-replRefreshNPersist
 *         | ads-replLogMaxIdle
 *         | ads-replLogPurgeThresholdCount
 *     }
 *     MAY CONTAIN     {
 *         -- ads-replLastSentCsn |
 *         ads-replCookie
 *     }
 *     LDAP-NAME       {"ads-replEventLog"}
 *     LDAP-DESC       "class to hold a replication consumer event log details"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 805 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_replEventLog: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_base] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        ads_dsReplicaId,
        ads_searchBaseDN,
        ads_replSearchFilter,
        ads_replRefreshNPersist,
        ads_replLogMaxIdle,
        ads_replLogPurgeThresholdCount,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [ads_replCookie] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-replEventLog'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'class to hold a replication consumer event log details' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 805,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_replEventLog */

/* eslint-enable */
