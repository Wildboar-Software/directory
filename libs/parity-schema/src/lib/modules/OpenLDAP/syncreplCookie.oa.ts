/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { octetString } from '@wildboar/x500/SelectedAttributeTypes';
import { octetStringMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { octetStringOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { octetStringSubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
import {
    type UUID,
    _decode_UUID,
    _encode_UUID,
} from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';



/* START_OF_SYMBOL_DEFINITION syncreplCookie */
/**
 * @summary syncreplCookie
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * syncreplCookie ATTRIBUTE ::= {
 *     WITH SYNTAX                 UUID
 *     EQUALITY MATCHING RULE         octetStringMatch
 *     ORDERING MATCHING RULE      octetStringOrderingMatch
 *     SUBSTRINGS MATCHING RULE    octetStringSubstringsMatch
 *     SINGLE VALUE                TRUE
 *     NO USER MODIFICATION        TRUE
 *     USAGE                       dSAOperation
 *     LDAP-SYNTAX                 octetString.&id
 *     LDAP-NAME                     {"syncreplCookie"}
 *     LDAP-DESC "syncrepl Cookie for shadow copy"
 *     ID { 1 3 6 1 4 1 4203 666 1 23 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<UUID>}
 * @implements {ATTRIBUTE<UUID>}
 */
export const syncreplCookie: ATTRIBUTE<UUID> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_UUID,
    },
    encoderFor: {
        '&Type': _encode_UUID,
    },
    '&equality-match': octetStringMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': octetStringOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match': octetStringSubstringsMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&no-user-modification': true /* OBJECT_FIELD_SETTING */,
    '&usage': dSAOperation /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': octetString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['syncreplCookie'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'syncrepl Cookie for shadow copy' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 4203, 666, 1, 23,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION syncreplCookie */

/* eslint-enable */
