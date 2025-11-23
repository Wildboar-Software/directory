/* eslint-disable */
import { ASN1Element as _Element, INTEGER } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION BinaryTime */
/**
 * @summary BinaryTime
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BinaryTime  ::=  INTEGER (0..MAX)
 * ```
 */
export type BinaryTime = INTEGER;
/* END_OF_SYMBOL_DEFINITION BinaryTime */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BinaryTime */
let _cached_decoder_for_BinaryTime: $.ASN1Decoder<BinaryTime> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BinaryTime */

/* START_OF_SYMBOL_DEFINITION _decode_BinaryTime */
/**
 * @summary Decodes an ASN.1 element into a(n) BinaryTime
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BinaryTime} The decoded data structure.
 */
export function _decode_BinaryTime(el: _Element) {
    if (!_cached_decoder_for_BinaryTime) {
        _cached_decoder_for_BinaryTime = $._decodeInteger;
    }
    return _cached_decoder_for_BinaryTime(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BinaryTime */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BinaryTime */
let _cached_encoder_for_BinaryTime: $.ASN1Encoder<BinaryTime> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BinaryTime */

/* START_OF_SYMBOL_DEFINITION _encode_BinaryTime */
/**
 * @summary Encodes a(n) BinaryTime into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BinaryTime, encoded as an ASN.1 Element.
 */
export function _encode_BinaryTime(
    value: BinaryTime,
    elGetter: $.ASN1Encoder<BinaryTime>
) {
    if (!_cached_encoder_for_BinaryTime) {
        _cached_encoder_for_BinaryTime = $._encodeInteger;
    }
    return _cached_encoder_for_BinaryTime(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BinaryTime */

/* eslint-enable */
