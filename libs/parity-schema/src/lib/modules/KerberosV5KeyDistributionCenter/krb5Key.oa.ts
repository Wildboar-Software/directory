/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID, OCTET_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';


/* START_OF_SYMBOL_DEFINITION krb5Key */
/**
 * @summary krb5Key
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * krb5Key ATTRIBUTE ::= {
 *     WITH SYNTAX                 OCTET STRING
 *     USAGE                       userApplications
 *     LDAP-SYNTAX                 { 1 3 6 1 4 1 1466 115 121 1 5 }
 *     LDAP-NAME                   {"krb5Key"}
 *     LDAP-DESC                   "Encoded ASN1 Key as an octet string"
 *     ID                          { 1 3 6 1 4 1 5322 10 1 10 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<OCTET_STRING>}
 * @implements {ATTRIBUTE<OCTET_STRING>}
 */
export const krb5Key: ATTRIBUTE<OCTET_STRING> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeOctetString,
    },
    encoderFor: {
        '&Type': $._encodeOctetString,
    },
    '&usage': userApplications /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 5,
    ]) /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['krb5Key'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Encoded ASN1 Key as an octet string' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 5322, 10, 1, 10,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&single-valued':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION krb5Key */

/* eslint-enable */
