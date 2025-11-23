/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION GPS */
/**
 * @summary GPS
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * GPS  ::=  OCTET STRING
 * ```
 */
export type GPS = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION GPS */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_GPS */
let _cached_decoder_for_GPS: $.ASN1Decoder<GPS> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_GPS */

/* START_OF_SYMBOL_DEFINITION _decode_GPS */
/**
 * @summary Decodes an ASN.1 element into a(n) GPS
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {GPS} The decoded data structure.
 */
export function _decode_GPS(el: _Element) {
    if (!_cached_decoder_for_GPS) {
        _cached_decoder_for_GPS = $._decodeOctetString;
    }
    return _cached_decoder_for_GPS(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_GPS */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_GPS */
let _cached_encoder_for_GPS: $.ASN1Encoder<GPS> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_GPS */

/* START_OF_SYMBOL_DEFINITION _encode_GPS */
/**
 * @summary Encodes a(n) GPS into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The GPS, encoded as an ASN.1 Element.
 */
export function _encode_GPS(value: GPS, elGetter: $.ASN1Encoder<GPS>) {
    if (!_cached_encoder_for_GPS) {
        _cached_encoder_for_GPS = $._encodeOctetString;
    }
    return _cached_encoder_for_GPS(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_GPS */

/* eslint-enable */
