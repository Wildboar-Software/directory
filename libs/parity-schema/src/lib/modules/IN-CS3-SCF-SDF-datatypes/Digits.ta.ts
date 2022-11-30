/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION Digits */
/**
 * @summary Digits
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * Digits  ::=  OCTET STRING
 * ```
 */
export type Digits = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION Digits */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Digits */
let _cached_decoder_for_Digits: $.ASN1Decoder<Digits> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Digits */

/* START_OF_SYMBOL_DEFINITION _decode_Digits */
/**
 * @summary Decodes an ASN.1 element into a(n) Digits
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Digits} The decoded data structure.
 */
export function _decode_Digits(el: _Element) {
    if (!_cached_decoder_for_Digits) {
        _cached_decoder_for_Digits = $._decodeOctetString;
    }
    return _cached_decoder_for_Digits(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Digits */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Digits */
let _cached_encoder_for_Digits: $.ASN1Encoder<Digits> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Digits */

/* START_OF_SYMBOL_DEFINITION _encode_Digits */
/**
 * @summary Encodes a(n) Digits into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Digits, encoded as an ASN.1 Element.
 */
export function _encode_Digits(value: Digits, elGetter: $.ASN1Encoder<Digits>) {
    if (!_cached_encoder_for_Digits) {
        _cached_encoder_for_Digits = $._encodeOctetString;
    }
    return _cached_encoder_for_Digits(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Digits */

/* eslint-enable */
