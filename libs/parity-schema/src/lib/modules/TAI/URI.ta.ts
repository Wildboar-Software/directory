/* eslint-disable */
import { ASN1Element as _Element, UTF8String } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION URI */
/**
 * @summary URI
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * URI  ::=
 *   UTF8String
 *     (CONSTRAINED BY {
 *        -- shall be a valid URI as defined in IETF RFC 3986 --})
 * ```
 */
export type URI = UTF8String; // UTF8String
/* END_OF_SYMBOL_DEFINITION URI */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_URI */
let _cached_decoder_for_URI: $.ASN1Decoder<URI> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_URI */

/* START_OF_SYMBOL_DEFINITION _decode_URI */
/**
 * @summary Decodes an ASN.1 element into a(n) URI
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {URI} The decoded data structure.
 */
export function _decode_URI(el: _Element) {
    if (!_cached_decoder_for_URI) {
        _cached_decoder_for_URI = $._decodeUTF8String;
    }
    return _cached_decoder_for_URI(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_URI */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_URI */
let _cached_encoder_for_URI: $.ASN1Encoder<URI> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_URI */

/* START_OF_SYMBOL_DEFINITION _encode_URI */
/**
 * @summary Encodes a(n) URI into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The URI, encoded as an ASN.1 Element.
 */
export function _encode_URI(value: URI, elGetter: $.ASN1Encoder<URI>) {
    if (!_cached_encoder_for_URI) {
        _cached_encoder_for_URI = $._encodeUTF8String;
    }
    return _cached_encoder_for_URI(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_URI */

/* eslint-enable */
