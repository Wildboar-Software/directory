/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION BCDDatePeriod */
/**
 * @summary BCDDatePeriod
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BCDDatePeriod  ::=  OCTET STRING(SIZE (8))
 * ```
 */
export type BCDDatePeriod = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION BCDDatePeriod */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BCDDatePeriod */
let _cached_decoder_for_BCDDatePeriod: $.ASN1Decoder<BCDDatePeriod> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BCDDatePeriod */

/* START_OF_SYMBOL_DEFINITION _decode_BCDDatePeriod */
/**
 * @summary Decodes an ASN.1 element into a(n) BCDDatePeriod
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BCDDatePeriod} The decoded data structure.
 */
export function _decode_BCDDatePeriod(el: _Element) {
    if (!_cached_decoder_for_BCDDatePeriod) {
        _cached_decoder_for_BCDDatePeriod = $._decodeOctetString;
    }
    return _cached_decoder_for_BCDDatePeriod(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BCDDatePeriod */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BCDDatePeriod */
let _cached_encoder_for_BCDDatePeriod: $.ASN1Encoder<BCDDatePeriod> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BCDDatePeriod */

/* START_OF_SYMBOL_DEFINITION _encode_BCDDatePeriod */
/**
 * @summary Encodes a(n) BCDDatePeriod into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BCDDatePeriod, encoded as an ASN.1 Element.
 */
export function _encode_BCDDatePeriod(
    value: BCDDatePeriod,
    elGetter: $.ASN1Encoder<BCDDatePeriod>
) {
    if (!_cached_encoder_for_BCDDatePeriod) {
        _cached_encoder_for_BCDDatePeriod = $._encodeOctetString;
    }
    return _cached_encoder_for_BCDDatePeriod(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BCDDatePeriod */

/* eslint-enable */
