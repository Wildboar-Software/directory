/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION Hash */
/**
 * @summary Hash
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * Hash  ::=  OCTET STRING
 * ```
 */
export type Hash = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION Hash */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Hash */
let _cached_decoder_for_Hash: $.ASN1Decoder<Hash> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Hash */

/* START_OF_SYMBOL_DEFINITION _decode_Hash */
/**
 * @summary Decodes an ASN.1 element into a(n) Hash
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Hash} The decoded data structure.
 */
export function _decode_Hash(el: _Element) {
    if (!_cached_decoder_for_Hash) {
        _cached_decoder_for_Hash = $._decodeOctetString;
    }
    return _cached_decoder_for_Hash(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Hash */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Hash */
let _cached_encoder_for_Hash: $.ASN1Encoder<Hash> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Hash */

/* START_OF_SYMBOL_DEFINITION _encode_Hash */
/**
 * @summary Encodes a(n) Hash into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Hash, encoded as an ASN.1 Element.
 */
export function _encode_Hash(value: Hash, elGetter: $.ASN1Encoder<Hash>) {
    if (!_cached_encoder_for_Hash) {
        _cached_encoder_for_Hash = $._encodeOctetString;
    }
    return _cached_encoder_for_Hash(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Hash */

/* eslint-enable */
