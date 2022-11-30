/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiAuthorizedName } from '../UDDI-Schema/uddiAuthorizedName.oa';
import { uddiCategoryBag } from '../UDDI-Schema/uddiCategoryBag.oa';
import { uddiDescription } from '../UDDI-Schema/uddiDescription.oa';
import { uddiIdentifierBag } from '../UDDI-Schema/uddiIdentifierBag.oa';
import { uddiIsHidden } from '../UDDI-Schema/uddiIsHidden.oa';
import { uddiName } from '../UDDI-Schema/uddiName.oa';
import { uddiOperator } from '../UDDI-Schema/uddiOperator.oa';
import { uddiOverviewDescription } from '../UDDI-Schema/uddiOverviewDescription.oa';
import { uddiOverviewURL } from '../UDDI-Schema/uddiOverviewURL.oa';
import { uddiTModelKey } from '../UDDI-Schema/uddiTModelKey.oa';
import { uddiv3DigitalSignature } from '../UDDI-Schema/uddiv3DigitalSignature.oa';
import { uddiv3NodeId } from '../UDDI-Schema/uddiv3NodeId.oa';
import { uddiv3TModelKey } from '../UDDI-Schema/uddiv3TModelKey.oa';
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
export { uddiAuthorizedName } from '../UDDI-Schema/uddiAuthorizedName.oa';
export { uddiCategoryBag } from '../UDDI-Schema/uddiCategoryBag.oa';
export { uddiDescription } from '../UDDI-Schema/uddiDescription.oa';
export { uddiIdentifierBag } from '../UDDI-Schema/uddiIdentifierBag.oa';
export { uddiIsHidden } from '../UDDI-Schema/uddiIsHidden.oa';
export { uddiName } from '../UDDI-Schema/uddiName.oa';
export { uddiOperator } from '../UDDI-Schema/uddiOperator.oa';
export { uddiOverviewDescription } from '../UDDI-Schema/uddiOverviewDescription.oa';
export { uddiOverviewURL } from '../UDDI-Schema/uddiOverviewURL.oa';
export { uddiTModelKey } from '../UDDI-Schema/uddiTModelKey.oa';
export { uddiv3DigitalSignature } from '../UDDI-Schema/uddiv3DigitalSignature.oa';
export { uddiv3NodeId } from '../UDDI-Schema/uddiv3NodeId.oa';
export { uddiv3TModelKey } from '../UDDI-Schema/uddiv3TModelKey.oa';

/* START_OF_SYMBOL_DEFINITION uddiTModel */
/**
 * @summary uddiTModel
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiTModel OBJECT-CLASS ::= {
 *     SUBCLASS OF     { top }
 *     KIND            structural
 *     MUST CONTAIN    {uddiTModelKey | uddiName}
 *     MAY CONTAIN     {
 *         uddiAuthorizedName
 *         | uddiOperator
 *         | uddiDescription
 *         | uddiOverviewDescription
 *         | uddiOverviewURL
 *         | uddiIdentifierBag
 *         | uddiCategoryBag
 *         | uddiIsHidden
 *         | uddiv3TModelKey
 *         | uddiv3DigitalSignature
 *         | uddiv3NodeId
 *     }
 *     LDAP-NAME       {"uddiTModel"}
 *     ID              { id-uddi 6 7 } }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const uddiTModel: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        uddiTModelKey,
        uddiName,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        uddiAuthorizedName,
        uddiOperator,
        uddiDescription,
        uddiOverviewDescription,
        uddiOverviewURL,
        uddiIdentifierBag,
        uddiCategoryBag,
        uddiIsHidden,
        uddiv3TModelKey,
        uddiv3DigitalSignature,
        uddiv3NodeId,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiTModel'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [6, 7],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiTModel */

/* eslint-enable */
