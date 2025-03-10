/* eslint-disable */
import {
    ASN1Element as _Element,
    UTF8String
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";


/* START_OF_SYMBOL_DEFINITION Authenticator */
/**
 * @summary Authenticator
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * Authenticator  ::=  UTF8String
 * ```
 */
export
type Authenticator = UTF8String; // UTF8String
/* END_OF_SYMBOL_DEFINITION Authenticator */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Authenticator */
let _cached_decoder_for_Authenticator: $.ASN1Decoder<Authenticator> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Authenticator */

/* START_OF_SYMBOL_DEFINITION _decode_Authenticator */
/**
 * @summary Decodes an ASN.1 element into a(n) Authenticator
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Authenticator} The decoded data structure.
 */
export
function _decode_Authenticator (el: _Element) {
    if (!_cached_decoder_for_Authenticator) { _cached_decoder_for_Authenticator = $._decodeUTF8String; }
    return _cached_decoder_for_Authenticator(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Authenticator */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Authenticator */
let _cached_encoder_for_Authenticator: $.ASN1Encoder<Authenticator> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Authenticator */

/* START_OF_SYMBOL_DEFINITION _encode_Authenticator */
/**
 * @summary Encodes a(n) Authenticator into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Authenticator, encoded as an ASN.1 Element.
 */
export
function _encode_Authenticator (value: Authenticator, elGetter: $.ASN1Encoder<Authenticator>) {
    if (!_cached_encoder_for_Authenticator) { _cached_encoder_for_Authenticator = $._encodeUTF8String; }
    return _cached_encoder_for_Authenticator(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Authenticator */

/* eslint-enable */
