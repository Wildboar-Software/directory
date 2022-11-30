/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ads_base } from '../ApacheDirectoryConfig/ads-base.oa';
import { ads_indexAttributeId } from '../ApacheDirectoryConfig/ads-indexAttributeId.oa';
import { ads_indexHasReverse } from '../ApacheDirectoryConfig/ads-indexHasReverse.oa';
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
export { ads_indexAttributeId } from '../ApacheDirectoryConfig/ads-indexAttributeId.oa';
export { ads_indexHasReverse } from '../ApacheDirectoryConfig/ads-indexHasReverse.oa';

/* START_OF_SYMBOL_DEFINITION ads_index */
/**
 * @summary ads_index
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-index OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-base}
 *     KIND            abstract
 *     MUST CONTAIN    {ads-indexAttributeId | ads-indexHasReverse}
 *     LDAP-NAME       {"ads-index"}
 *     LDAP-DESC       "A generic indexed attribute"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 160 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_index: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_base] /* OBJECT_FIELD_SETTING */,
    '&kind': abstract /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        ads_indexAttributeId,
        ads_indexHasReverse,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-index'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'A generic indexed attribute' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 160,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_index */

/* eslint-enable */
