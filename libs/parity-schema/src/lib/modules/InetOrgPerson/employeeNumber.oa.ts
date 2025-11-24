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
    type UnboundedDirectoryString,
    _decode_UnboundedDirectoryString,
    _encode_UnboundedDirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { netscapeDirectory } from '../InetOrgPerson/netscapeDirectory.va';



/* START_OF_SYMBOL_DEFINITION employeeNumber */
/**
 * @summary employeeNumber
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * employeeNumber ATTRIBUTE ::= {
 *     WITH SYNTAX                 UnboundedDirectoryString
 *     EQUALITY MATCHING RULE         caseIgnoreMatch
 *     ORDERING MATCHING RULE        caseIgnoreOrderingMatch
 *     SUBSTRINGS MATCHING RULE     caseIgnoreSubstringsMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 directoryString.&id
 *     LDAP-NAME                     {"employeeNumber"}
 *     LDAP-DESC                    "RFC2798: numerically identifies an employee within an organization"
 *     ID { netscapeDirectory 1 3 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<UnboundedDirectoryString>}
 * @implements {ATTRIBUTE<UnboundedDirectoryString>}
 */
export const employeeNumber: ATTRIBUTE<UnboundedDirectoryString> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_UnboundedDirectoryString,
    },
    encoderFor: {
        '&Type': _encode_UnboundedDirectoryString,
    },
    '&equality-match': caseIgnoreMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': caseIgnoreOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match': caseIgnoreSubstringsMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': directoryString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['employeeNumber'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'RFC2798: numerically identifies an employee within an organization' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [1, 3],
        netscapeDirectory
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
/* END_OF_SYMBOL_DEFINITION employeeNumber */

/* eslint-enable */
