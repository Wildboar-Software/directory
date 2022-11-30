/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { genericIdentityMessage } from '../H323-X500-Schema/genericIdentityMessage.oa';
import { genericIdentityProtocolIdentifier } from '../H323-X500-Schema/genericIdentityProtocolIdentifier.oa';
import { gi_oc } from '../H323-X500-Schema/gi-oc.va';
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
export { genericIdentityMessage } from '../H323-X500-Schema/genericIdentityMessage.oa';
export { genericIdentityProtocolIdentifier } from '../H323-X500-Schema/genericIdentityProtocolIdentifier.oa';
export { gi_oc } from '../H323-X500-Schema/gi-oc.va';

/* START_OF_SYMBOL_DEFINITION genericIdentity */
/**
 * @summary genericIdentity
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * genericIdentity OBJECT-CLASS ::= {
 *   SUBCLASS OF  {top}
 *   MAY CONTAIN  {genericIdentityProtocolIdentifier | genericIdentityMessage}
 *   ID           {gi-oc  1}
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const genericIdentity: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        genericIdentityProtocolIdentifier,
        genericIdentityMessage,
    ] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [1],
        gi_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION genericIdentity */

/* eslint-enable */
