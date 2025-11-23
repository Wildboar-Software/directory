/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ads_enabled } from '../ApacheDirectoryConfig/ads-enabled.oa';
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
export { description } from '@wildboar/x500/SelectedAttributeTypes';
export { ads_enabled } from '../ApacheDirectoryConfig/ads-enabled.oa';

/* START_OF_SYMBOL_DEFINITION ads_base */
/**
 * @summary ads_base
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-base OBJECT-CLASS ::= {
 *     KIND            abstract
 *     MAY CONTAIN     {ads-enabled | description}
 *     LDAP-NAME       {"ads-base"}
 *     LDAP-DESC       "The base bean"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 0 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_base: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&kind': abstract /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        ads_enabled,
        description,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-base'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'The base bean' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 0,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_base */

/* eslint-enable */
