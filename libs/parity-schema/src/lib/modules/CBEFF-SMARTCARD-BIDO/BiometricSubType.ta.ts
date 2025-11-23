/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION BiometricSubType */
/**
 * @summary BiometricSubType
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BiometricSubType  ::=  OCTET STRING(SIZE (1))
 * ```
 */
export type BiometricSubType = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION BiometricSubType */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricSubType */
let _cached_decoder_for_BiometricSubType: $.ASN1Decoder<BiometricSubType> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricSubType */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricSubType */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricSubType
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricSubType} The decoded data structure.
 */
export function _decode_BiometricSubType(el: _Element) {
    if (!_cached_decoder_for_BiometricSubType) {
        _cached_decoder_for_BiometricSubType = $._decodeOctetString;
    }
    return _cached_decoder_for_BiometricSubType(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricSubType */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricSubType */
let _cached_encoder_for_BiometricSubType: $.ASN1Encoder<BiometricSubType> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricSubType */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricSubType */
/**
 * @summary Encodes a(n) BiometricSubType into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricSubType, encoded as an ASN.1 Element.
 */
export function _encode_BiometricSubType(
    value: BiometricSubType,
    elGetter: $.ASN1Encoder<BiometricSubType>
) {
    if (!_cached_encoder_for_BiometricSubType) {
        _cached_encoder_for_BiometricSubType = $._encodeOctetString;
    }
    return _cached_encoder_for_BiometricSubType(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricSubType */

/* eslint-enable */
