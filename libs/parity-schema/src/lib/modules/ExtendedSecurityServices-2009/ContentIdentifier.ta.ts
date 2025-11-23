/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION ContentIdentifier */
/**
 * @summary ContentIdentifier
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ContentIdentifier  ::=  OCTET STRING
 * ```
 */
export type ContentIdentifier = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION ContentIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ContentIdentifier */
let _cached_decoder_for_ContentIdentifier: $.ASN1Decoder<ContentIdentifier> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ContentIdentifier */

/* START_OF_SYMBOL_DEFINITION _decode_ContentIdentifier */
/**
 * @summary Decodes an ASN.1 element into a(n) ContentIdentifier
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ContentIdentifier} The decoded data structure.
 */
export function _decode_ContentIdentifier(el: _Element) {
    if (!_cached_decoder_for_ContentIdentifier) {
        _cached_decoder_for_ContentIdentifier = $._decodeOctetString;
    }
    return _cached_decoder_for_ContentIdentifier(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ContentIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ContentIdentifier */
let _cached_encoder_for_ContentIdentifier: $.ASN1Encoder<ContentIdentifier> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ContentIdentifier */

/* START_OF_SYMBOL_DEFINITION _encode_ContentIdentifier */
/**
 * @summary Encodes a(n) ContentIdentifier into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ContentIdentifier, encoded as an ASN.1 Element.
 */
export function _encode_ContentIdentifier(
    value: ContentIdentifier,
    elGetter: $.ASN1Encoder<ContentIdentifier>
) {
    if (!_cached_encoder_for_ContentIdentifier) {
        _cached_encoder_for_ContentIdentifier = $._encodeOctetString;
    }
    return _cached_encoder_for_ContentIdentifier(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ContentIdentifier */

/* eslint-enable */
