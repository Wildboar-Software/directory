/* eslint-disable */
import {
    ASN1Element as _Element,
    OCTET_STRING
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";


/* START_OF_SYMBOL_DEFINITION SSID */
/**
 * @summary SSID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * SSID  ::=  OCTET STRING (SIZE (1..32))
 * ```
 */
export
type SSID = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION SSID */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SSID */
let _cached_decoder_for_SSID: $.ASN1Decoder<SSID> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SSID */

/* START_OF_SYMBOL_DEFINITION _decode_SSID */
/**
 * @summary Decodes an ASN.1 element into a(n) SSID
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SSID} The decoded data structure.
 */
export
function _decode_SSID (el: _Element) {
    if (!_cached_decoder_for_SSID) { _cached_decoder_for_SSID = $._decodeOctetString; }
    return _cached_decoder_for_SSID(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SSID */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SSID */
let _cached_encoder_for_SSID: $.ASN1Encoder<SSID> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SSID */

/* START_OF_SYMBOL_DEFINITION _encode_SSID */
/**
 * @summary Encodes a(n) SSID into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SSID, encoded as an ASN.1 Element.
 */
export
function _encode_SSID (value: SSID, elGetter: $.ASN1Encoder<SSID>) {
    if (!_cached_encoder_for_SSID) { _cached_encoder_for_SSID = $._encodeOctetString; }
    return _cached_encoder_for_SSID(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SSID */

/* eslint-enable */
