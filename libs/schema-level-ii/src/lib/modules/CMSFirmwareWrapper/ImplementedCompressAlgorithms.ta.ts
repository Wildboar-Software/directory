/* eslint-disable */
import {
    ASN1Element as _Element,
    OBJECT_IDENTIFIER
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";



/* START_OF_SYMBOL_DEFINITION ImplementedCompressAlgorithms */
/**
 * @summary ImplementedCompressAlgorithms
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ImplementedCompressAlgorithms  ::=  SEQUENCE OF OBJECT IDENTIFIER
 * ```
 */
export
type ImplementedCompressAlgorithms = OBJECT_IDENTIFIER[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION ImplementedCompressAlgorithms */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ImplementedCompressAlgorithms */
let _cached_decoder_for_ImplementedCompressAlgorithms: $.ASN1Decoder<ImplementedCompressAlgorithms> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ImplementedCompressAlgorithms */

/* START_OF_SYMBOL_DEFINITION _decode_ImplementedCompressAlgorithms */
/**
 * @summary Decodes an ASN.1 element into a(n) ImplementedCompressAlgorithms
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ImplementedCompressAlgorithms} The decoded data structure.
 */
export
function _decode_ImplementedCompressAlgorithms (el: _Element) {
    if (!_cached_decoder_for_ImplementedCompressAlgorithms) { _cached_decoder_for_ImplementedCompressAlgorithms = $._decodeSequenceOf<OBJECT_IDENTIFIER>(() => $._decodeObjectIdentifier); }
    return _cached_decoder_for_ImplementedCompressAlgorithms(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ImplementedCompressAlgorithms */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ImplementedCompressAlgorithms */
let _cached_encoder_for_ImplementedCompressAlgorithms: $.ASN1Encoder<ImplementedCompressAlgorithms> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ImplementedCompressAlgorithms */

/* START_OF_SYMBOL_DEFINITION _encode_ImplementedCompressAlgorithms */
/**
 * @summary Encodes a(n) ImplementedCompressAlgorithms into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ImplementedCompressAlgorithms, encoded as an ASN.1 Element.
 */
export
function _encode_ImplementedCompressAlgorithms (value: ImplementedCompressAlgorithms, elGetter: $.ASN1Encoder<ImplementedCompressAlgorithms>) {
    if (!_cached_encoder_for_ImplementedCompressAlgorithms) { _cached_encoder_for_ImplementedCompressAlgorithms = $._encodeSequenceOf<OBJECT_IDENTIFIER>(() => $._encodeObjectIdentifier, $.BER); }
    return _cached_encoder_for_ImplementedCompressAlgorithms(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ImplementedCompressAlgorithms */

/* eslint-enable */
