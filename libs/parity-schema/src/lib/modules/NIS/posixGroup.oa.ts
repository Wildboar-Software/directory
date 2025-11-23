/* eslint-disable */
import { userPassword } from '@wildboar/x500/AuthenticationFramework';
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { gidNumber } from '../NIS/gidNumber.oa';
import { id_nis_oc } from '../NIS/id-nis-oc.va';
import { memberUid } from '../NIS/memberUid.oa';
export { userPassword } from '@wildboar/x500/AuthenticationFramework';
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
export { commonName } from '@wildboar/x500/SelectedAttributeTypes';
export { description } from '@wildboar/x500/SelectedAttributeTypes';
export { gidNumber } from '../NIS/gidNumber.oa';
export { id_nis_oc } from '../NIS/id-nis-oc.va';
export { memberUid } from '../NIS/memberUid.oa';

/* START_OF_SYMBOL_DEFINITION posixGroup */
/**
 * @summary posixGroup
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * posixGroup OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {
 *         commonName
 *         | gidNumber
 *     }
 *     MAY CONTAIN        {
 *         userPassword
 *         | memberUid
 *         | description
 *     }
 *     LDAP-NAME        {"posixGroup"}
 *     LDAP-DESC        "Abstraction of a group of accounts"
 *     ID                { id-nis-oc 2 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const posixGroup: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName, gidNumber] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        userPassword,
        memberUid,
        description,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['posixGroup'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Abstraction of a group of accounts' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [2],
        id_nis_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION posixGroup */

/* eslint-enable */
