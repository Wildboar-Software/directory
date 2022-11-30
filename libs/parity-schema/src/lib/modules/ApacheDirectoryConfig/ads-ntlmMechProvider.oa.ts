/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { caseExactMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseExactMatch.oa';
import { caseExactOrderingMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseExactOrderingMatch.oa';
import { caseExactSubstringsMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseExactSubstringsMatch.oa';
import { printableString } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/printableString.oa';
import { ObjectIdentifier as _OID, PrintableString } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
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
export { caseExactMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseExactMatch.oa';
export { caseExactOrderingMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseExactOrderingMatch.oa';
export { caseExactSubstringsMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseExactSubstringsMatch.oa';
export { printableString } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/printableString.oa';

/* START_OF_SYMBOL_DEFINITION ads_ntlmMechProvider */
/**
 * @summary ads_ntlmMechProvider
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-ntlmMechProvider ATTRIBUTE ::= {
 *     WITH SYNTAX                 PrintableString
 *     EQUALITY MATCHING RULE      caseExactMatch
 *     ORDERING MATCHING RULE      caseExactOrderingMatch
 *     SUBSTRINGS MATCHING RULE    caseExactSubstringsMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 printableString.&id
 *     LDAP-NAME                   {"ads-ntlmMechProvider"}
 *     LDAP-DESC                   "Fully qualified class name of SASL NTLM provider"
 *     ID                          { 1 3 6 1 4 1 18060 0 4 1 2 809 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<PrintableString>}
 * @implements {ATTRIBUTE<PrintableString>}
 */
export const ads_ntlmMechProvider: ATTRIBUTE<PrintableString> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodePrintableString,
    },
    encoderFor: {
        '&Type': $._encodePrintableString,
    },
    '&equality-match': caseExactMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': caseExactOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match': caseExactSubstringsMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': printableString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-ntlmMechProvider'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Fully qualified class name of SASL NTLM provider' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 2, 809,
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
/* END_OF_SYMBOL_DEFINITION ads_ntlmMechProvider */

/* eslint-enable */
