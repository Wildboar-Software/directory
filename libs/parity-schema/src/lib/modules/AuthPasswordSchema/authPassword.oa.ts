/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { authPasswordExactMatch } from '../AuthPasswordSchema/authPasswordExactMatch.oa';
import { authPasswordSyntax } from '../AuthPasswordSchema/authPasswordSyntax.oa';
import {
    AuthPasswordSyntax,
    _decode_AuthPasswordSyntax,
    _encode_AuthPasswordSyntax,
} from '../AuthPasswordSchema/AuthPasswordSyntax.ta';
import { id_at_openldap_schema } from '../AuthPasswordSchema/id-at-openldap-schema.va';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
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
} from '@wildboar/x500/InformationFramework';
export { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
export { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
export { authPasswordExactMatch } from '../AuthPasswordSchema/authPasswordExactMatch.oa';
export { authPasswordSyntax } from '../AuthPasswordSchema/authPasswordSyntax.oa';
export {
    AuthPasswordSyntax,
    _decode_AuthPasswordSyntax,
    _encode_AuthPasswordSyntax,
} from '../AuthPasswordSchema/AuthPasswordSyntax.ta';
export { id_at_openldap_schema } from '../AuthPasswordSchema/id-at-openldap-schema.va';

/* START_OF_SYMBOL_DEFINITION authPassword */
/**
 * @summary authPassword
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * authPassword ATTRIBUTE ::= {
 *     WITH SYNTAX                 AuthPasswordSyntax
 *     EQUALITY MATCHING RULE      authPasswordExactMatch
 *     LDAP-SYNTAX                 authPasswordSyntax.&id
 *     LDAP-NAME                   { "authPassword" }
 *     LDAP-DESC                   "password authentication information"
 *     ID                          { id-at-openldap-schema 3 4 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<AuthPasswordSyntax>}
 * @implements {ATTRIBUTE<AuthPasswordSyntax>}
 */
export const authPassword: ATTRIBUTE<AuthPasswordSyntax> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_AuthPasswordSyntax,
    },
    encoderFor: {
        '&Type': _encode_AuthPasswordSyntax,
    },
    '&equality-match': authPasswordExactMatch /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': authPasswordSyntax['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['authPassword'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'password authentication information' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [3, 4],
        id_at_openldap_schema
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
/* END_OF_SYMBOL_DEFINITION authPassword */

/* eslint-enable */
