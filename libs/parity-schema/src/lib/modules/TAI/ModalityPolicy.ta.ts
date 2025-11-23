/* eslint-disable */
import { ASN1Element as _Element, UniversalString } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION ModalityPolicy */
/**
 * @summary ModalityPolicy
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ModalityPolicy  ::=  UniversalString
 * ```
 */
export type ModalityPolicy = UniversalString; // UniversalString
/* END_OF_SYMBOL_DEFINITION ModalityPolicy */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ModalityPolicy */
let _cached_decoder_for_ModalityPolicy: $.ASN1Decoder<ModalityPolicy> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ModalityPolicy */

/* START_OF_SYMBOL_DEFINITION _decode_ModalityPolicy */
/**
 * @summary Decodes an ASN.1 element into a(n) ModalityPolicy
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ModalityPolicy} The decoded data structure.
 */
export function _decode_ModalityPolicy(el: _Element) {
    if (!_cached_decoder_for_ModalityPolicy) {
        _cached_decoder_for_ModalityPolicy = $._decodeUniversalString;
    }
    return _cached_decoder_for_ModalityPolicy(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ModalityPolicy */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ModalityPolicy */
let _cached_encoder_for_ModalityPolicy: $.ASN1Encoder<ModalityPolicy> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ModalityPolicy */

/* START_OF_SYMBOL_DEFINITION _encode_ModalityPolicy */
/**
 * @summary Encodes a(n) ModalityPolicy into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ModalityPolicy, encoded as an ASN.1 Element.
 */
export function _encode_ModalityPolicy(
    value: ModalityPolicy,
    elGetter: $.ASN1Encoder<ModalityPolicy>
) {
    if (!_cached_encoder_for_ModalityPolicy) {
        _cached_encoder_for_ModalityPolicy = $._encodeUniversalString;
    }
    return _cached_encoder_for_ModalityPolicy(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ModalityPolicy */

/* eslint-enable */
