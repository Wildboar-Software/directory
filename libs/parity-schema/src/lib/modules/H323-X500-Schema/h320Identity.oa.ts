/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { h320_id_oc } from '../H323-X500-Schema/h320-id-oc.va';
import { h320IdentityCC } from '../H323-X500-Schema/h320IdentityCC.oa';
import { h320IdentityExtension } from '../H323-X500-Schema/h320IdentityExtension.oa';
import { h320IdentityNDC } from '../H323-X500-Schema/h320IdentityNDC.oa';
import { h320IdentityServiceLevel } from '../H323-X500-Schema/h320IdentityServiceLevel.oa';
import { h320IdentitySN } from '../H323-X500-Schema/h320IdentitySN.oa';
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
export { top } from '@wildboar/x500/InformationFramework';
export { h320_id_oc } from '../H323-X500-Schema/h320-id-oc.va';
export { h320IdentityCC } from '../H323-X500-Schema/h320IdentityCC.oa';
export { h320IdentityExtension } from '../H323-X500-Schema/h320IdentityExtension.oa';
export { h320IdentityNDC } from '../H323-X500-Schema/h320IdentityNDC.oa';
export { h320IdentityServiceLevel } from '../H323-X500-Schema/h320IdentityServiceLevel.oa';
export { h320IdentitySN } from '../H323-X500-Schema/h320IdentitySN.oa';

/* START_OF_SYMBOL_DEFINITION h320Identity */
/**
 * @summary h320Identity
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * h320Identity OBJECT-CLASS ::= {
 *   SUBCLASS OF  {top}
 *   MAY CONTAIN
 *     {h320IdentityCC | h320IdentityNDC | h320IdentitySN |
 *       h320IdentityServiceLevel | h320IdentityExtension}
 *   ID           {h320-id-oc  1}
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const h320Identity: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        h320IdentityCC,
        h320IdentityNDC,
        h320IdentitySN,
        h320IdentityServiceLevel,
        h320IdentityExtension,
    ] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [1],
        h320_id_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION h320Identity */

/* eslint-enable */
