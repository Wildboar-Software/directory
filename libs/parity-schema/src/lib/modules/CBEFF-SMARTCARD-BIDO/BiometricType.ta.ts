/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION BiometricType */
/**
 * @summary BiometricType
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BiometricType  ::=  OCTET STRING(SIZE (1..3))
 * ```
 */
export type BiometricType = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION BiometricType */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricType */
let _cached_decoder_for_BiometricType: $.ASN1Decoder<BiometricType> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricType */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricType */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricType
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricType} The decoded data structure.
 */
export function _decode_BiometricType(el: _Element) {
    if (!_cached_decoder_for_BiometricType) {
        _cached_decoder_for_BiometricType = $._decodeOctetString;
    }
    return _cached_decoder_for_BiometricType(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricType */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricType */
let _cached_encoder_for_BiometricType: $.ASN1Encoder<BiometricType> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricType */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricType */
/**
 * @summary Encodes a(n) BiometricType into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricType, encoded as an ASN.1 Element.
 */
export function _encode_BiometricType(
    value: BiometricType,
    elGetter: $.ASN1Encoder<BiometricType>
) {
    if (!_cached_encoder_for_BiometricType) {
        _cached_encoder_for_BiometricType = $._encodeOctetString;
    }
    return _cached_encoder_for_BiometricType(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricType */

/* eslint-enable */
