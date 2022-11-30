/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiAccessPoint } from '../UDDI-Schema/uddiAccessPoint.oa';
import { uddiBindingKey } from '../UDDI-Schema/uddiBindingKey.oa';
import { uddiCategoryBag } from '../UDDI-Schema/uddiCategoryBag.oa';
import { uddiDescription } from '../UDDI-Schema/uddiDescription.oa';
import { uddiHostingRedirector } from '../UDDI-Schema/uddiHostingRedirector.oa';
import { uddiServiceKey } from '../UDDI-Schema/uddiServiceKey.oa';
import { uddiv3BindingKey } from '../UDDI-Schema/uddiv3BindingKey.oa';
import { uddiv3DigitalSignature } from '../UDDI-Schema/uddiv3DigitalSignature.oa';
import { uddiv3EntityCreationTime } from '../UDDI-Schema/uddiv3EntityCreationTime.oa';
import { uddiv3NodeId } from '../UDDI-Schema/uddiv3NodeId.oa';
import { uddiv3ServiceKey } from '../UDDI-Schema/uddiv3ServiceKey.oa';
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
export { uddiAccessPoint } from '../UDDI-Schema/uddiAccessPoint.oa';
export { uddiBindingKey } from '../UDDI-Schema/uddiBindingKey.oa';
export { uddiCategoryBag } from '../UDDI-Schema/uddiCategoryBag.oa';
export { uddiDescription } from '../UDDI-Schema/uddiDescription.oa';
export { uddiHostingRedirector } from '../UDDI-Schema/uddiHostingRedirector.oa';
export { uddiServiceKey } from '../UDDI-Schema/uddiServiceKey.oa';
export { uddiv3BindingKey } from '../UDDI-Schema/uddiv3BindingKey.oa';
export { uddiv3DigitalSignature } from '../UDDI-Schema/uddiv3DigitalSignature.oa';
export { uddiv3EntityCreationTime } from '../UDDI-Schema/uddiv3EntityCreationTime.oa';
export { uddiv3NodeId } from '../UDDI-Schema/uddiv3NodeId.oa';
export { uddiv3ServiceKey } from '../UDDI-Schema/uddiv3ServiceKey.oa';

/* START_OF_SYMBOL_DEFINITION uddiBindingTemplate */
/**
 * @summary uddiBindingTemplate
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiBindingTemplate OBJECT-CLASS ::= {
 *     SUBCLASS OF     { top }
 *     KIND            structural
 *     MUST CONTAIN    {uddiBindingKey}
 *     MAY CONTAIN     {
 *         uddiServiceKey
 *         | uddiDescription
 *         | uddiAccessPoint
 *         | uddiHostingRedirector
 *         | uddiCategoryBag
 *         | uddiv3BindingKey
 *         | uddiv3ServiceKey
 *         | uddiv3DigitalSignature
 *         | uddiv3EntityCreationTime
 *         | uddiv3NodeId
 *     }
 *     LDAP-NAME       {"uddiBindingTemplate"}
 *     ID              { id-uddi 6 5 } }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const uddiBindingTemplate: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uddiBindingKey] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        uddiServiceKey,
        uddiDescription,
        uddiAccessPoint,
        uddiHostingRedirector,
        uddiCategoryBag,
        uddiv3BindingKey,
        uddiv3ServiceKey,
        uddiv3DigitalSignature,
        uddiv3EntityCreationTime,
        uddiv3NodeId,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiBindingTemplate'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [6, 5],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiBindingTemplate */

/* eslint-enable */
