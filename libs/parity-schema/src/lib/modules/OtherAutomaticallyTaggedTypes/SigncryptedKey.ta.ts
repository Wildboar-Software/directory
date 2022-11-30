/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION SigncryptedKey */
/**
 * @summary SigncryptedKey
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * SigncryptedKey  ::=  OCTET STRING
 * ```
 */
export type SigncryptedKey = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION SigncryptedKey */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SigncryptedKey */
let _cached_decoder_for_SigncryptedKey: $.ASN1Decoder<SigncryptedKey> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SigncryptedKey */

/* START_OF_SYMBOL_DEFINITION _decode_SigncryptedKey */
/**
 * @summary Decodes an ASN.1 element into a(n) SigncryptedKey
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SigncryptedKey} The decoded data structure.
 */
export function _decode_SigncryptedKey(el: _Element) {
    if (!_cached_decoder_for_SigncryptedKey) {
        _cached_decoder_for_SigncryptedKey = $._decodeOctetString;
    }
    return _cached_decoder_for_SigncryptedKey(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SigncryptedKey */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SigncryptedKey */
let _cached_encoder_for_SigncryptedKey: $.ASN1Encoder<SigncryptedKey> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SigncryptedKey */

/* START_OF_SYMBOL_DEFINITION _encode_SigncryptedKey */
/**
 * @summary Encodes a(n) SigncryptedKey into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SigncryptedKey, encoded as an ASN.1 Element.
 */
export function _encode_SigncryptedKey(
    value: SigncryptedKey,
    elGetter: $.ASN1Encoder<SigncryptedKey>
) {
    if (!_cached_encoder_for_SigncryptedKey) {
        _cached_encoder_for_SigncryptedKey = $._encodeOctetString;
    }
    return _cached_encoder_for_SigncryptedKey(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SigncryptedKey */

/* eslint-enable */
