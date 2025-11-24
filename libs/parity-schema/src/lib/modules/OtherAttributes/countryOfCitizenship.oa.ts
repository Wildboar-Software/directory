/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseIgnoreMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseIgnoreOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseIgnoreSubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { directoryString } from '@wildboar/x500/SelectedAttributeTypes';
import { PrintableString } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { id_pda_countryOfCitizenship } from '../OtherAttributes/id-pda-countryOfCitizenship.va';


/* START_OF_SYMBOL_DEFINITION countryOfCitizenship */
/**
 * @summary countryOfCitizenship
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * countryOfCitizenship ATTRIBUTE ::= {
 *     WITH SYNTAX                        PrintableString (SIZE (2)) (CONSTRAINED BY { -- ISO 3166 codes only -- })
 *     EQUALITY MATCHING RULE            caseIgnoreMatch
 *     ORDERING MATCHING RULE            caseIgnoreOrderingMatch
 *     SUBSTRINGS MATCHING RULE        caseIgnoreSubstringsMatch
 *     LDAP-SYNTAX                        directoryString.&id
 *     LDAP-NAME                        {"countryOfCitizenship"}
 *     LDAP-DESC                        "IETF RFC 3739: Country of citizenship of the subject"
 *     ID                                id-pda-countryOfCitizenship
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<PrintableString>}
 * @implements {ATTRIBUTE<PrintableString>}
 */
export const countryOfCitizenship: ATTRIBUTE<PrintableString> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodePrintableString,
    },
    encoderFor: {
        '&Type': $._encodePrintableString,
    },
    '&equality-match': caseIgnoreMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': caseIgnoreOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match': caseIgnoreSubstringsMatch /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': directoryString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['countryOfCitizenship'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'IETF RFC 3739: Country of citizenship of the subject' /* OBJECT_FIELD_SETTING */,
    '&id': id_pda_countryOfCitizenship /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION countryOfCitizenship */

/* eslint-enable */
