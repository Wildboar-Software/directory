/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseExactMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseExactOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseExactSubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { printableString } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID, PrintableString } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';


/* START_OF_SYMBOL_DEFINITION ads_replReqHandler */
/**
 * @summary ads_replReqHandler
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-replReqHandler ATTRIBUTE ::= {
 *     WITH SYNTAX                 PrintableString
 *     EQUALITY MATCHING RULE      caseExactMatch
 *     ORDERING MATCHING RULE      caseExactOrderingMatch
 *     SUBSTRINGS MATCHING RULE    caseExactSubstringsMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 printableString.&id
 *     LDAP-NAME                   {"ads-replReqHandler"}
 *     LDAP-DESC                   "FQCN of the replication replication request handler on a master/provider"
 *     ID                          { 1 3 6 1 4 1 18060 0 4 1 2 832 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<PrintableString>}
 * @implements {ATTRIBUTE<PrintableString>}
 */
export const ads_replReqHandler: ATTRIBUTE<PrintableString> = {
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
    '&ldapName': ['ads-replReqHandler'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'FQCN of the replication replication request handler on a master/provider' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 2, 832,
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
/* END_OF_SYMBOL_DEFINITION ads_replReqHandler */

/* eslint-enable */
