/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION ProductID */
/**
 * @summary ProductID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ProductID  ::=  OCTET STRING(SIZE (4))
 * ```
 */
export type ProductID = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION ProductID */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ProductID */
let _cached_decoder_for_ProductID: $.ASN1Decoder<ProductID> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ProductID */

/* START_OF_SYMBOL_DEFINITION _decode_ProductID */
/**
 * @summary Decodes an ASN.1 element into a(n) ProductID
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ProductID} The decoded data structure.
 */
export function _decode_ProductID(el: _Element) {
    if (!_cached_decoder_for_ProductID) {
        _cached_decoder_for_ProductID = $._decodeOctetString;
    }
    return _cached_decoder_for_ProductID(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ProductID */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ProductID */
let _cached_encoder_for_ProductID: $.ASN1Encoder<ProductID> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ProductID */

/* START_OF_SYMBOL_DEFINITION _encode_ProductID */
/**
 * @summary Encodes a(n) ProductID into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ProductID, encoded as an ASN.1 Element.
 */
export function _encode_ProductID(
    value: ProductID,
    elGetter: $.ASN1Encoder<ProductID>
) {
    if (!_cached_encoder_for_ProductID) {
        _cached_encoder_for_ProductID = $._encodeOctetString;
    }
    return _cached_encoder_for_ProductID(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ProductID */

/* eslint-enable */
