/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import * as $ from '@wildboar/asn1/functional';
import {
    DynamicPropValue,
    _decode_DynamicPropValue,
    _encode_DynamicPropValue,
} from '../TraderDefinitions/DynamicPropValue.ta';
import { id_trader_at_dynamicProps } from '../TraderDefinitions/id-trader-at-dynamicProps.va';

export {
    DynamicPropValue,
    _decode_DynamicPropValue,
    _encode_DynamicPropValue,
} from '../TraderDefinitions/DynamicPropValue.ta';

/* START_OF_SYMBOL_DEFINITION dynamicProps */
/**
 * @summary dynamicProps
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * dynamicProps ATTRIBUTE ::= {
 *   WITH SYNTAX  SEQUENCE OF DynamicPropValue
 *   ID           id-trader-at-dynamicProps
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<DynamicPropValue[]>}
 * @implements {ATTRIBUTE<DynamicPropValue[]>}
 */
export const dynamicProps: ATTRIBUTE<DynamicPropValue[]> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeSequenceOf<DynamicPropValue>(
            () => _decode_DynamicPropValue
        ),
    },
    encoderFor: {
        '&Type': $._encodeSequenceOf<DynamicPropValue>(
            () => _encode_DynamicPropValue,
            $.BER
        ),
    },
    '&id': id_trader_at_dynamicProps /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION dynamicProps */

/* eslint-enable */
