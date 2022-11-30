/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION PartialHashtree */
/**
 * @summary PartialHashtree
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * PartialHashtree  ::=  SEQUENCE OF OCTET STRING
 * ```
 */
export type PartialHashtree = OCTET_STRING[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION PartialHashtree */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PartialHashtree */
let _cached_decoder_for_PartialHashtree: $.ASN1Decoder<PartialHashtree> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PartialHashtree */

/* START_OF_SYMBOL_DEFINITION _decode_PartialHashtree */
/**
 * @summary Decodes an ASN.1 element into a(n) PartialHashtree
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PartialHashtree} The decoded data structure.
 */
export function _decode_PartialHashtree(el: _Element) {
    if (!_cached_decoder_for_PartialHashtree) {
        _cached_decoder_for_PartialHashtree = $._decodeSequenceOf<OCTET_STRING>(
            () => $._decodeOctetString
        );
    }
    return _cached_decoder_for_PartialHashtree(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PartialHashtree */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PartialHashtree */
let _cached_encoder_for_PartialHashtree: $.ASN1Encoder<PartialHashtree> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PartialHashtree */

/* START_OF_SYMBOL_DEFINITION _encode_PartialHashtree */
/**
 * @summary Encodes a(n) PartialHashtree into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PartialHashtree, encoded as an ASN.1 Element.
 */
export function _encode_PartialHashtree(
    value: PartialHashtree,
    elGetter: $.ASN1Encoder<PartialHashtree>
) {
    if (!_cached_encoder_for_PartialHashtree) {
        _cached_encoder_for_PartialHashtree = $._encodeSequenceOf<OCTET_STRING>(
            () => $._encodeOctetString,
            $.BER
        );
    }
    return _cached_encoder_for_PartialHashtree(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_PartialHashtree */

/* eslint-enable */
