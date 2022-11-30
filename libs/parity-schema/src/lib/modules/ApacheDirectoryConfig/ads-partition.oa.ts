/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ads_base } from '../ApacheDirectoryConfig/ads-base.oa';
import { ads_contextEntry } from '../ApacheDirectoryConfig/ads-contextEntry.oa';
import { ads_partitionId } from '../ApacheDirectoryConfig/ads-partitionId.oa';
import { ads_partitionSuffix } from '../ApacheDirectoryConfig/ads-partitionSuffix.oa';
import { ads_partitionSyncOnWrite } from '../ApacheDirectoryConfig/ads-partitionSyncOnWrite.oa';
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
export { ads_contextEntry } from '../ApacheDirectoryConfig/ads-contextEntry.oa';
export { ads_partitionId } from '../ApacheDirectoryConfig/ads-partitionId.oa';
export { ads_partitionSuffix } from '../ApacheDirectoryConfig/ads-partitionSuffix.oa';
export { ads_partitionSyncOnWrite } from '../ApacheDirectoryConfig/ads-partitionSyncOnWrite.oa';

/* START_OF_SYMBOL_DEFINITION ads_partition */
/**
 * @summary ads_partition
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-partition OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-base}
 *     KIND            abstract
 *     MUST CONTAIN    {ads-partitionId | ads-partitionSuffix}
 *     MAY CONTAIN     {ads-contextEntry | ads-partitionSyncOnWrite}
 *     LDAP-NAME       {"ads-partition"}
 *     LDAP-DESC       "A generic partition"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 150 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_partition: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_base] /* OBJECT_FIELD_SETTING */,
    '&kind': abstract /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        ads_partitionId,
        ads_partitionSuffix,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        ads_contextEntry,
        ads_partitionSyncOnWrite,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-partition'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'A generic partition' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 150,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_partition */

/* eslint-enable */
