/* eslint-disable */
import {
    ContentInfo,
    _decode_ContentInfo,
    _encode_ContentInfo,
} from '@wildboar/cms';
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
export {
    ContentInfo,
    _decode_ContentInfo,
    _encode_ContentInfo,
} from '@wildboar/cms';

/* START_OF_SYMBOL_DEFINITION TimeStampToken */
/**
 * @summary TimeStampToken
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * TimeStampToken  ::=  ContentInfo
 * ```
 */
export type TimeStampToken = ContentInfo; // DefinedType
/* END_OF_SYMBOL_DEFINITION TimeStampToken */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_TimeStampToken */
let _cached_decoder_for_TimeStampToken: $.ASN1Decoder<TimeStampToken> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_TimeStampToken */

/* START_OF_SYMBOL_DEFINITION _decode_TimeStampToken */
/**
 * @summary Decodes an ASN.1 element into a(n) TimeStampToken
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {TimeStampToken} The decoded data structure.
 */
export function _decode_TimeStampToken(el: _Element) {
    if (!_cached_decoder_for_TimeStampToken) {
        _cached_decoder_for_TimeStampToken = _decode_ContentInfo;
    }
    return _cached_decoder_for_TimeStampToken(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_TimeStampToken */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_TimeStampToken */
let _cached_encoder_for_TimeStampToken: $.ASN1Encoder<TimeStampToken> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_TimeStampToken */

/* START_OF_SYMBOL_DEFINITION _encode_TimeStampToken */
/**
 * @summary Encodes a(n) TimeStampToken into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The TimeStampToken, encoded as an ASN.1 Element.
 */
export function _encode_TimeStampToken(
    value: TimeStampToken,
    elGetter: $.ASN1Encoder<TimeStampToken>
) {
    if (!_cached_encoder_for_TimeStampToken) {
        _cached_encoder_for_TimeStampToken = _encode_ContentInfo;
    }
    return _cached_encoder_for_TimeStampToken(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_TimeStampToken */

/* eslint-enable */
