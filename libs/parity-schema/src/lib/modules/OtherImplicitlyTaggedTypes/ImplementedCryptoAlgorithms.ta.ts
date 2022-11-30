/* eslint-disable */
import { ASN1Element as _Element, OBJECT_IDENTIFIER } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION ImplementedCryptoAlgorithms */
/**
 * @summary ImplementedCryptoAlgorithms
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ImplementedCryptoAlgorithms  ::=  SEQUENCE OF OBJECT IDENTIFIER
 * ```
 */
export type ImplementedCryptoAlgorithms = OBJECT_IDENTIFIER[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION ImplementedCryptoAlgorithms */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ImplementedCryptoAlgorithms */
let _cached_decoder_for_ImplementedCryptoAlgorithms: $.ASN1Decoder<ImplementedCryptoAlgorithms> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ImplementedCryptoAlgorithms */

/* START_OF_SYMBOL_DEFINITION _decode_ImplementedCryptoAlgorithms */
/**
 * @summary Decodes an ASN.1 element into a(n) ImplementedCryptoAlgorithms
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ImplementedCryptoAlgorithms} The decoded data structure.
 */
export function _decode_ImplementedCryptoAlgorithms(el: _Element) {
    if (!_cached_decoder_for_ImplementedCryptoAlgorithms) {
        _cached_decoder_for_ImplementedCryptoAlgorithms =
            $._decodeSequenceOf<OBJECT_IDENTIFIER>(
                () => $._decodeObjectIdentifier
            );
    }
    return _cached_decoder_for_ImplementedCryptoAlgorithms(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ImplementedCryptoAlgorithms */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ImplementedCryptoAlgorithms */
let _cached_encoder_for_ImplementedCryptoAlgorithms: $.ASN1Encoder<ImplementedCryptoAlgorithms> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ImplementedCryptoAlgorithms */

/* START_OF_SYMBOL_DEFINITION _encode_ImplementedCryptoAlgorithms */
/**
 * @summary Encodes a(n) ImplementedCryptoAlgorithms into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ImplementedCryptoAlgorithms, encoded as an ASN.1 Element.
 */
export function _encode_ImplementedCryptoAlgorithms(
    value: ImplementedCryptoAlgorithms,
    elGetter: $.ASN1Encoder<ImplementedCryptoAlgorithms>
) {
    if (!_cached_encoder_for_ImplementedCryptoAlgorithms) {
        _cached_encoder_for_ImplementedCryptoAlgorithms =
            $._encodeSequenceOf<OBJECT_IDENTIFIER>(
                () => $._encodeObjectIdentifier,
                $.BER
            );
    }
    return _cached_encoder_for_ImplementedCryptoAlgorithms(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ImplementedCryptoAlgorithms */

/* eslint-enable */
