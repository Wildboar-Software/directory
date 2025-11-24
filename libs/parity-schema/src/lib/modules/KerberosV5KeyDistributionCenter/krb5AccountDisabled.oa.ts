/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { boolean_ } from '@wildboar/x500/SelectedAttributeTypes';
import { booleanMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { BOOLEAN, ObjectIdentifier as _OID } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';


/* START_OF_SYMBOL_DEFINITION krb5AccountDisabled */
/**
 * @summary krb5AccountDisabled
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * krb5AccountDisabled ATTRIBUTE ::= {
 *     WITH SYNTAX                 BOOLEAN
 *     EQUALITY MATCHING RULE      booleanMatch
 *     SINGLE VALUE                TRUE
 *     USAGE                       userApplications
 *     LDAP-SYNTAX                 boolean.&id
 *     LDAP-NAME                   {"krb5AccountDisabled"}
 *     ID                          { 1 3 6 1 4 1 5322 10 1 13 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<BOOLEAN>}
 * @implements {ATTRIBUTE<BOOLEAN>}
 */
export const krb5AccountDisabled: ATTRIBUTE<BOOLEAN> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeBoolean,
    },
    encoderFor: {
        '&Type': $._encodeBoolean,
    },
    '&equality-match': booleanMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&usage': userApplications /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': boolean_['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['krb5AccountDisabled'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 5322, 10, 1, 13,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION krb5AccountDisabled */

/* eslint-enable */
