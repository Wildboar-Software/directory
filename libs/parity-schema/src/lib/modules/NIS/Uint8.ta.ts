/* eslint-disable */
import { ASN1Element as _Element, INTEGER } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION Uint8 */
/**
 * @summary Uint8
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * Uint8   ::=  INTEGER (0..maxUint8)
 * ```
 */
export type Uint8 = INTEGER;
/* END_OF_SYMBOL_DEFINITION Uint8 */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Uint8 */
let _cached_decoder_for_Uint8: $.ASN1Decoder<Uint8> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Uint8 */

/* START_OF_SYMBOL_DEFINITION _decode_Uint8 */
/**
 * @summary Decodes an ASN.1 element into a(n) Uint8
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Uint8} The decoded data structure.
 */
export function _decode_Uint8(el: _Element) {
    if (!_cached_decoder_for_Uint8) {
        _cached_decoder_for_Uint8 = $._decodeInteger;
    }
    return _cached_decoder_for_Uint8(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Uint8 */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Uint8 */
let _cached_encoder_for_Uint8: $.ASN1Encoder<Uint8> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Uint8 */

/* START_OF_SYMBOL_DEFINITION _encode_Uint8 */
/**
 * @summary Encodes a(n) Uint8 into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Uint8, encoded as an ASN.1 Element.
 */
export function _encode_Uint8(value: Uint8, elGetter: $.ASN1Encoder<Uint8>) {
    if (!_cached_encoder_for_Uint8) {
        _cached_encoder_for_Uint8 = $._encodeInteger;
    }
    return _cached_encoder_for_Uint8(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Uint8 */

/* eslint-enable */
