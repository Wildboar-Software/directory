/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ads_jdbmPartitionOptimizerEnabled } from '../ApacheDirectoryConfig/ads-jdbmPartitionOptimizerEnabled.oa';
import { ads_partition } from '../ApacheDirectoryConfig/ads-partition.oa';
import { ads_partitionCacheSize } from '../ApacheDirectoryConfig/ads-partitionCacheSize.oa';
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
export { ads_jdbmPartitionOptimizerEnabled } from '../ApacheDirectoryConfig/ads-jdbmPartitionOptimizerEnabled.oa';
export { ads_partition } from '../ApacheDirectoryConfig/ads-partition.oa';
export { ads_partitionCacheSize } from '../ApacheDirectoryConfig/ads-partitionCacheSize.oa';

/* START_OF_SYMBOL_DEFINITION ads_jdbmPartition */
/**
 * @summary ads_jdbmPartition
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-jdbmPartition OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-partition}
 *     MAY CONTAIN     {ads-partitionCacheSize | ads-jdbmPartitionOptimizerEnabled}
 *     LDAP-NAME       {"ads-jdbmPartition"}
 *     LDAP-DESC       "A JDBM partition"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 151 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_jdbmPartition: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_partition] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        ads_partitionCacheSize,
        ads_jdbmPartitionOptimizerEnabled,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-jdbmPartition'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'A JDBM partition' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 151,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_jdbmPartition */

/* eslint-enable */
