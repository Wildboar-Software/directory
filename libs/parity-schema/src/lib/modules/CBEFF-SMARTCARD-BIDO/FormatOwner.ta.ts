/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION FormatOwner */
/**
 * @summary FormatOwner
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * FormatOwner  ::=  OCTET STRING(SIZE (2))
 * ```
 */
export type FormatOwner = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION FormatOwner */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_FormatOwner */
let _cached_decoder_for_FormatOwner: $.ASN1Decoder<FormatOwner> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_FormatOwner */

/* START_OF_SYMBOL_DEFINITION _decode_FormatOwner */
/**
 * @summary Decodes an ASN.1 element into a(n) FormatOwner
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {FormatOwner} The decoded data structure.
 */
export function _decode_FormatOwner(el: _Element) {
    if (!_cached_decoder_for_FormatOwner) {
        _cached_decoder_for_FormatOwner = $._decodeOctetString;
    }
    return _cached_decoder_for_FormatOwner(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_FormatOwner */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_FormatOwner */
let _cached_encoder_for_FormatOwner: $.ASN1Encoder<FormatOwner> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_FormatOwner */

/* START_OF_SYMBOL_DEFINITION _encode_FormatOwner */
/**
 * @summary Encodes a(n) FormatOwner into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The FormatOwner, encoded as an ASN.1 Element.
 */
export function _encode_FormatOwner(
    value: FormatOwner,
    elGetter: $.ASN1Encoder<FormatOwner>
) {
    if (!_cached_encoder_for_FormatOwner) {
        _cached_encoder_for_FormatOwner = $._encodeOctetString;
    }
    return _cached_encoder_for_FormatOwner(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_FormatOwner */

/* eslint-enable */
