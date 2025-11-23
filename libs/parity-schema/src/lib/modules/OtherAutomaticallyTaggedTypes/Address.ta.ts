/* eslint-disable */
import { ASN1Element as _Element, UTF8String } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION Address */
/**
 * @summary Address
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * Address  ::=  UTF8String
 * ```
 */
export type Address = UTF8String; // UTF8String
/* END_OF_SYMBOL_DEFINITION Address */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Address */
let _cached_decoder_for_Address: $.ASN1Decoder<Address> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Address */

/* START_OF_SYMBOL_DEFINITION _decode_Address */
/**
 * @summary Decodes an ASN.1 element into a(n) Address
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Address} The decoded data structure.
 */
export function _decode_Address(el: _Element) {
    if (!_cached_decoder_for_Address) {
        _cached_decoder_for_Address = $._decodeUTF8String;
    }
    return _cached_decoder_for_Address(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Address */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Address */
let _cached_encoder_for_Address: $.ASN1Encoder<Address> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Address */

/* START_OF_SYMBOL_DEFINITION _encode_Address */
/**
 * @summary Encodes a(n) Address into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Address, encoded as an ASN.1 Element.
 */
export function _encode_Address(
    value: Address,
    elGetter: $.ASN1Encoder<Address>
) {
    if (!_cached_encoder_for_Address) {
        _cached_encoder_for_Address = $._encodeUTF8String;
    }
    return _cached_encoder_for_Address(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Address */

/* eslint-enable */
