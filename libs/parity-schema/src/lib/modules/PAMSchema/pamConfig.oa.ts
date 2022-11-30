/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { pamExcludeSuffix } from '../PAMSchema/pamExcludeSuffix.oa';
import { pamFallback } from '../PAMSchema/pamFallback.oa';
import { pamFilter } from '../PAMSchema/pamFilter.oa';
import { pamIDAttr } from '../PAMSchema/pamIDAttr.oa';
import { pamIDMapMethod } from '../PAMSchema/pamIDMapMethod.oa';
import { pamIncludeSuffix } from '../PAMSchema/pamIncludeSuffix.oa';
import { pamMissingSuffix } from '../PAMSchema/pamMissingSuffix.oa';
import { pamSecure } from '../PAMSchema/pamSecure.oa';
import { pamService } from '../PAMSchema/pamService.oa';
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
export { pamExcludeSuffix } from '../PAMSchema/pamExcludeSuffix.oa';
export { pamFallback } from '../PAMSchema/pamFallback.oa';
export { pamFilter } from '../PAMSchema/pamFilter.oa';
export { pamIDAttr } from '../PAMSchema/pamIDAttr.oa';
export { pamIDMapMethod } from '../PAMSchema/pamIDMapMethod.oa';
export { pamIncludeSuffix } from '../PAMSchema/pamIncludeSuffix.oa';
export { pamMissingSuffix } from '../PAMSchema/pamMissingSuffix.oa';
export { pamSecure } from '../PAMSchema/pamSecure.oa';
export { pamService } from '../PAMSchema/pamService.oa';

/* START_OF_SYMBOL_DEFINITION pamConfig */
/**
 * @summary pamConfig
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pamConfig OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MAY CONTAIN     {
 *         commonName
 *         | pamMissingSuffix
 *         | pamExcludeSuffix
 *         | pamIncludeSuffix
 *         | pamIDAttr
 *         | pamIDMapMethod
 *         | pamFallback
 *         | pamSecure
 *         | pamService
 *         | pamFilter
 *     }
 *     LDAP-NAME       {"pamConfig"}
 *     LDAP-DESC       "PAM plugin configuration"
 *     ID              { 2 16 840 1 113730 3 2 318 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const pamConfig: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        commonName,
        pamMissingSuffix,
        pamExcludeSuffix,
        pamIncludeSuffix,
        pamIDAttr,
        pamIDMapMethod,
        pamFallback,
        pamSecure,
        pamService,
        pamFilter,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['pamConfig'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'PAM plugin configuration' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        2, 16, 840, 1, 113730, 3, 2, 318,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pamConfig */

/* eslint-enable */
