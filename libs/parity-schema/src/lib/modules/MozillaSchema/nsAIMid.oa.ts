/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { telephoneNr } from '@wildboar/x500/SelectedAttributeTypes';
import {
    type TelephoneNumber,
    _decode_TelephoneNumber,
    _encode_TelephoneNumber,
} from '@wildboar/x500/SelectedAttributeTypes';
import { telephoneNumberMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { telephoneNumberSubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';



/* START_OF_SYMBOL_DEFINITION nsAIMid */
/**
 * @summary nsAIMid
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * nsAIMid ATTRIBUTE ::= {
 *     WITH SYNTAX                 TelephoneNumber
 *     EQUALITY MATCHING RULE      telephoneNumberMatch
 *     SUBSTRINGS MATCHING RULE    telephoneNumberSubstringsMatch
 *     USAGE                       userApplications
 *     LDAP-SYNTAX                 telephoneNr.&id
 *     LDAP-NAME                   {"nsAIMid"}
 *     LDAP-DESC                   "AOL Instant Messenger (AIM) Identity"
 *     ID                          { 1 3 6 1 4 1 13769 2 1 13 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<TelephoneNumber>}
 * @implements {ATTRIBUTE<TelephoneNumber>}
 */
export const nsAIMid: ATTRIBUTE<TelephoneNumber> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_TelephoneNumber,
    },
    encoderFor: {
        '&Type': _encode_TelephoneNumber,
    },
    '&equality-match': telephoneNumberMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match':
        telephoneNumberSubstringsMatch /* OBJECT_FIELD_SETTING */,
    '&usage': userApplications /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': telephoneNr['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['nsAIMid'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'AOL Instant Messenger (AIM) Identity' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 13769, 2, 1, 13,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&single-valued':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION nsAIMid */

/* eslint-enable */
