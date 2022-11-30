/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION FormatType */
/**
 * @summary FormatType
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * FormatType  ::=  OCTET STRING(SIZE (2))
 * ```
 */
export type FormatType = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION FormatType */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_FormatType */
let _cached_decoder_for_FormatType: $.ASN1Decoder<FormatType> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_FormatType */

/* START_OF_SYMBOL_DEFINITION _decode_FormatType */
/**
 * @summary Decodes an ASN.1 element into a(n) FormatType
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {FormatType} The decoded data structure.
 */
export function _decode_FormatType(el: _Element) {
    if (!_cached_decoder_for_FormatType) {
        _cached_decoder_for_FormatType = $._decodeOctetString;
    }
    return _cached_decoder_for_FormatType(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_FormatType */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_FormatType */
let _cached_encoder_for_FormatType: $.ASN1Encoder<FormatType> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_FormatType */

/* START_OF_SYMBOL_DEFINITION _encode_FormatType */
/**
 * @summary Encodes a(n) FormatType into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The FormatType, encoded as an ASN.1 Element.
 */
export function _encode_FormatType(
    value: FormatType,
    elGetter: $.ASN1Encoder<FormatType>
) {
    if (!_cached_encoder_for_FormatType) {
        _cached_encoder_for_FormatType = $._encodeOctetString;
    }
    return _cached_encoder_for_FormatType(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_FormatType */

/* eslint-enable */
