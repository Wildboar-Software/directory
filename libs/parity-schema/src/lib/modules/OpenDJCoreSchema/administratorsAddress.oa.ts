/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ia5String } from '@wildboar/x500/SelectedAttributeTypes';
import { IA5String, ObjectIdentifier as _OID } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
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
export { ia5String } from '@wildboar/x500/SelectedAttributeTypes';

/* START_OF_SYMBOL_DEFINITION administratorsAddress */
/**
 * @summary administratorsAddress
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * administratorsAddress ATTRIBUTE ::= {
 *     WITH SYNTAX                 IA5String -- Must encode a URL.
 *     USAGE                       directoryOperation
 *     LDAP-SYNTAX                 ia5String.&id
 *     LDAP-NAME                   { "administratorsAddress" }
 *     LDAP-DESC                   "URIs (including mailto:) that identify the location of the DSA or naming context administrator."
 *     ID                          { 1 3 6 1 4 1 1466 101 120 1 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<IA5String>}
 * @implements {ATTRIBUTE<IA5String>}
 */
export const administratorsAddress: ATTRIBUTE<IA5String> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeIA5String,
    },
    encoderFor: {
        '&Type': $._encodeIA5String,
    },
    '&usage': directoryOperation /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': ia5String['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['administratorsAddress'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'URIs (including mailto:) that identify the location of the DSA or naming context administrator.' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 1466, 101, 120, 1,
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
/* END_OF_SYMBOL_DEFINITION administratorsAddress */

/* eslint-enable */
