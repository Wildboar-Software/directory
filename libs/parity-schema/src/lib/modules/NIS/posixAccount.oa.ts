/* eslint-disable */
import { userPassword } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa';
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { uid } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { gecos } from '../NIS/gecos.oa';
import { gidNumber } from '../NIS/gidNumber.oa';
import { homeDirectory } from '../NIS/homeDirectory.oa';
import { id_nis_oc } from '../NIS/id-nis-oc.va';
import { loginShell } from '../NIS/loginShell.oa';
import { uidNumber } from '../NIS/uidNumber.oa';
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
export { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
export { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
export { uid } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa';
export { gecos } from '../NIS/gecos.oa';
export { gidNumber } from '../NIS/gidNumber.oa';
export { homeDirectory } from '../NIS/homeDirectory.oa';
export { id_nis_oc } from '../NIS/id-nis-oc.va';
export { loginShell } from '../NIS/loginShell.oa';
export { uidNumber } from '../NIS/uidNumber.oa';

/* START_OF_SYMBOL_DEFINITION posixAccount */
/**
 * @summary posixAccount
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * posixAccount OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {
 *         commonName
 *         | uid
 *         | uidNumber
 *         | gidNumber
 *         | homeDirectory
 *     }
 *     MAY CONTAIN        {
 *         userPassword
 *         | loginShell
 *         | gecos
 *         | description
 *     }
 *     LDAP-NAME        {"posixAccount"}
 *     LDAP-DESC        "Abstraction of an account with POSIX attributes"
 *     ID                { id-nis-oc 0 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const posixAccount: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        commonName,
        uid,
        uidNumber,
        gidNumber,
        homeDirectory,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        userPassword,
        loginShell,
        gecos,
        description,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['posixAccount'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Abstraction of an account with POSIX attributes' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [0],
        id_nis_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION posixAccount */

/* eslint-enable */
