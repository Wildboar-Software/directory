/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseIgnoreMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseIgnoreOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseIgnoreSubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { directoryString } from '@wildboar/x500/SelectedAttributeTypes';
import {
    UnboundedDirectoryString,
    _decode_UnboundedDirectoryString,
    _encode_UnboundedDirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
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
export { caseIgnoreMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { caseIgnoreOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { caseIgnoreSubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { directoryString } from '@wildboar/x500/SelectedAttributeTypes';
export {
    UnboundedDirectoryString,
    _decode_UnboundedDirectoryString,
    _encode_UnboundedDirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';

/* START_OF_SYMBOL_DEFINITION printer_natural_language_configured */
/**
 * @summary printer_natural_language_configured
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * printer-natural-language-configured ATTRIBUTE ::= {
 *     WITH SYNTAX                 UnboundedDirectoryString
 *     EQUALITY MATCHING RULE      caseIgnoreMatch
 *     ORDERING MATCHING RULE      caseIgnoreOrderingMatch
 *     SUBSTRINGS MATCHING RULE    caseIgnoreSubstringsMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 directoryString.&id
 *     LDAP-NAME                   {"printer-natural-language-configured"}
 *     LDAP-DESC                   "The configured natural language for LDAP attributes of syntax DirectoryString (UTF-8) in this directory entry."
 *     ID                          { 1 3 18 0 2 4 1119 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<UnboundedDirectoryString>}
 * @implements {ATTRIBUTE<UnboundedDirectoryString>}
 */
export const printer_natural_language_configured: ATTRIBUTE<UnboundedDirectoryString> =
    {
        class: 'ATTRIBUTE',
        decoderFor: {
            '&Type': _decode_UnboundedDirectoryString,
        },
        encoderFor: {
            '&Type': _encode_UnboundedDirectoryString,
        },
        '&equality-match': caseIgnoreMatch /* OBJECT_FIELD_SETTING */,
        '&ordering-match': caseIgnoreOrderingMatch /* OBJECT_FIELD_SETTING */,
        '&substrings-match':
            caseIgnoreSubstringsMatch /* OBJECT_FIELD_SETTING */,
        '&single-valued': true /* OBJECT_FIELD_SETTING */,
        '&ldapSyntax': directoryString['&id'] /* OBJECT_FIELD_SETTING */,
        '&ldapName': [
            'printer-natural-language-configured',
        ] /* OBJECT_FIELD_SETTING */,
        '&ldapDesc':
            'The configured natural language for LDAP attributes of syntax DirectoryString (UTF-8) in this directory entry.' /* OBJECT_FIELD_SETTING */,
        '&id': _OID.fromParts([
            1, 3, 18, 0, 2, 4, 1119,
        ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
        '&Type':
            0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
        '&collective':
            false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
        '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
        '&no-user-modification':
            false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
        '&usage':
            userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
        '&obsolete':
            false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    };
/* END_OF_SYMBOL_DEFINITION printer_natural_language_configured */

/* eslint-enable */
