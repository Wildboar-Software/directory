/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiDescription } from '../UDDI-Schema/uddiDescription.oa';
import { uddiEMail } from '../UDDI-Schema/uddiEMail.oa';
import { uddiPersonName } from '../UDDI-Schema/uddiPersonName.oa';
import { uddiPhone } from '../UDDI-Schema/uddiPhone.oa';
import { uddiUseType } from '../UDDI-Schema/uddiUseType.oa';
import { uddiUUID } from '../UDDI-Schema/uddiUUID.oa';
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
export { uddiDescription } from '../UDDI-Schema/uddiDescription.oa';
export { uddiEMail } from '../UDDI-Schema/uddiEMail.oa';
export { uddiPersonName } from '../UDDI-Schema/uddiPersonName.oa';
export { uddiPhone } from '../UDDI-Schema/uddiPhone.oa';
export { uddiUseType } from '../UDDI-Schema/uddiUseType.oa';
export { uddiUUID } from '../UDDI-Schema/uddiUUID.oa';

/* START_OF_SYMBOL_DEFINITION uddiContact */
/**
 * @summary uddiContact
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiContact OBJECT-CLASS ::= {
 *     SUBCLASS OF     { top }
 *     KIND            structural
 *     MUST CONTAIN    {uddiPersonName | uddiUUID}
 *     MAY CONTAIN     {
 *         uddiUseType
 *         | uddiDescription
 *         | uddiPhone
 *         | uddiEMail
 *     }
 *     LDAP-NAME       {"uddiContact"}
 *     ID              { id-uddi 6 2 } }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const uddiContact: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        uddiPersonName,
        uddiUUID,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        uddiUseType,
        uddiDescription,
        uddiPhone,
        uddiEMail,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiContact'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [6, 2],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiContact */

/* eslint-enable */
