/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { octetString } from '@wildboar/x500/SelectedAttributeTypes';
import { octetStringMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID, OCTET_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';


/* START_OF_SYMBOL_DEFINITION nisPublicKey */
/**
 * @summary nisPublicKey
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * nisPublicKey ATTRIBUTE ::= {
 *     WITH SYNTAX                 OCTET STRING
 *     EQUALITY MATCHING RULE      octetStringMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 octetString.&id
 *     LDAP-NAME                   {"nisPublicKey"}
 *     LDAP-DESC                   "NIS public key"
 *     ID                          { 1 3 6 1 1 1 1 28 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<OCTET_STRING>}
 * @implements {ATTRIBUTE<OCTET_STRING>}
 */
export const nisPublicKey: ATTRIBUTE<OCTET_STRING> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeOctetString,
    },
    encoderFor: {
        '&Type': $._encodeOctetString,
    },
    '&equality-match': octetStringMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': octetString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['nisPublicKey'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'NIS public key' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 1, 1, 1, 28,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION nisPublicKey */

/* eslint-enable */
