/* eslint-disable */
import { ASN1Element as _Element, BIT_STRING } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION NPartsMessage */
/**
 * @summary NPartsMessage
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * NPartsMessage  ::=  SEQUENCE SIZE (2..MAX) OF BIT STRING
 * ```
 */
export type NPartsMessage = BIT_STRING[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION NPartsMessage */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_NPartsMessage */
let _cached_decoder_for_NPartsMessage: $.ASN1Decoder<NPartsMessage> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_NPartsMessage */

/* START_OF_SYMBOL_DEFINITION _decode_NPartsMessage */
/**
 * @summary Decodes an ASN.1 element into a(n) NPartsMessage
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {NPartsMessage} The decoded data structure.
 */
export function _decode_NPartsMessage(el: _Element) {
    if (!_cached_decoder_for_NPartsMessage) {
        _cached_decoder_for_NPartsMessage = $._decodeSequenceOf<BIT_STRING>(
            () => $._decodeBitString
        );
    }
    return _cached_decoder_for_NPartsMessage(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_NPartsMessage */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_NPartsMessage */
let _cached_encoder_for_NPartsMessage: $.ASN1Encoder<NPartsMessage> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_NPartsMessage */

/* START_OF_SYMBOL_DEFINITION _encode_NPartsMessage */
/**
 * @summary Encodes a(n) NPartsMessage into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The NPartsMessage, encoded as an ASN.1 Element.
 */
export function _encode_NPartsMessage(
    value: NPartsMessage,
    elGetter: $.ASN1Encoder<NPartsMessage>
) {
    if (!_cached_encoder_for_NPartsMessage) {
        _cached_encoder_for_NPartsMessage = $._encodeSequenceOf<BIT_STRING>(
            () => $._encodeBitString,
            $.BER
        );
    }
    return _cached_encoder_for_NPartsMessage(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_NPartsMessage */

/* eslint-enable */
