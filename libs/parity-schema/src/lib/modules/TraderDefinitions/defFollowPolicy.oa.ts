/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { integerMatch } from '@wildboar/x500/SelectedAttributeTypes';
import {
    FollowOption,
    _decode_FollowOption,
    _encode_FollowOption,
} from '../TraderDefinitions/FollowOption.ta';
import { id_trader_at_defFollowPolicy } from '../TraderDefinitions/id-trader-at-defFollowPolicy.va';

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

/* START_OF_SYMBOL_DEFINITION defFollowPolicy */
/**
 * @summary defFollowPolicy
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * defFollowPolicy ATTRIBUTE ::= {
 *   WITH SYNTAX             FollowOption
 *   EQUALITY MATCHING RULE  integerMatch
 *   SINGLE VALUE            TRUE
 *   ID                      id-trader-at-defFollowPolicy
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<FollowOption>}
 * @implements {ATTRIBUTE<FollowOption>}
 */
export const defFollowPolicy: ATTRIBUTE<FollowOption> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_FollowOption,
    },
    encoderFor: {
        '&Type': _encode_FollowOption,
    },
    '&equality-match': integerMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_at_defFollowPolicy /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION defFollowPolicy */

/* eslint-enable */
