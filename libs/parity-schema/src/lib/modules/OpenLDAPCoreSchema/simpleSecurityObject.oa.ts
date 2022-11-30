/* eslint-disable */
import { userPassword } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa';
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
export { userPassword } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa';
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

/* START_OF_SYMBOL_DEFINITION simpleSecurityObject */
/**
 * @summary simpleSecurityObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * simpleSecurityObject OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {userPassword}
 *     LDAP-NAME       {"simpleSecurityObject"}
 *     LDAP-DESC       "RFC1274: simple security object"
 *     ID              { 0 9 2342 19200300 100 4 19 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const simpleSecurityObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [userPassword] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['simpleSecurityObject'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'RFC1274: simple security object' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        0, 9, 2342, 19200300, 100, 4, 19,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION simpleSecurityObject */

/* eslint-enable */
