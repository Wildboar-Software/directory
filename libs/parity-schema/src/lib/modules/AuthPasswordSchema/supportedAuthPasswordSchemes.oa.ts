/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseExactIA5Match } from '@wildboar/x500/SelectedAttributeTypes';
import { ia5String } from '@wildboar/x500/SelectedAttributeTypes';
import { IA5String, ObjectIdentifier as _OID } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { id_at_openldap_schema } from '../AuthPasswordSchema/id-at-openldap-schema.va';


/* START_OF_SYMBOL_DEFINITION supportedAuthPasswordSchemes */
/**
 * @summary supportedAuthPasswordSchemes
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * supportedAuthPasswordSchemes ATTRIBUTE ::= {
 *     WITH SYNTAX                 IA5String
 *     EQUALITY MATCHING RULE      caseExactIA5Match
 *     USAGE                       dSAOperation
 *     LDAP-SYNTAX                 ia5String.&id
 *     LDAP-NAME                   { "supportedAuthPasswordSchemes" }
 *     LDAP-DESC                   "supported password storage schemes"
 *     ID                          { id-at-openldap-schema 3 3 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<IA5String>}
 * @implements {ATTRIBUTE<IA5String>}
 */
export const supportedAuthPasswordSchemes: ATTRIBUTE<IA5String> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeIA5String,
    },
    encoderFor: {
        '&Type': $._encodeIA5String,
    },
    '&equality-match': caseExactIA5Match /* OBJECT_FIELD_SETTING */,
    '&usage': dSAOperation /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': ia5String['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['supportedAuthPasswordSchemes'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'supported password storage schemes' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [3, 3],
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
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION supportedAuthPasswordSchemes */

/* eslint-enable */
