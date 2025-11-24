/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { sambaPrivilegeList } from '../SambaV3Schema/sambaPrivilegeList.oa';
import { sambaSID } from '../SambaV3Schema/sambaSID.oa';


/* START_OF_SYMBOL_DEFINITION sambaPrivilege */
/**
 * @summary sambaPrivilege
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sambaPrivilege OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {sambaSID}
 *     MAY CONTAIN     {sambaPrivilegeList}
 *     LDAP-NAME       {"sambaPrivilege"}
 *     LDAP-DESC       "Samba Privilege"
 *     ID              { 1 3 6 1 4 1 7165 2 2 13 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const sambaPrivilege: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [sambaSID] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [sambaPrivilegeList] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['sambaPrivilege'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Samba Privilege' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 7165, 2, 2, 13,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sambaPrivilege */

/* eslint-enable */
