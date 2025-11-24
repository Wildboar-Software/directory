/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseExactMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseExactOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseExactSubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { directoryString } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_nsdsat } from '../DynGroup/id-nsdsat.va';
import { labeledURI } from '../OpenLDAPCoreSchema/labeledURI.oa';


/* START_OF_SYMBOL_DEFINITION memberURL */
/**
 * @summary memberURL
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * memberURL ATTRIBUTE ::= {
 *     SUBTYPE OF                  labeledURI
 *     EQUALITY MATCHING RULE         caseExactMatch
 *     ORDERING MATCHING RULE        caseExactOrderingMatch
 *     SUBSTRINGS MATCHING RULE     caseExactSubstringsMatch
 *     LDAP-SYNTAX                 directoryString.&id
 *     LDAP-NAME                   {"memberURL"}
 *     LDAP-DESC "Identifies an URL associated with each member of a group. Any type of labeled URL can be used."
 *     ID                          { id-nsdsat 198 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE}
 * @implements {ATTRIBUTE}
 */
export const memberURL: ATTRIBUTE = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': undefined,
    },
    encoderFor: {
        '&Type': undefined,
    },
    '&derivation': labeledURI /* OBJECT_FIELD_SETTING */,
    '&equality-match': caseExactMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': caseExactOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match': caseExactSubstringsMatch /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': directoryString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['memberURL'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Identifies an URL associated with each member of a group. Any type of labeled URL can be used.' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [198],
        id_nsdsat
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
/* END_OF_SYMBOL_DEFINITION memberURL */

/* eslint-enable */
