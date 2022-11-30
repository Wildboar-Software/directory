/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiBusinessKey } from '../UDDI-Schema/uddiBusinessKey.oa';
import { uddiCategoryBag } from '../UDDI-Schema/uddiCategoryBag.oa';
import { uddiDescription } from '../UDDI-Schema/uddiDescription.oa';
import { uddiIsProjection } from '../UDDI-Schema/uddiIsProjection.oa';
import { uddiName } from '../UDDI-Schema/uddiName.oa';
import { uddiServiceKey } from '../UDDI-Schema/uddiServiceKey.oa';
import { uddiv3BusinessKey } from '../UDDI-Schema/uddiv3BusinessKey.oa';
import { uddiv3DigitalSignature } from '../UDDI-Schema/uddiv3DigitalSignature.oa';
import { uddiv3EntityCreationTime } from '../UDDI-Schema/uddiv3EntityCreationTime.oa';
import { uddiv3EntityModificationTime } from '../UDDI-Schema/uddiv3EntityModificationTime.oa';
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
export { uddiBusinessKey } from '../UDDI-Schema/uddiBusinessKey.oa';
export { uddiCategoryBag } from '../UDDI-Schema/uddiCategoryBag.oa';
export { uddiDescription } from '../UDDI-Schema/uddiDescription.oa';
export { uddiIsProjection } from '../UDDI-Schema/uddiIsProjection.oa';
export { uddiName } from '../UDDI-Schema/uddiName.oa';
export { uddiServiceKey } from '../UDDI-Schema/uddiServiceKey.oa';
export { uddiv3BusinessKey } from '../UDDI-Schema/uddiv3BusinessKey.oa';
export { uddiv3DigitalSignature } from '../UDDI-Schema/uddiv3DigitalSignature.oa';
export { uddiv3EntityCreationTime } from '../UDDI-Schema/uddiv3EntityCreationTime.oa';
export { uddiv3EntityModificationTime } from '../UDDI-Schema/uddiv3EntityModificationTime.oa';
export { uddiv3NodeId } from '../UDDI-Schema/uddiv3NodeId.oa';
export { uddiv3ServiceKey } from '../UDDI-Schema/uddiv3ServiceKey.oa';

/* START_OF_SYMBOL_DEFINITION uddiBusinessService */
/**
 * @summary uddiBusinessService
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiBusinessService OBJECT-CLASS ::= {
 *     SUBCLASS OF     { top }
 *     KIND            structural
 *     MUST CONTAIN    {uddiServiceKey}
 *     MAY CONTAIN     {
 *         uddiName
 *         | uddiBusinessKey
 *         | uddiDescription
 *         | uddiCategoryBag
 *         | uddiIsProjection
 *         | uddiv3ServiceKey
 *         | uddiv3BusinessKey
 *         | uddiv3DigitalSignature
 *         | uddiv3EntityCreationTime
 *         | uddiv3EntityModificationTime
 *         | uddiv3NodeId
 *     }
 *     LDAP-NAME       {"uddiBusinessService"}
 *     ID              { id-uddi 6 4 } }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const uddiBusinessService: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uddiServiceKey] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        uddiName,
        uddiBusinessKey,
        uddiDescription,
        uddiCategoryBag,
        uddiIsProjection,
        uddiv3ServiceKey,
        uddiv3BusinessKey,
        uddiv3DigitalSignature,
        uddiv3EntityCreationTime,
        uddiv3EntityModificationTime,
        uddiv3NodeId,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiBusinessService'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [6, 4],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiBusinessService */

/* eslint-enable */
