/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { integerMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integerMatch.oa';
import {
    FollowOption,
    _decode_FollowOption,
    _encode_FollowOption,
} from '../TraderDefinitions/FollowOption.ta';
import { id_trader_at_limitingFollowRule } from '../TraderDefinitions/id-trader-at-limitingFollowRule.va';
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
export { integerMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integerMatch.oa';
export {
    always /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    FollowOption,
    FollowOption_always /* IMPORTED_LONG_ENUMERATION_ITEM */,
    FollowOption_ifNoLocal /* IMPORTED_LONG_ENUMERATION_ITEM */,
    FollowOption_localOnly /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ifNoLocal /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    localOnly /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_FollowOption,
    _encode_FollowOption,
    _enum_for_FollowOption,
} from '../TraderDefinitions/FollowOption.ta';
export { id_trader_at_limitingFollowRule } from '../TraderDefinitions/id-trader-at-limitingFollowRule.va';

/* START_OF_SYMBOL_DEFINITION limitingFollowRule */
/**
 * @summary limitingFollowRule
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * limitingFollowRule ATTRIBUTE ::= {
 *   WITH SYNTAX             FollowOption
 *   EQUALITY MATCHING RULE  integerMatch
 *   SINGLE VALUE            TRUE
 *   ID                      id-trader-at-limitingFollowRule
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<FollowOption>}
 * @implements {ATTRIBUTE<FollowOption>}
 */
export const limitingFollowRule: ATTRIBUTE<FollowOption> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_FollowOption,
    },
    encoderFor: {
        '&Type': _encode_FollowOption,
    },
    '&equality-match': integerMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_at_limitingFollowRule /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION limitingFollowRule */

/* eslint-enable */
