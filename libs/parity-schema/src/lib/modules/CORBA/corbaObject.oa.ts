/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { corbaRepositoryId } from '../CORBA/corbaRepositoryId.oa';
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
export { corbaRepositoryId } from '../CORBA/corbaRepositoryId.oa';

/* START_OF_SYMBOL_DEFINITION corbaObject */
/**
 * @summary corbaObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * corbaObject OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            abstract
 *     MAY CONTAIN     {corbaRepositoryId | description}
 *     LDAP-NAME       {"corbaObject"}
 *     LDAP-DESC       "CORBA object representation"
 *     ID              { 1 3 6 1 4 1 42 2 27 4 2 9 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const corbaObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': abstract /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        corbaRepositoryId,
        description,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['corbaObject'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'CORBA object representation' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 42, 2, 27, 4, 2, 9,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION corbaObject */

/* eslint-enable */
