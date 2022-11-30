/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiFromKey } from '../UDDI-Schema/uddiFromKey.oa';
import { uddiKeyedReference } from '../UDDI-Schema/uddiKeyedReference.oa';
import { uddiToKey } from '../UDDI-Schema/uddiToKey.oa';
import { uddiUUID } from '../UDDI-Schema/uddiUUID.oa';
import { uddiv3DigitalSignature } from '../UDDI-Schema/uddiv3DigitalSignature.oa';
import { uddiv3NodeId } from '../UDDI-Schema/uddiv3NodeId.oa';
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
export { id_uddi } from '../UDDI-Schema/id-uddi.va';
export { uddiFromKey } from '../UDDI-Schema/uddiFromKey.oa';
export { uddiKeyedReference } from '../UDDI-Schema/uddiKeyedReference.oa';
export { uddiToKey } from '../UDDI-Schema/uddiToKey.oa';
export { uddiUUID } from '../UDDI-Schema/uddiUUID.oa';
export { uddiv3DigitalSignature } from '../UDDI-Schema/uddiv3DigitalSignature.oa';
export { uddiv3NodeId } from '../UDDI-Schema/uddiv3NodeId.oa';

/* START_OF_SYMBOL_DEFINITION uddiPublisherAssertion */
/**
 * @summary uddiPublisherAssertion
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiPublisherAssertion OBJECT-CLASS ::= {
 *     SUBCLASS OF     { top }
 *     KIND            structural
 *     MUST CONTAIN    {uddiFromKey | uddiToKey | uddiKeyedReference | uddiUUID}
 *     MAY CONTAIN     {uddiv3DigitalSignature | uddiv3NodeId}
 *     LDAP-NAME       {"uddiPublisherAssertion"}
 *     ID              { id-uddi 6 8 } }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const uddiPublisherAssertion: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        uddiFromKey,
        uddiToKey,
        uddiKeyedReference,
        uddiUUID,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        uddiv3DigitalSignature,
        uddiv3NodeId,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiPublisherAssertion'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [6, 8],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiPublisherAssertion */

/* eslint-enable */
