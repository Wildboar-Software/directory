/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { boolean_ } from '@wildboar/x500/SelectedAttributeTypes';
import { booleanMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { BOOLEAN, ObjectIdentifier as _OID } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';


/* START_OF_SYMBOL_DEFINITION ads_wantClientAuth */
/**
 * @summary ads_wantClientAuth
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-wantClientAuth ATTRIBUTE ::= {
 *     WITH SYNTAX                 BOOLEAN
 *     EQUALITY MATCHING RULE      booleanMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 boolean.&id
 *     LDAP-NAME                   {"ads-wantClientAuth"}
 *     LDAP-DESC                   "Tells if the client auth is wanted"
 *     ID                          { 1 3 6 1 4 1 18060 0 4 1 2 66 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<BOOLEAN>}
 * @implements {ATTRIBUTE<BOOLEAN>}
 */
export const ads_wantClientAuth: ATTRIBUTE<BOOLEAN> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeBoolean,
    },
    encoderFor: {
        '&Type': $._encodeBoolean,
    },
    '&equality-match': booleanMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': boolean_['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ads-wantClientAuth'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Tells if the client auth is wanted' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 2, 66,
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
/* END_OF_SYMBOL_DEFINITION ads_wantClientAuth */

/* eslint-enable */
