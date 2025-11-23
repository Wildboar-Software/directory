/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { authorizedService } from '../NameServiceAdditionalSchema/authorizedService.oa';
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
export { authorizedService } from '../NameServiceAdditionalSchema/authorizedService.oa';

/* START_OF_SYMBOL_DEFINITION authorizedServiceObject */
/**
 * @summary authorizedServiceObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * authorizedServiceObject OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MAY CONTAIN     {authorizedService}
 *     LDAP-NAME       {"authorizedServiceObject"}
 *     LDAP-DESC       "Auxiliary object class for adding authorizedService attribute"
 *     ID              { 1 3 6 1 4 1 5322 17 1 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const authorizedServiceObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [authorizedService] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['authorizedServiceObject'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Auxiliary object class for adding authorizedService attribute' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 5322, 17, 1, 1,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION authorizedServiceObject */

/* eslint-enable */
