/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { generalizedTime } from '@wildboar/x500/SelectedAttributeTypes';
import { generalizedTimeMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { generalizedTimeOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { GeneralizedTime } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { id_at_pwdChangedTime } from '../LDAPPasswordPolicy/id-at-pwdChangedTime.va';
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
export { generalizedTime } from '@wildboar/x500/SelectedAttributeTypes';
export { generalizedTimeMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { generalizedTimeOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { id_at_pwdChangedTime } from '../LDAPPasswordPolicy/id-at-pwdChangedTime.va';

/* START_OF_SYMBOL_DEFINITION pwdChangedTime */
/**
 * @summary pwdChangedTime
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pwdChangedTime ATTRIBUTE ::= {
 *     WITH SYNTAX                 GeneralizedTime
 *     EQUALITY MATCHING RULE         generalizedTimeMatch
 *     ORDERING MATCHING RULE      generalizedTimeOrderingMatch
 *     SINGLE VALUE                TRUE
 *     NO USER MODIFICATION        TRUE
 *     USAGE                       directoryOperation
 *     LDAP-SYNTAX                 generalizedTime.&id
 *     LDAP-NAME                     {"pwdChangedTime"}
 *     LDAP-DESC                   "The time the password was last changed"
 *     ID                          id-at-pwdChangedTime
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<GeneralizedTime>}
 * @implements {ATTRIBUTE<GeneralizedTime>}
 */
export const pwdChangedTime: ATTRIBUTE<GeneralizedTime> = {
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
    '&ldapName': ['pwdChangedTime'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'The time the password was last changed' /* OBJECT_FIELD_SETTING */,
    '&id': id_at_pwdChangedTime /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pwdChangedTime */

/* eslint-enable */
