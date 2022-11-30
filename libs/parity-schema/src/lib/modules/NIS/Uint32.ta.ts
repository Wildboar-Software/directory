/* eslint-disable */
import { ASN1Element as _Element, INTEGER } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION Uint32 */
/**
 * @summary Uint32
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * Uint32  ::=  INTEGER (0..maxUint32)
 * ```
 */
export type Uint32 = INTEGER;
/* END_OF_SYMBOL_DEFINITION Uint32 */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Uint32 */
let _cached_decoder_for_Uint32: $.ASN1Decoder<Uint32> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Uint32 */

/* START_OF_SYMBOL_DEFINITION _decode_Uint32 */
/**
 * @summary Decodes an ASN.1 element into a(n) Uint32
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Uint32} The decoded data structure.
 */
export function _decode_Uint32(el: _Element) {
    if (!_cached_decoder_for_Uint32) {
        _cached_decoder_for_Uint32 = $._decodeInteger;
    }
    return _cached_decoder_for_Uint32(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Uint32 */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Uint32 */
let _cached_encoder_for_Uint32: $.ASN1Encoder<Uint32> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Uint32 */

/* START_OF_SYMBOL_DEFINITION _encode_Uint32 */
/**
 * @summary Encodes a(n) Uint32 into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Uint32, encoded as an ASN.1 Element.
 */
export function _encode_Uint32(value: Uint32, elGetter: $.ASN1Encoder<Uint32>) {
    if (!_cached_encoder_for_Uint32) {
        _cached_encoder_for_Uint32 = $._encodeInteger;
    }
    return _cached_encoder_for_Uint32(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Uint32 */

/* eslint-enable */
