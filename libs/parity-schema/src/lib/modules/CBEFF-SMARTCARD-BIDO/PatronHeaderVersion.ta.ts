/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION PatronHeaderVersion */
/**
 * @summary PatronHeaderVersion
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * PatronHeaderVersion  ::=  OCTET STRING(SIZE (2))
 * ```
 */
export type PatronHeaderVersion = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION PatronHeaderVersion */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PatronHeaderVersion */
let _cached_decoder_for_PatronHeaderVersion: $.ASN1Decoder<PatronHeaderVersion> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PatronHeaderVersion */

/* START_OF_SYMBOL_DEFINITION _decode_PatronHeaderVersion */
/**
 * @summary Decodes an ASN.1 element into a(n) PatronHeaderVersion
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PatronHeaderVersion} The decoded data structure.
 */
export function _decode_PatronHeaderVersion(el: _Element) {
    if (!_cached_decoder_for_PatronHeaderVersion) {
        _cached_decoder_for_PatronHeaderVersion = $._decodeOctetString;
    }
    return _cached_decoder_for_PatronHeaderVersion(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PatronHeaderVersion */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PatronHeaderVersion */
let _cached_encoder_for_PatronHeaderVersion: $.ASN1Encoder<PatronHeaderVersion> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PatronHeaderVersion */

/* START_OF_SYMBOL_DEFINITION _encode_PatronHeaderVersion */
/**
 * @summary Encodes a(n) PatronHeaderVersion into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PatronHeaderVersion, encoded as an ASN.1 Element.
 */
export function _encode_PatronHeaderVersion(
    value: PatronHeaderVersion,
    elGetter: $.ASN1Encoder<PatronHeaderVersion>
) {
    if (!_cached_encoder_for_PatronHeaderVersion) {
        _cached_encoder_for_PatronHeaderVersion = $._encodeOctetString;
    }
    return _cached_encoder_for_PatronHeaderVersion(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_PatronHeaderVersion */

/* eslint-enable */
