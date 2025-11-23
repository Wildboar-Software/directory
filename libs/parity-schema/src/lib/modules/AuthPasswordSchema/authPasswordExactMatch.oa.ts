/* eslint-disable */
import { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { authPasswordSyntax } from '../AuthPasswordSchema/authPasswordSyntax.oa';
import {
    AuthPasswordSyntax,
    _decode_AuthPasswordSyntax,
    _encode_AuthPasswordSyntax,
} from '../AuthPasswordSchema/AuthPasswordSyntax.ta';
import { id_at_openldap_schema } from '../AuthPasswordSchema/id-at-openldap-schema.va';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
export { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
export { authPasswordSyntax } from '../AuthPasswordSchema/authPasswordSyntax.oa';
export {
    AuthPasswordSyntax,
    _decode_AuthPasswordSyntax,
    _encode_AuthPasswordSyntax,
} from '../AuthPasswordSchema/AuthPasswordSyntax.ta';
export { id_at_openldap_schema } from '../AuthPasswordSchema/id-at-openldap-schema.va';

/* START_OF_SYMBOL_DEFINITION authPasswordExactMatch */
/**
 * @summary authPasswordExactMatch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * authPasswordExactMatch MATCHING-RULE ::= {
 *     SYNTAX          AuthPasswordSyntax
 *     LDAP-SYNTAX     authPasswordSyntax.&id
 *     LDAP-NAME       {"authPasswordExactMatch"}
 *     LDAP-DESC       "authentication password exact matching rule"
 *     ID              { id-at-openldap-schema 2 2 }
 * }
 * ```
 *
 * @constant
 * @type {MATCHING_RULE<AuthPasswordSyntax>}
 * @implements {MATCHING_RULE<AuthPasswordSyntax>}
 */
export const authPasswordExactMatch: MATCHING_RULE<AuthPasswordSyntax> = {
    class: 'MATCHING-RULE',
    decoderFor: {
        '&AssertionType': _decode_AuthPasswordSyntax,
    },
    encoderFor: {
        '&AssertionType': _encode_AuthPasswordSyntax,
    },
    '&ldapSyntax': authPasswordSyntax['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['authPasswordExactMatch'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'authentication password exact matching rule' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [2, 2],
        id_at_openldap_schema
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&AssertionType':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION authPasswordExactMatch */

/* eslint-enable */
