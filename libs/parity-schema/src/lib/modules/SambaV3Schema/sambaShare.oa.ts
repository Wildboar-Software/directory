/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { sambaShareName } from '../SambaV3Schema/sambaShareName.oa';
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
export { description } from '@wildboar/x500/SelectedAttributeTypes';
export { sambaShareName } from '../SambaV3Schema/sambaShareName.oa';

/* START_OF_SYMBOL_DEFINITION sambaShare */
/**
 * @summary sambaShare
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sambaShare OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {sambaShareName}
 *     MAY CONTAIN     {description}
 *     LDAP-NAME       {"sambaShare"}
 *     LDAP-DESC       "Samba Share Section"
 *     ID              { 1 3 6 1 4 1 7165 2 2 11 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const sambaShare: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [sambaShareName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [description] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['sambaShare'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Samba Share Section' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 7165, 2, 2, 11,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sambaShare */

/* eslint-enable */
