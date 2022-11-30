/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ads_base } from '../ApacheDirectoryConfig/ads-base.oa';
import { ads_interceptorClassName } from '../ApacheDirectoryConfig/ads-interceptorClassName.oa';
import { ads_interceptorId } from '../ApacheDirectoryConfig/ads-interceptorId.oa';
import { ads_interceptorOrder } from '../ApacheDirectoryConfig/ads-interceptorOrder.oa';
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
export { ads_interceptorClassName } from '../ApacheDirectoryConfig/ads-interceptorClassName.oa';
export { ads_interceptorId } from '../ApacheDirectoryConfig/ads-interceptorId.oa';
export { ads_interceptorOrder } from '../ApacheDirectoryConfig/ads-interceptorOrder.oa';

/* START_OF_SYMBOL_DEFINITION ads_interceptor */
/**
 * @summary ads_interceptor
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-interceptor OBJECT-CLASS ::= {
 *     SUBCLASS OF     {ads-base}
 *     MUST CONTAIN    {
 *         ads-interceptorId
 *         | ads-interceptorOrder
 *         | ads-interceptorClassName
 *     }
 *     LDAP-NAME       {"ads-interceptor"}
 *     LDAP-DESC       "The Interceptor ObjectClass"
 *     ID              { 1 3 6 1 4 1 18060 0 4 1 3 130 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ads_interceptor: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [ads_base] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        ads_interceptorId,
        ads_interceptorOrder,
        ads_interceptorClassName,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-interceptor'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'The Interceptor ObjectClass' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 3, 130,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ads_interceptor */

/* eslint-enable */
