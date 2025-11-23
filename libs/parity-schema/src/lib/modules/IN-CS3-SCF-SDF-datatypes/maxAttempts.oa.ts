/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { integerOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { INTEGER } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { id_at_maxAttempts } from '../IN-CS3-object-identifiers/id-at-maxAttempts.va';
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
export { integerOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { id_at_maxAttempts } from '../IN-CS3-object-identifiers/id-at-maxAttempts.va';

/* START_OF_SYMBOL_DEFINITION maxAttempts */
/**
 * @summary maxAttempts
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * maxAttempts ATTRIBUTE ::= {
 *   WITH SYNTAX             INTEGER
 *   ORDERING MATCHING RULE  integerOrderingMatch
 *   SINGLE VALUE            TRUE
 *   ID                      id-at-maxAttempts
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<INTEGER>}
 * @implements {ATTRIBUTE<INTEGER>}
 */
export const maxAttempts: ATTRIBUTE<INTEGER> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeInteger,
    },
    encoderFor: {
        '&Type': $._encodeInteger,
    },
    '&ordering-match': integerOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_at_maxAttempts /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION maxAttempts */

/* eslint-enable */
