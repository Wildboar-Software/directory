/* eslint-disable */
import {
    ASN1Element as _Element,
    UTF8String
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";



/* START_OF_SYMBOL_DEFINITION RegToken */
/**
 * @summary RegToken
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * RegToken  ::=  UTF8String
 * ```
 */
export
type RegToken = UTF8String; // UTF8String
/* END_OF_SYMBOL_DEFINITION RegToken */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_RegToken */
let _cached_decoder_for_RegToken: $.ASN1Decoder<RegToken> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_RegToken */

/* START_OF_SYMBOL_DEFINITION _decode_RegToken */
/**
 * @summary Decodes an ASN.1 element into a(n) RegToken
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {RegToken} The decoded data structure.
 */
export
function _decode_RegToken (el: _Element) {
    if (!_cached_decoder_for_RegToken) { _cached_decoder_for_RegToken = $._decodeUTF8String; }
    return _cached_decoder_for_RegToken(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_RegToken */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_RegToken */
let _cached_encoder_for_RegToken: $.ASN1Encoder<RegToken> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_RegToken */

/* START_OF_SYMBOL_DEFINITION _encode_RegToken */
/**
 * @summary Encodes a(n) RegToken into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The RegToken, encoded as an ASN.1 Element.
 */
export
function _encode_RegToken (value: RegToken, elGetter: $.ASN1Encoder<RegToken>) {
    if (!_cached_encoder_for_RegToken) { _cached_encoder_for_RegToken = $._encodeUTF8String; }
    return _cached_encoder_for_RegToken(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_RegToken */

/* eslint-enable */
