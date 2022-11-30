/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION BCDDate */
/**
 * @summary BCDDate
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BCDDate  ::=  OCTET STRING(SIZE (4))
 * ```
 */
export type BCDDate = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION BCDDate */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BCDDate */
let _cached_decoder_for_BCDDate: $.ASN1Decoder<BCDDate> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BCDDate */

/* START_OF_SYMBOL_DEFINITION _decode_BCDDate */
/**
 * @summary Decodes an ASN.1 element into a(n) BCDDate
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BCDDate} The decoded data structure.
 */
export function _decode_BCDDate(el: _Element) {
    if (!_cached_decoder_for_BCDDate) {
        _cached_decoder_for_BCDDate = $._decodeOctetString;
    }
    return _cached_decoder_for_BCDDate(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BCDDate */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BCDDate */
let _cached_encoder_for_BCDDate: $.ASN1Encoder<BCDDate> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BCDDate */

/* START_OF_SYMBOL_DEFINITION _encode_BCDDate */
/**
 * @summary Encodes a(n) BCDDate into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BCDDate, encoded as an ASN.1 Element.
 */
export function _encode_BCDDate(
    value: BCDDate,
    elGetter: $.ASN1Encoder<BCDDate>
) {
    if (!_cached_encoder_for_BCDDate) {
        _cached_encoder_for_BCDDate = $._encodeOctetString;
    }
    return _cached_encoder_for_BCDDate(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BCDDate */

/* eslint-enable */
