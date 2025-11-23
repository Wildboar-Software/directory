/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { integer } from '@wildboar/x500/SelectedAttributeTypes';
import { integerMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { INTEGER, ObjectIdentifier as _OID } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { id_at } from '../KerberosSchema/id-at.va';
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
export { integer } from '@wildboar/x500/SelectedAttributeTypes';
export { integerMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { id_at } from '../KerberosSchema/id-at.va';

/* START_OF_SYMBOL_DEFINITION krbPrincipalType */
/**
 * @summary krbPrincipalType
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * krbPrincipalType ATTRIBUTE ::= {
 *     WITH SYNTAX                 INTEGER
 *     EQUALITY MATCHING RULE         integerMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 integer.&id
 *     LDAP-NAME                     {"krbPrincipalType"}
 *     LDAP-DESC                   "This specifies the type of the principal, the types could be any of the types mentioned in section 6.2 of RFC 4120"
 *     ID                          { id-at 3 1 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<INTEGER>}
 * @implements {ATTRIBUTE<INTEGER>}
 */
export const krbPrincipalType: ATTRIBUTE<INTEGER> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeInteger,
    },
    encoderFor: {
        '&Type': $._encodeInteger,
    },
    '&equality-match': integerMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': integer['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['krbPrincipalType'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'This specifies the type of the principal, the types could be any of the types mentioned in section 6.2 of RFC 4120' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [3, 1],
        id_at
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION krbPrincipalType */

/* eslint-enable */
