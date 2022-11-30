/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ads_hashAlgorithm } from '../ApacheDirectoryConfig/ads-hashAlgorithm.oa';
import { ads_hashAttribute } from '../ApacheDirectoryConfig/ads-hashAttribute.oa';
import { ads_interceptor } from '../ApacheDirectoryConfig/ads-interceptor.oa';
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
export { ads_hashAlgorithm } from '../ApacheDirectoryConfig/ads-hashAlgorithm.oa';
export { ads_hashAttribute } from '../ApacheDirectoryConfig/ads-hashAttribute.oa';
export { ads_interceptor } from '../ApacheDirectoryConfig/ads-interceptor.oa';

/* START_OF_SYMBOL_DEFINITION ads_hashInterceptor */
/**
 * @summary ads_hashInterceptor
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-hashInterceptor OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-interceptor}
 *     MAY CONTAIN     {ads-hashAlgorithm | ads-hashAttribute}
 *     LDAP-NAME       {"ads-hashInterceptor"}
 *     LDAP-DESC       "The HashInterceptor ObjectClass"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 132 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_hashInterceptor: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_interceptor] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        ads_hashAlgorithm,
        ads_hashAttribute,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-hashInterceptor'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'The HashInterceptor ObjectClass' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 132,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_hashInterceptor */

/* eslint-enable */
