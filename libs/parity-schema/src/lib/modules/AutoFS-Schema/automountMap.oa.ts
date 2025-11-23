/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { organizationalUnitName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
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
export { organizationalUnitName } from '@wildboar/x500/SelectedAttributeTypes';

/* START_OF_SYMBOL_DEFINITION automountMap */
/**
 * @summary automountMap
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * automountMap OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {organizationalUnitName}
 *     LDAP-NAME       {"automountMap"}
 *     LDAP-DESC       "An group of related automount objects"
 *     ID              { 1 3 6 1 4 1 2312 4 2 2 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const automountMap: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [organizationalUnitName] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['automountMap'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'An group of related automount objects' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 2312, 4, 2, 2,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION automountMap */

/* eslint-enable */
