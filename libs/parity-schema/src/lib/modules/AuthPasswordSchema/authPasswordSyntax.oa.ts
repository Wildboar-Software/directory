/* eslint-disable */
import type { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import {
    AuthPasswordSyntax,
    _decode_AuthPasswordSyntax,
    _encode_AuthPasswordSyntax,
} from '../AuthPasswordSchema/AuthPasswordSyntax.ta';
import { id_at_openldap_schema } from '../AuthPasswordSchema/id-at-openldap-schema.va';
export {
    AuthPasswordSyntax,
    _decode_AuthPasswordSyntax,
    _encode_AuthPasswordSyntax,
} from '../AuthPasswordSchema/AuthPasswordSyntax.ta';

/* START_OF_SYMBOL_DEFINITION authPasswordSyntax */
/**
 * @summary authPasswordSyntax
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * authPasswordSyntax SYNTAX-NAME ::= {
 *     LDAP-DESC           "authentication password syntax"
 *     DIRECTORY SYNTAX    AuthPasswordSyntax
 *     ID                  { id-at-openldap-schema 1 2 }
 * }
 * ```
 *
 * @constant
 * @type {SYNTAX_NAME<AuthPasswordSyntax>}
 * @implements {SYNTAX_NAME<AuthPasswordSyntax>}
 */
export const authPasswordSyntax: SYNTAX_NAME<AuthPasswordSyntax> = {
    class: 'SYNTAX-NAME',
    decoderFor: {
        '&Type': _decode_AuthPasswordSyntax,
    },
    encoderFor: {
        '&Type': _encode_AuthPasswordSyntax,
    },
    '&ldapDesc': 'authentication password syntax' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [1, 2],
        id_at_openldap_schema
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION authPasswordSyntax */

/* eslint-enable */
