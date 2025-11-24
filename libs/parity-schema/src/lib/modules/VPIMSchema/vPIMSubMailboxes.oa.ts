/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { numericString } from '@wildboar/x500/SelectedAttributeTypes';
import { numericStringMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { numericStringOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { numericStringSubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { NumericString, ObjectIdentifier as _OID } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { iana_assigned_oid } from '../VPIMSchema/iana-assigned-oid.va';


/* START_OF_SYMBOL_DEFINITION vPIMSubMailboxes */
/**
 * @summary vPIMSubMailboxes
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * vPIMSubMailboxes ATTRIBUTE ::= {
 *     WITH SYNTAX                 NumericString (SIZE (1..4))
 *     EQUALITY MATCHING RULE         numericStringMatch
 *     ORDERING MATCHING RULE      numericStringOrderingMatch
 *     SUBSTRINGS MATCHING RULE     numericStringSubstringsMatch
 *     LDAP-SYNTAX                 numericString.&id
 *     LDAP-NAME                     {"vPIMSubMailboxes"}
 *     ID                          { iana-assigned-oid 2 10 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<NumericString>}
 * @implements {ATTRIBUTE<NumericString>}
 */
export const vPIMSubMailboxes: ATTRIBUTE<NumericString> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeNumericString,
    },
    encoderFor: {
        '&Type': $._encodeNumericString,
    },
    '&equality-match': numericStringMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': numericStringOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match':
        numericStringSubstringsMatch /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': numericString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['vPIMSubMailboxes'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [2, 10],
        iana_assigned_oid
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
/* END_OF_SYMBOL_DEFINITION vPIMSubMailboxes */

/* eslint-enable */
