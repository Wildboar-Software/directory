/* eslint-disable */
import type { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
import { octetString } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_at_openldap_schema } from '../AuthPasswordSchema/id-at-openldap-schema.va';
import {
    type PlaintextPasswordSyntax,
    _decode_PlaintextPasswordSyntax,
    _encode_PlaintextPasswordSyntax,
} from '../AuthPasswordSchema/PlaintextPasswordSyntax.ta';

/* START_OF_SYMBOL_DEFINITION authPasswordMatch */
/**
 * @summary authPasswordMatch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * authPasswordMatch MATCHING-RULE ::= {
 *     SYNTAX          PlaintextPasswordSyntax
 *     LDAP-SYNTAX     octetString.&id
 *     LDAP-NAME       {"authPasswordMatch"}
 *     LDAP-DESC       "authentication password matching rule"
 *     ID              { id-at-openldap-schema 2 3 }
 * }
 * ```
 *
 * @constant
 * @type {MATCHING_RULE<PlaintextPasswordSyntax>}
 * @implements {MATCHING_RULE<PlaintextPasswordSyntax>}
 */
export const authPasswordMatch: MATCHING_RULE<PlaintextPasswordSyntax> = {
    class: 'MATCHING-RULE',
    decoderFor: {
        '&AssertionType': _decode_PlaintextPasswordSyntax,
    },
    encoderFor: {
        '&AssertionType': _encode_PlaintextPasswordSyntax,
    },
    '&ldapSyntax': octetString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['authPasswordMatch'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'authentication password matching rule' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [2, 3],
        id_at_openldap_schema
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&AssertionType':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION authPasswordMatch */

/* eslint-enable */
