/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseIgnoreIA5Match } from '@wildboar/x500/SelectedAttributeTypes';
import { caseIgnoreIA5SubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { ia5String } from '@wildboar/x500/SelectedAttributeTypes';
import { IA5String, ObjectIdentifier as _OID } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { id_at } from '../QMailSchema/id-at.va';
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
export { caseIgnoreIA5Match } from '@wildboar/x500/SelectedAttributeTypes';
export { caseIgnoreIA5SubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { ia5String } from '@wildboar/x500/SelectedAttributeTypes';
export { id_at } from '../QMailSchema/id-at.va';

/* START_OF_SYMBOL_DEFINITION mailForwardingAddress */
/**
 * @summary mailForwardingAddress
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * mailForwardingAddress ATTRIBUTE ::= {
 *     WITH SYNTAX                 IA5String
 *     EQUALITY MATCHING RULE         caseIgnoreIA5Match
 *     SUBSTRINGS MATCHING RULE    caseIgnoreIA5SubstringsMatch
 *     LDAP-SYNTAX                 ia5String.&id
 *     LDAP-NAME                     {"mailForwardingAddress"}
 *     LDAP-DESC                   "Address(es) to forward all incoming messages to."
 *     ID                          { id-at 7 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<IA5String>}
 * @implements {ATTRIBUTE<IA5String>}
 */
export const mailForwardingAddress: ATTRIBUTE<IA5String> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeIA5String,
    },
    encoderFor: {
        '&Type': $._encodeIA5String,
    },
    '&equality-match': caseIgnoreIA5Match /* OBJECT_FIELD_SETTING */,
    '&substrings-match':
        caseIgnoreIA5SubstringsMatch /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': ia5String['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['mailForwardingAddress'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Address(es) to forward all incoming messages to.' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [7],
        id_at
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
/* END_OF_SYMBOL_DEFINITION mailForwardingAddress */

/* eslint-enable */
