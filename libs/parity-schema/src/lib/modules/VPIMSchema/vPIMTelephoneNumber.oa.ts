/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { numericString } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/numericString.oa';
import { numericStringMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/numericStringMatch.oa';
import { numericStringOrderingMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/numericStringOrderingMatch.oa';
import { numericStringSubstringsMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/numericStringSubstringsMatch.oa';
import { NumericString, ObjectIdentifier as _OID } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import { iana_assigned_oid } from '../VPIMSchema/iana-assigned-oid.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
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
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
export { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
export { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';
export { iana_assigned_oid } from '../VPIMSchema/iana-assigned-oid.va';

/* START_OF_SYMBOL_DEFINITION vPIMTelephoneNumber */
/**
 * @summary vPIMTelephoneNumber
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * vPIMTelephoneNumber ATTRIBUTE ::= {
 *     WITH SYNTAX                 NumericString (SIZE (1..20))
 *     EQUALITY MATCHING RULE         numericStringMatch
 *     ORDERING MATCHING RULE      numericStringOrderingMatch
 *     SUBSTRINGS MATCHING RULE     numericStringSubstringsMatch
 *     LDAP-SYNTAX                 numericString.&id
 *     LDAP-NAME                     {"vPIMTelephoneNumber"}
 *     ID                          { iana-assigned-oid 2 1 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<NumericString>}
 * @implements {ATTRIBUTE<NumericString>}
 */
export const vPIMTelephoneNumber: ATTRIBUTE<NumericString> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeNumericString,
    },
    encoderFor: {
        '&Type': $._encodeNumericString,
    },
    '&equality-match': numericStringMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': numericStringOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match':
        numericStringSubstringsMatch /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': numericString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['vPIMTelephoneNumber'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [2, 1],
        iana_assigned_oid
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
/* END_OF_SYMBOL_DEFINITION vPIMTelephoneNumber */

/* eslint-enable */
