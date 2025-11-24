/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { numericString } from '@wildboar/x500/SelectedAttributeTypes';
import { numericStringMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { NumericString, ObjectIdentifier as _OID } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { id_at } from '../QMailSchema/id-at.va';


/* START_OF_SYMBOL_DEFINITION qmailAccountPurge */
/**
 * @summary qmailAccountPurge
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * qmailAccountPurge ATTRIBUTE ::= {
 *     WITH SYNTAX                 NumericString
 *     EQUALITY MATCHING RULE         numericStringMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 numericString.&id
 *     LDAP-NAME                     {"qmailAccountPurge"}
 *     LDAP-DESC                   "The earliest date when a mailMessageStore will be purged"
 *     ID                          { id-at 13 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<NumericString>}
 * @implements {ATTRIBUTE<NumericString>}
 */
export const qmailAccountPurge: ATTRIBUTE<NumericString> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeNumericString,
    },
    encoderFor: {
        '&Type': $._encodeNumericString,
    },
    '&equality-match': numericStringMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': numericString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['qmailAccountPurge'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'The earliest date when a mailMessageStore will be purged' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [13],
        id_at
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
/* END_OF_SYMBOL_DEFINITION qmailAccountPurge */

/* eslint-enable */
