/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { bitStringMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { BIT_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { id_at_currentList } from '../IN-CS3-object-identifiers/id-at-currentList.va';
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
export { bitStringMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { id_at_currentList } from '../IN-CS3-object-identifiers/id-at-currentList.va';

/* START_OF_SYMBOL_DEFINITION currentList */
/**
 * @summary currentList
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * currentList ATTRIBUTE ::= {
 *   WITH SYNTAX             BIT STRING
 *   EQUALITY MATCHING RULE  bitStringMatch
 *   ID                      id-at-currentList
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<BIT_STRING>}
 * @implements {ATTRIBUTE<BIT_STRING>}
 */
export const currentList: ATTRIBUTE<BIT_STRING> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeBitString,
    },
    encoderFor: {
        '&Type': $._encodeBitString,
    },
    '&equality-match': bitStringMatch /* OBJECT_FIELD_SETTING */,
    '&id': id_at_currentList /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION currentList */

/* eslint-enable */
