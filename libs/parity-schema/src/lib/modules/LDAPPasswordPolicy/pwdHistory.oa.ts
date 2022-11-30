/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { octetString } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/octetString.oa';
import { octetStringMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/octetStringMatch.oa';
import { octetStringOrderingMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/octetStringOrderingMatch.oa';
import { octetStringSubstringsMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/octetStringSubstringsMatch.oa';
import { OCTET_STRING } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import { id_at_pwdHistory } from '../LDAPPasswordPolicy/id-at-pwdHistory.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
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
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
export { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
export { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';
export { octetString } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/octetString.oa';
export { octetStringMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/octetStringMatch.oa';
export { octetStringOrderingMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/octetStringOrderingMatch.oa';
export { octetStringSubstringsMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/octetStringSubstringsMatch.oa';
export { id_at_pwdHistory } from '../LDAPPasswordPolicy/id-at-pwdHistory.va';

/* START_OF_SYMBOL_DEFINITION pwdHistory */
/**
 * @summary pwdHistory
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pwdHistory ATTRIBUTE ::= {
 *     WITH SYNTAX                 OCTET STRING
 *     EQUALITY MATCHING RULE         octetStringMatch
 *     ORDERING MATCHING RULE      octetStringOrderingMatch
 *     SUBSTRINGS MATCHING RULE    octetStringSubstringsMatch
 *     NO USER MODIFICATION        TRUE
 *     USAGE                       directoryOperation
 *     LDAP-SYNTAX                 octetString.&id
 *     LDAP-NAME                     {"pwdHistory"}
 *     LDAP-DESC                   "The history of user s passwords"
 *     ID                          id-at-pwdHistory
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<OCTET_STRING>}
 * @implements {ATTRIBUTE<OCTET_STRING>}
 */
export const pwdHistory: ATTRIBUTE<OCTET_STRING> = {
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
    '&no-user-modification': true /* OBJECT_FIELD_SETTING */,
    '&usage': directoryOperation /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': octetString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['pwdHistory'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'The history of user s passwords' /* OBJECT_FIELD_SETTING */,
    '&id': id_at_pwdHistory /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&single-valued':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pwdHistory */

/* eslint-enable */
