/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
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

/* START_OF_SYMBOL_DEFINITION glue */
/**
 * @summary glue
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * glue OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     LDAP-NAME        {"glue"}
 *     LDAP-DESC       "Glue Entry"
 *     ID                { 1 3 6 1 4 1 4203 666 3 4 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const glue: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['glue'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Glue Entry' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 4203, 666, 3, 4,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION glue */

/* eslint-enable */
