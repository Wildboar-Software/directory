/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseExactMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseExactOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseExactSubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { directoryString } from '@wildboar/x500/SelectedAttributeTypes';
import {
    type UnboundedDirectoryString,
    _decode_UnboundedDirectoryString,
    _encode_UnboundedDirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
import { id_at_eduPersonEntitlement } from '../EduPersonSchema/id-at-eduPersonEntitlement.va';



/* START_OF_SYMBOL_DEFINITION eduPersonEntitlement */
/**
 * @summary eduPersonEntitlement
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * eduPersonEntitlement ATTRIBUTE ::= {
 *     WITH SYNTAX                 UnboundedDirectoryString
 *     EQUALITY MATCHING RULE         caseExactMatch
 *     ORDERING MATCHING RULE      caseExactOrderingMatch
 *     SUBSTRINGS MATCHING RULE    caseExactSubstringsMatch
 *     LDAP-SYNTAX                 directoryString.&id
 *     LDAP-NAME                     {"eduPersonEntitlement"}
 *     LDAP-DESC                    "Entitlement"
 *     ID                          id-at-eduPersonEntitlement
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<UnboundedDirectoryString>}
 * @implements {ATTRIBUTE<UnboundedDirectoryString>}
 */
export const eduPersonEntitlement: ATTRIBUTE<UnboundedDirectoryString> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_UnboundedDirectoryString,
    },
    encoderFor: {
        '&Type': _encode_UnboundedDirectoryString,
    },
    '&equality-match': caseExactMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': caseExactOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match': caseExactSubstringsMatch /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': directoryString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['eduPersonEntitlement'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Entitlement' /* OBJECT_FIELD_SETTING */,
    '&id': id_at_eduPersonEntitlement /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION eduPersonEntitlement */

/* eslint-enable */
