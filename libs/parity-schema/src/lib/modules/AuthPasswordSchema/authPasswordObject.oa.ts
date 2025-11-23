/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { authPassword } from '../AuthPasswordSchema/authPassword.oa';
import { id_at_openldap_schema } from '../AuthPasswordSchema/id-at-openldap-schema.va';
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
export { authPassword } from '../AuthPasswordSchema/authPassword.oa';
export { id_at_openldap_schema } from '../AuthPasswordSchema/id-at-openldap-schema.va';

/* START_OF_SYMBOL_DEFINITION authPasswordObject */
/**
 * @summary authPasswordObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * authPasswordObject OBJECT-CLASS ::= {
 *     KIND                auxiliary
 *     MAY CONTAIN         { authPassword }
 *     LDAP-NAME           { "authPasswordObject" }
 *     LDAP-DESC           "authentication password mix in class"
 *     ID                  { id-at-openldap-schema 4 7 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const authPasswordObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [authPassword] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['authPasswordObject'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'authentication password mix in class' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [4, 7],
        id_at_openldap_schema
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION authPasswordObject */

/* eslint-enable */
