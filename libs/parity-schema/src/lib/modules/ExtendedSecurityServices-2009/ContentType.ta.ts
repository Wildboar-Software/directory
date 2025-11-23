/* eslint-disable */
import { ASN1Element as _Element, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION ContentType */
/**
 * @summary ContentType
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ContentType  ::=  OBJECT IDENTIFIER
 * ```
 */
export type ContentType = OBJECT_IDENTIFIER; // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION ContentType */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ContentType */
let _cached_decoder_for_ContentType: $.ASN1Decoder<ContentType> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ContentType */

/* START_OF_SYMBOL_DEFINITION _decode_ContentType */
/**
 * @summary Decodes an ASN.1 element into a(n) ContentType
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ContentType} The decoded data structure.
 */
export function _decode_ContentType(el: _Element) {
    if (!_cached_decoder_for_ContentType) {
        _cached_decoder_for_ContentType = $._decodeObjectIdentifier;
    }
    return _cached_decoder_for_ContentType(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ContentType */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ContentType */
let _cached_encoder_for_ContentType: $.ASN1Encoder<ContentType> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ContentType */

/* START_OF_SYMBOL_DEFINITION _encode_ContentType */
/**
 * @summary Encodes a(n) ContentType into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ContentType, encoded as an ASN.1 Element.
 */
export function _encode_ContentType(
    value: ContentType,
    elGetter: $.ASN1Encoder<ContentType>
) {
    if (!_cached_encoder_for_ContentType) {
        _cached_encoder_for_ContentType = $._encodeObjectIdentifier;
    }
    return _cached_encoder_for_ContentType(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ContentType */

/* eslint-enable */
