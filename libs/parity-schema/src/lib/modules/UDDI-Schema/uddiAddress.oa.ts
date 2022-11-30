/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiAddressLine } from '../UDDI-Schema/uddiAddressLine.oa';
import { uddiLang } from '../UDDI-Schema/uddiLang.oa';
import { uddiSortCode } from '../UDDI-Schema/uddiSortCode.oa';
import { uddiTModelKey } from '../UDDI-Schema/uddiTModelKey.oa';
import { uddiUseType } from '../UDDI-Schema/uddiUseType.oa';
import { uddiUUID } from '../UDDI-Schema/uddiUUID.oa';
import { uddiv3TModelKey } from './uddiv3TModelKey.oa';
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
export { uddiAddressLine } from '../UDDI-Schema/uddiAddressLine.oa';
export { uddiLang } from '../UDDI-Schema/uddiLang.oa';
export { uddiSortCode } from '../UDDI-Schema/uddiSortCode.oa';
export { uddiTModelKey } from '../UDDI-Schema/uddiTModelKey.oa';
export { uddiUseType } from '../UDDI-Schema/uddiUseType.oa';
export { uddiUUID } from '../UDDI-Schema/uddiUUID.oa';

/* START_OF_SYMBOL_DEFINITION uddiAddress */
/**
 * @summary uddiAddress
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiAddress OBJECT-CLASS ::= {
 *     SUBCLASS OF     { top }
 *     KIND            structural
 *     MUST CONTAIN    {uddiUUID}
 *     MAY CONTAIN     {
 *         uddiUseType
 *         | uddiSortCode
 *         | uddiTModelKey
 *         | uddiv3TmodelKey
 *         | uddiAddressLine
 *         | uddiLang
 *     }
 *     LDAP-NAME       {"uddiAddress"}
 *     ID              { id-uddi 6 3 } }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const uddiAddress: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uddiUUID] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        uddiUseType,
        uddiSortCode,
        uddiTModelKey,
        uddiv3TModelKey,
        uddiAddressLine,
        uddiLang,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiAddress'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [6, 3],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiAddress */

/* eslint-enable */
