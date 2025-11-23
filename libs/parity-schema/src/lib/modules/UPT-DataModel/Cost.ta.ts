/* eslint-disable */
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    INTEGER,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    CurrencyValue,
    _decode_CurrencyValue,
    _encode_CurrencyValue,
} from '../UPT-DataModel/CurrencyValue.ta';

/* START_OF_SYMBOL_DEFINITION Cost */
/**
 * @summary Cost
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * Cost  ::=  CHOICE {pulse  [0]  INTEGER(1..ub-pulse),
 *                  cost   [1]  CurrencyValue
 * }
 * ```
 */
export type Cost =
    | { pulse: INTEGER } /* CHOICE_ALT_ROOT */
    | { cost: CurrencyValue } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION Cost */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Cost */
let _cached_decoder_for_Cost: $.ASN1Decoder<Cost> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Cost */

/* START_OF_SYMBOL_DEFINITION _decode_Cost */
/**
 * @summary Decodes an ASN.1 element into a(n) Cost
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Cost} The decoded data structure.
 */
export function _decode_Cost(el: _Element) {
    if (!_cached_decoder_for_Cost) {
        _cached_decoder_for_Cost = $._decode_inextensible_choice<Cost>({
            'CONTEXT 0': [
                'pulse',
                $._decode_implicit<INTEGER>(() => $._decodeInteger),
            ],
            'CONTEXT 1': [
                'cost',
                $._decode_explicit<CurrencyValue>(() => _decode_CurrencyValue),
            ],
        });
    }
    return _cached_decoder_for_Cost(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Cost */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Cost */
let _cached_encoder_for_Cost: $.ASN1Encoder<Cost> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Cost */

/* START_OF_SYMBOL_DEFINITION _encode_Cost */
/**
 * @summary Encodes a(n) Cost into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Cost, encoded as an ASN.1 Element.
 */
export function _encode_Cost(value: Cost, elGetter: $.ASN1Encoder<Cost>) {
    if (!_cached_encoder_for_Cost) {
        _cached_encoder_for_Cost = $._encode_choice<Cost>(
            {
                pulse: $._encode_implicit(
                    _TagClass.context,
                    0,
                    () => $._encodeInteger,
                    $.BER
                ),
                cost: $._encode_explicit(
                    _TagClass.context,
                    1,
                    () => _encode_CurrencyValue,
                    $.BER
                ),
            },
            $.BER
        );
    }
    return _cached_encoder_for_Cost(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Cost */

/* eslint-enable */
