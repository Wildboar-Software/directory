/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseExactMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseExactOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseExactSubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { directoryString } from '@wildboar/x500/SelectedAttributeTypes';
import {
    UnboundedDirectoryString,
    _decode_UnboundedDirectoryString,
    _encode_UnboundedDirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
import { id_at_eduPersonAssurance } from '../EduPersonSchema/id-at-eduPersonAssurance.va';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export {
    AttributeUsage,
    AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */,
    directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_AttributeUsage,
    _encode_AttributeUsage,
    _enum_for_AttributeUsage,
} from '@wildboar/x500/InformationFramework';
export { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
export { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
export { caseExactMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { caseExactOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { caseExactSubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { directoryString } from '@wildboar/x500/SelectedAttributeTypes';
export {
    UnboundedDirectoryString,
    _decode_UnboundedDirectoryString,
    _encode_UnboundedDirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
export { id_at_eduPersonAssurance } from '../EduPersonSchema/id-at-eduPersonAssurance.va';

/* START_OF_SYMBOL_DEFINITION eduPersonAssurance */
/**
 * @summary eduPersonAssurance
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * eduPersonAssurance ATTRIBUTE ::= {
 *     WITH SYNTAX                 UnboundedDirectoryString
 *     EQUALITY MATCHING RULE         caseExactMatch
 *     ORDERING MATCHING RULE      caseExactOrderingMatch
 *     SUBSTRINGS MATCHING RULE    caseExactSubstringsMatch
 *     LDAP-SYNTAX                 directoryString.&id
 *     LDAP-NAME                     {"eduPersonAssurance"}
 *     LDAP-DESC                    "eduPerson per Internet2 and EDUCAUSE"
 *     ID                          id-at-eduPersonAssurance
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<UnboundedDirectoryString>}
 * @implements {ATTRIBUTE<UnboundedDirectoryString>}
 */
export const eduPersonAssurance: ATTRIBUTE<UnboundedDirectoryString> = {
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
    '&ldapName': ['eduPersonAssurance'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'eduPerson per Internet2 and EDUCAUSE' /* OBJECT_FIELD_SETTING */,
    '&id': id_at_eduPersonAssurance /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION eduPersonAssurance */

/* eslint-enable */
