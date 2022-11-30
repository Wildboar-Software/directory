/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { telephoneNr } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telephoneNr.oa';
import {
    TelephoneNumber,
    _decode_TelephoneNumber,
    _encode_TelephoneNumber,
} from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/TelephoneNumber.ta';
import { telephoneNumberMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telephoneNumberMatch.oa';
import { telephoneNumberSubstringsMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telephoneNumberSubstringsMatch.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { pilotAttributeType } from '../Cosine/pilotAttributeType.va';
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
export { telephoneNr } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telephoneNr.oa';
export {
    TelephoneNumber,
    _decode_TelephoneNumber,
    _encode_TelephoneNumber,
} from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/TelephoneNumber.ta';
export { telephoneNumberMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telephoneNumberMatch.oa';
export { telephoneNumberSubstringsMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telephoneNumberSubstringsMatch.oa';
export { pilotAttributeType } from '../Cosine/pilotAttributeType.va';

/* START_OF_SYMBOL_DEFINITION homeTelephoneNumber */
/**
 * @summary homeTelephoneNumber
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * homeTelephoneNumber ATTRIBUTE ::= {
 *     WITH SYNTAX                 TelephoneNumber
 *     EQUALITY MATCHING RULE         telephoneNumberMatch
 *     SUBSTRINGS MATCHING RULE     telephoneNumberSubstringsMatch
 *     LDAP-SYNTAX                 telephoneNr.&id
 *     LDAP-NAME                     {"homeTelephoneNumber", "homePhone"}
 *     LDAP-DESC                    "RFC1274: home telephone number"
 *     ID { pilotAttributeType 20 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<TelephoneNumber>}
 * @implements {ATTRIBUTE<TelephoneNumber>}
 */
export const homeTelephoneNumber: ATTRIBUTE<TelephoneNumber> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_TelephoneNumber,
    },
    encoderFor: {
        '&Type': _encode_TelephoneNumber,
    },
    '&equality-match': telephoneNumberMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match':
        telephoneNumberSubstringsMatch /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': telephoneNr['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': [
        'homeTelephoneNumber',
        'homePhone',
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'RFC1274: home telephone number' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [20],
        pilotAttributeType
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
/* END_OF_SYMBOL_DEFINITION homeTelephoneNumber */

/* eslint-enable */
