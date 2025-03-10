/* eslint-disable */
import {
    ASN1Element as _Element,
    UTF8String
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";



/* START_OF_SYMBOL_DEFINITION UTF8Pairs */
/**
 * @summary UTF8Pairs
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * UTF8Pairs  ::=  UTF8String
 * ```
 */
export
type UTF8Pairs = UTF8String; // UTF8String
/* END_OF_SYMBOL_DEFINITION UTF8Pairs */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_UTF8Pairs */
let _cached_decoder_for_UTF8Pairs: $.ASN1Decoder<UTF8Pairs> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_UTF8Pairs */

/* START_OF_SYMBOL_DEFINITION _decode_UTF8Pairs */
/**
 * @summary Decodes an ASN.1 element into a(n) UTF8Pairs
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {UTF8Pairs} The decoded data structure.
 */
export
function _decode_UTF8Pairs (el: _Element) {
    if (!_cached_decoder_for_UTF8Pairs) { _cached_decoder_for_UTF8Pairs = $._decodeUTF8String; }
    return _cached_decoder_for_UTF8Pairs(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_UTF8Pairs */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_UTF8Pairs */
let _cached_encoder_for_UTF8Pairs: $.ASN1Encoder<UTF8Pairs> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_UTF8Pairs */

/* START_OF_SYMBOL_DEFINITION _encode_UTF8Pairs */
/**
 * @summary Encodes a(n) UTF8Pairs into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The UTF8Pairs, encoded as an ASN.1 Element.
 */
export
function _encode_UTF8Pairs (value: UTF8Pairs, elGetter: $.ASN1Encoder<UTF8Pairs>) {
    if (!_cached_encoder_for_UTF8Pairs) { _cached_encoder_for_UTF8Pairs = $._encodeUTF8String; }
    return _cached_encoder_for_UTF8Pairs(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_UTF8Pairs */

/* eslint-enable */
