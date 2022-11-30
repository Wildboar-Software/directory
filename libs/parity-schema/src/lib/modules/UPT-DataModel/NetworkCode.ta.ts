/* eslint-disable */
import { ASN1Element as _Element, NumericString } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION NetworkCode */
/**
 * @summary NetworkCode
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * NetworkCode  ::=  NumericString(SIZE (1..ub-networkCode))
 * ```
 */
export type NetworkCode = NumericString; // NumericString
/* END_OF_SYMBOL_DEFINITION NetworkCode */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_NetworkCode */
let _cached_decoder_for_NetworkCode: $.ASN1Decoder<NetworkCode> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_NetworkCode */

/* START_OF_SYMBOL_DEFINITION _decode_NetworkCode */
/**
 * @summary Decodes an ASN.1 element into a(n) NetworkCode
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {NetworkCode} The decoded data structure.
 */
export function _decode_NetworkCode(el: _Element) {
    if (!_cached_decoder_for_NetworkCode) {
        _cached_decoder_for_NetworkCode = $._decodeNumericString;
    }
    return _cached_decoder_for_NetworkCode(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_NetworkCode */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_NetworkCode */
let _cached_encoder_for_NetworkCode: $.ASN1Encoder<NetworkCode> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_NetworkCode */

/* START_OF_SYMBOL_DEFINITION _encode_NetworkCode */
/**
 * @summary Encodes a(n) NetworkCode into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The NetworkCode, encoded as an ASN.1 Element.
 */
export function _encode_NetworkCode(
    value: NetworkCode,
    elGetter: $.ASN1Encoder<NetworkCode>
) {
    if (!_cached_encoder_for_NetworkCode) {
        _cached_encoder_for_NetworkCode = $._encodeNumericString;
    }
    return _cached_encoder_for_NetworkCode(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_NetworkCode */

/* eslint-enable */
