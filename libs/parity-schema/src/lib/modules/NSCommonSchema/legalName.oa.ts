/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { caseIgnoreMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseIgnoreMatch.oa';
import { caseIgnoreSubstringsMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseIgnoreSubstringsMatch.oa';
import { directoryString } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/directoryString.oa';
import {
    UnboundedDirectoryString,
    _decode_UnboundedDirectoryString,
    _encode_UnboundedDirectoryString,
} from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UnboundedDirectoryString.ta';
import { ObjectIdentifier as _OID } from 'asn1-ts';
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
export { caseIgnoreMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseIgnoreMatch.oa';
export { caseIgnoreSubstringsMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseIgnoreSubstringsMatch.oa';
export { directoryString } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/directoryString.oa';
export {
    UnboundedDirectoryString,
    _decode_UnboundedDirectoryString,
    _encode_UnboundedDirectoryString,
} from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UnboundedDirectoryString.ta';

/* START_OF_SYMBOL_DEFINITION legalName */
/**
 * @summary legalName
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * legalName ATTRIBUTE ::= {
 *     WITH SYNTAX                 UnboundedDirectoryString
 *     EQUALITY MATCHING RULE         caseIgnoreMatch
 *     SUBSTRINGS MATCHING RULE    caseIgnoreSubstringsMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 directoryString.&id
 *     LDAP-NAME                     {"legalName"}
 *     LDAP-DESC                   "An individuals legalName."
 *     ID                          { 2 16 840 1 113730 3 1 2343 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<UnboundedDirectoryString>}
 * @implements {ATTRIBUTE<UnboundedDirectoryString>}
 */
export const legalName: ATTRIBUTE<UnboundedDirectoryString> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_UnboundedDirectoryString,
    },
    encoderFor: {
        '&Type': _encode_UnboundedDirectoryString,
    },
    '&equality-match': caseIgnoreMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match': caseIgnoreSubstringsMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': directoryString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['legalName'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'An individuals legalName.' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        2, 16, 840, 1, 113730, 3, 1, 2343,
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
/* END_OF_SYMBOL_DEFINITION legalName */

/* eslint-enable */