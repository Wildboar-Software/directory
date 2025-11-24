/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { octetString } from '@wildboar/x500/SelectedAttributeTypes';
import { octetStringMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { octetStringOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { octetStringSubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID, OCTET_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { iana_assigned_oid } from '../VPIMSchema/iana-assigned-oid.va';


/* START_OF_SYMBOL_DEFINITION vPIMSpokenName */
/**
 * @summary vPIMSpokenName
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * vPIMSpokenName ATTRIBUTE ::= {
 *     WITH SYNTAX                 OCTET STRING (SIZE (0..20000))
 *     EQUALITY MATCHING RULE         octetStringMatch
 *     ORDERING MATCHING RULE      octetStringOrderingMatch
 *     SUBSTRINGS MATCHING RULE     octetStringSubstringsMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 octetString.&id
 *     LDAP-NAME                     {"vPIMSpokenName"}
 *     LDAP-DESC                   "Shall contain the spoken name of the user in the voice of the user, and MUST be encoded in 32 kbit/s ADPCM exactly, as defined by IETF RFC 3802."
 *     ID                          { iana-assigned-oid 2 3 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<OCTET_STRING>}
 * @implements {ATTRIBUTE<OCTET_STRING>}
 */
export const vPIMSpokenName: ATTRIBUTE<OCTET_STRING> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeOctetString,
    },
    encoderFor: {
        '&Type': $._encodeOctetString,
    },
    '&equality-match': octetStringMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': octetStringOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match': octetStringSubstringsMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': octetString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['vPIMSpokenName'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Shall contain the spoken name of the user in the voice of the user, and MUST be encoded in 32 kbit/s ADPCM exactly, as defined by IETF RFC 3802.' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [2, 3],
        iana_assigned_oid
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
/* END_OF_SYMBOL_DEFINITION vPIMSpokenName */

/* eslint-enable */
