/* eslint-disable */
import { userPassword } from '@wildboar/x500/AuthenticationFramework';
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { uid } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { gecos } from '../NIS/gecos.oa';
import { gidNumber } from '../NIS/gidNumber.oa';
import { homeDirectory } from '../NIS/homeDirectory.oa';
import { id_nis_oc } from '../NIS/id-nis-oc.va';
import { loginShell } from '../NIS/loginShell.oa';
import { uidNumber } from '../NIS/uidNumber.oa';


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
    '&id': _OID.fromParts(
        [0],
        id_nis_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION posixAccount */

/* eslint-enable */
