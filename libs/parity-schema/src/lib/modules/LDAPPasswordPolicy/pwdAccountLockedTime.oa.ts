/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { generalizedTime } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/generalizedTime.oa';
import { generalizedTimeMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/generalizedTimeMatch.oa';
import { generalizedTimeOrderingMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/generalizedTimeOrderingMatch.oa';
import { GeneralizedTime } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import { id_at_pwdAccountLockedTime } from '../LDAPPasswordPolicy/id-at-pwdAccountLockedTime.va';
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
export { generalizedTime } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/generalizedTime.oa';
export { generalizedTimeMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/generalizedTimeMatch.oa';
export { generalizedTimeOrderingMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/generalizedTimeOrderingMatch.oa';
export { id_at_pwdAccountLockedTime } from '../LDAPPasswordPolicy/id-at-pwdAccountLockedTime.va';

/* START_OF_SYMBOL_DEFINITION pwdAccountLockedTime */
/**
 * @summary pwdAccountLockedTime
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pwdAccountLockedTime ATTRIBUTE ::= {
 *     WITH SYNTAX                 GeneralizedTime
 *     EQUALITY MATCHING RULE         generalizedTimeMatch
 *     ORDERING MATCHING RULE      generalizedTimeOrderingMatch
 *     SINGLE VALUE                TRUE
 *     NO USER MODIFICATION        TRUE
 *     USAGE                       directoryOperation
 *     LDAP-SYNTAX                 generalizedTime.&id
 *     LDAP-NAME                     {"pwdAccountLockedTime"}
 *     LDAP-DESC                   "The time an user account was locked"
 *     ID                          id-at-pwdAccountLockedTime
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<GeneralizedTime>}
 * @implements {ATTRIBUTE<GeneralizedTime>}
 */
export const pwdAccountLockedTime: ATTRIBUTE<GeneralizedTime> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeGeneralizedTime,
    },
    encoderFor: {
        '&Type': $._encodeGeneralizedTime,
    },
    '&equality-match': generalizedTimeMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': generalizedTimeOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&no-user-modification': true /* OBJECT_FIELD_SETTING */,
    '&usage': directoryOperation /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': generalizedTime['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['pwdAccountLockedTime'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'The time an user account was locked' /* OBJECT_FIELD_SETTING */,
    '&id': id_at_pwdAccountLockedTime /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pwdAccountLockedTime */

/* eslint-enable */
