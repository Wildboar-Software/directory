/* eslint-disable */
import { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
import {
    DynamicPropValue,
    _decode_DynamicPropValue,
    _encode_DynamicPropValue,
} from '../TraderDefinitions/DynamicPropValue.ta';
import { id_trader_mr_dynamicPropValueMatch } from '../TraderDefinitions/id-trader-mr-dynamicPropValueMatch.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
export { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';
export {
    DynamicPropValue,
    _decode_DynamicPropValue,
    _encode_DynamicPropValue,
} from '../TraderDefinitions/DynamicPropValue.ta';
export { id_trader_mr_dynamicPropValueMatch } from '../TraderDefinitions/id-trader-mr-dynamicPropValueMatch.va';

/* START_OF_SYMBOL_DEFINITION dynamicPropValueMatch */
/**
 * @summary dynamicPropValueMatch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * dynamicPropValueMatch MATCHING-RULE ::= {
 *   SYNTAX  DynamicPropValue
 *   ID      id-trader-mr-dynamicPropValueMatch
 * }
 * ```
 *
 * @constant
 * @type {MATCHING_RULE<DynamicPropValue>}
 * @implements {MATCHING_RULE<DynamicPropValue>}
 */
export const dynamicPropValueMatch: MATCHING_RULE<DynamicPropValue> = {
    class: 'MATCHING-RULE',
    decoderFor: {
        '&AssertionType': _decode_DynamicPropValue,
    },
    encoderFor: {
        '&AssertionType': _encode_DynamicPropValue,
    },
    '&id': id_trader_mr_dynamicPropValueMatch /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&AssertionType':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dynamicPropValueMatch */

/* eslint-enable */
