/* eslint-disable */
import { ASN1Element as _Element, IA5String } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION AbsoluteFilePath */
/**
 * @summary AbsoluteFilePath
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * AbsoluteFilePath  ::=  IA5String (SIZE (1..4096))
 * ```
 */
export type AbsoluteFilePath = IA5String; // IA5String
/* END_OF_SYMBOL_DEFINITION AbsoluteFilePath */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_AbsoluteFilePath */
let _cached_decoder_for_AbsoluteFilePath: $.ASN1Decoder<AbsoluteFilePath> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_AbsoluteFilePath */

/* START_OF_SYMBOL_DEFINITION _decode_AbsoluteFilePath */
/**
 * @summary Decodes an ASN.1 element into a(n) AbsoluteFilePath
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {AbsoluteFilePath} The decoded data structure.
 */
export function _decode_AbsoluteFilePath(el: _Element) {
    if (!_cached_decoder_for_AbsoluteFilePath) {
        _cached_decoder_for_AbsoluteFilePath = $._decodeIA5String;
    }
    return _cached_decoder_for_AbsoluteFilePath(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_AbsoluteFilePath */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_AbsoluteFilePath */
let _cached_encoder_for_AbsoluteFilePath: $.ASN1Encoder<AbsoluteFilePath> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_AbsoluteFilePath */

/* START_OF_SYMBOL_DEFINITION _encode_AbsoluteFilePath */
/**
 * @summary Encodes a(n) AbsoluteFilePath into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The AbsoluteFilePath, encoded as an ASN.1 Element.
 */
export function _encode_AbsoluteFilePath(
    value: AbsoluteFilePath,
    elGetter: $.ASN1Encoder<AbsoluteFilePath>
) {
    if (!_cached_encoder_for_AbsoluteFilePath) {
        _cached_encoder_for_AbsoluteFilePath = $._encodeIA5String;
    }
    return _cached_encoder_for_AbsoluteFilePath(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_AbsoluteFilePath */

/* eslint-enable */
