/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { co_oc } from '../H323-X500-Schema/co-oc.va';
import { commOwner } from '../H323-X500-Schema/commOwner.oa';
import { commPrivate } from '../H323-X500-Schema/commPrivate.oa';
import { commUniqueId } from '../H323-X500-Schema/commUniqueId.oa';
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
export { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
export { co_oc } from '../H323-X500-Schema/co-oc.va';
export { commOwner } from '../H323-X500-Schema/commOwner.oa';
export { commPrivate } from '../H323-X500-Schema/commPrivate.oa';
export { commUniqueId } from '../H323-X500-Schema/commUniqueId.oa';

/* START_OF_SYMBOL_DEFINITION commObject */
/**
 * @summary commObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * commObject OBJECT-CLASS ::= {
 *   SUBCLASS OF   {top}
 *   MUST CONTAIN  {commUniqueId}
 *   MAY CONTAIN   {commOwner | commPrivate}
 *   ID            {co-oc  1}
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const commObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commUniqueId] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [commOwner, commPrivate] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [1],
        co_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION commObject */

/* eslint-enable */
