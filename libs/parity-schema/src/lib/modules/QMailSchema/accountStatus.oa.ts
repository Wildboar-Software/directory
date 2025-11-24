/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseIgnoreIA5Match } from '@wildboar/x500/SelectedAttributeTypes';
import { ia5String } from '@wildboar/x500/SelectedAttributeTypes';
import { IA5String, ObjectIdentifier as _OID } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { id_at } from '../QMailSchema/id-at.va';


/* START_OF_SYMBOL_DEFINITION accountStatus */
/**
 * @summary accountStatus
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * accountStatus ATTRIBUTE ::= {
 *     WITH SYNTAX                 IA5String ("active" | "noaccess" | "disabled" | "deleted")
 *     EQUALITY MATCHING RULE         caseIgnoreIA5Match
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 ia5String.&id
 *     LDAP-NAME                     {"accountStatus"}
 *     LDAP-DESC                   "The status of a user account: active, noaccess, disabled, deleted"
 *     ID                          { id-at 12 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<IA5String>}
 * @implements {ATTRIBUTE<IA5String>}
 */
export const accountStatus: ATTRIBUTE<IA5String> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeIA5String,
    },
    encoderFor: {
        '&Type': $._encodeIA5String,
    },
    '&equality-match': caseIgnoreIA5Match /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': ia5String['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['accountStatus'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'The status of a user account: active, noaccess, disabled, deleted' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [12],
        id_at
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&usage':
        userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION accountStatus */

/* eslint-enable */
