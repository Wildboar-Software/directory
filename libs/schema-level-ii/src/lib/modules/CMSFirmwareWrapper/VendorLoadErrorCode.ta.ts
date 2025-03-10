/* eslint-disable */
import {
    ASN1Element as _Element,
    INTEGER
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";



/* START_OF_SYMBOL_DEFINITION VendorLoadErrorCode */
/**
 * @summary VendorLoadErrorCode
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * VendorLoadErrorCode  ::=  INTEGER
 * ```
 */
export
type VendorLoadErrorCode = INTEGER;
/* END_OF_SYMBOL_DEFINITION VendorLoadErrorCode */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_VendorLoadErrorCode */
let _cached_decoder_for_VendorLoadErrorCode: $.ASN1Decoder<VendorLoadErrorCode> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_VendorLoadErrorCode */

/* START_OF_SYMBOL_DEFINITION _decode_VendorLoadErrorCode */
/**
 * @summary Decodes an ASN.1 element into a(n) VendorLoadErrorCode
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {VendorLoadErrorCode} The decoded data structure.
 */
export
function _decode_VendorLoadErrorCode (el: _Element) {
    if (!_cached_decoder_for_VendorLoadErrorCode) { _cached_decoder_for_VendorLoadErrorCode = $._decodeInteger; }
    return _cached_decoder_for_VendorLoadErrorCode(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_VendorLoadErrorCode */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_VendorLoadErrorCode */
let _cached_encoder_for_VendorLoadErrorCode: $.ASN1Encoder<VendorLoadErrorCode> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_VendorLoadErrorCode */

/* START_OF_SYMBOL_DEFINITION _encode_VendorLoadErrorCode */
/**
 * @summary Encodes a(n) VendorLoadErrorCode into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The VendorLoadErrorCode, encoded as an ASN.1 Element.
 */
export
function _encode_VendorLoadErrorCode (value: VendorLoadErrorCode, elGetter: $.ASN1Encoder<VendorLoadErrorCode>) {
    if (!_cached_encoder_for_VendorLoadErrorCode) { _cached_encoder_for_VendorLoadErrorCode = $._encodeInteger; }
    return _cached_encoder_for_VendorLoadErrorCode(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_VendorLoadErrorCode */

/* eslint-enable */
