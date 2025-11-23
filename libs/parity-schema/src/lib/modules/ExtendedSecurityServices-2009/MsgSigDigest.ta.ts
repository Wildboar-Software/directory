/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION MsgSigDigest */
/**
 * @summary MsgSigDigest
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * MsgSigDigest  ::=  OCTET STRING
 * ```
 */
export type MsgSigDigest = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION MsgSigDigest */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_MsgSigDigest */
let _cached_decoder_for_MsgSigDigest: $.ASN1Decoder<MsgSigDigest> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_MsgSigDigest */

/* START_OF_SYMBOL_DEFINITION _decode_MsgSigDigest */
/**
 * @summary Decodes an ASN.1 element into a(n) MsgSigDigest
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {MsgSigDigest} The decoded data structure.
 */
export function _decode_MsgSigDigest(el: _Element) {
    if (!_cached_decoder_for_MsgSigDigest) {
        _cached_decoder_for_MsgSigDigest = $._decodeOctetString;
    }
    return _cached_decoder_for_MsgSigDigest(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_MsgSigDigest */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_MsgSigDigest */
let _cached_encoder_for_MsgSigDigest: $.ASN1Encoder<MsgSigDigest> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_MsgSigDigest */

/* START_OF_SYMBOL_DEFINITION _encode_MsgSigDigest */
/**
 * @summary Encodes a(n) MsgSigDigest into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The MsgSigDigest, encoded as an ASN.1 Element.
 */
export function _encode_MsgSigDigest(
    value: MsgSigDigest,
    elGetter: $.ASN1Encoder<MsgSigDigest>
) {
    if (!_cached_encoder_for_MsgSigDigest) {
        _cached_encoder_for_MsgSigDigest = $._encodeOctetString;
    }
    return _cached_encoder_for_MsgSigDigest(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_MsgSigDigest */

/* eslint-enable */
