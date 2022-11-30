/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION BCDTime */
/**
 * @summary BCDTime
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BCDTime  ::=  OCTET STRING(SIZE (7))
 * ```
 */
export type BCDTime = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION BCDTime */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BCDTime */
let _cached_decoder_for_BCDTime: $.ASN1Decoder<BCDTime> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BCDTime */

/* START_OF_SYMBOL_DEFINITION _decode_BCDTime */
/**
 * @summary Decodes an ASN.1 element into a(n) BCDTime
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BCDTime} The decoded data structure.
 */
export function _decode_BCDTime(el: _Element) {
    if (!_cached_decoder_for_BCDTime) {
        _cached_decoder_for_BCDTime = $._decodeOctetString;
    }
    return _cached_decoder_for_BCDTime(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BCDTime */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BCDTime */
let _cached_encoder_for_BCDTime: $.ASN1Encoder<BCDTime> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BCDTime */

/* START_OF_SYMBOL_DEFINITION _encode_BCDTime */
/**
 * @summary Encodes a(n) BCDTime into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BCDTime, encoded as an ASN.1 Element.
 */
export function _encode_BCDTime(
    value: BCDTime,
    elGetter: $.ASN1Encoder<BCDTime>
) {
    if (!_cached_encoder_for_BCDTime) {
        _cached_encoder_for_BCDTime = $._encodeOctetString;
    }
    return _cached_encoder_for_BCDTime(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BCDTime */

/* eslint-enable */
