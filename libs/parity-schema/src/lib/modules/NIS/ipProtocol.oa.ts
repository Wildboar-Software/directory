/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { id_nis_oc } from '../NIS/id-nis-oc.va';
import { ipProtocolNumber } from '../NIS/ipProtocolNumber.oa';
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
export { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
export { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
export { id_nis_oc } from '../NIS/id-nis-oc.va';
export { ipProtocolNumber } from '../NIS/ipProtocolNumber.oa';

/* START_OF_SYMBOL_DEFINITION ipProtocol */
/**
 * @summary ipProtocol
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ipProtocol OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {commonName | ipProtocolNumber}
 *     MAY CONTAIN        {description}
 *     LDAP-NAME        {"ipProtocol"}
 *     LDAP-DESC        "Abstraction of an IP protocol"
 *     ID                { id-nis-oc 4 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ipProtocol: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        commonName,
        ipProtocolNumber,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [description] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ipProtocol'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Abstraction of an IP protocol' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [4],
        id_nis_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ipProtocol */

/* eslint-enable */
