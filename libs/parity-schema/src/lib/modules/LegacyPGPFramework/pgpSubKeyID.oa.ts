/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseIgnoreMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseIgnoreOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseIgnoreSubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { directoryString } from '@wildboar/x500/SelectedAttributeTypes';
import {
    type DirectoryString,
    _decode_DirectoryString,
    _encode_DirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { mcafee } from '../LegacyPGPFramework/mcafee.va';


/* START_OF_SYMBOL_DEFINITION pgpSubKeyID */
/**
 * @summary pgpSubKeyID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pgpSubKeyID ATTRIBUTE ::= {
 *     WITH SYNTAX                 DirectoryString
 *     EQUALITY MATCHING RULE      caseIgnoreMatch
 *     ORDERING MATCHING RULE      caseIgnoreOrderingMatch
 *     SUBSTRINGS MATCHING RULE    caseIgnoreSubstringsMatch
 *     LDAP-SYNTAX                 directoryString.&id
 *     LDAP-NAME                   {"pgpSubKeyID"}
 *     LDAP-DESC                   "Sub-key ID(s) of the PGP key."
 *     ID                          { mcafee 8 2 20 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<DirectoryString>}
 * @implements {ATTRIBUTE<DirectoryString>}
 */
export const pgpSubKeyID: ATTRIBUTE<DirectoryString> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_DirectoryString,
    },
    encoderFor: {
        '&Type': _encode_DirectoryString,
    },
    '&equality-match': caseIgnoreMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': caseIgnoreOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match': caseIgnoreSubstringsMatch /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': directoryString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['pgpSubKeyID'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Sub-key ID(s) of the PGP key.' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [8, 2, 20],
        mcafee
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&single-valued':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&usage':
        userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pgpSubKeyID */

/* eslint-enable */
