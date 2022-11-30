/* eslint-disable */
import { ASN1Element as _Element } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import {
    NPartsMessage,
    _decode_NPartsMessage,
    _encode_NPartsMessage,
} from '../IN-CS3-SCF-SDF-datatypes/NPartsMessage.ta';
export {
    NPartsMessage,
    _decode_NPartsMessage,
    _encode_NPartsMessage,
} from '../IN-CS3-SCF-SDF-datatypes/NPartsMessage.ta';

/* START_OF_SYMBOL_DEFINITION TwoPartMessage */
/**
 * @summary TwoPartMessage
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * TwoPartMessage  ::=  NPartsMessage
 * ```
 */
export type TwoPartMessage = NPartsMessage; // DefinedType
/* END_OF_SYMBOL_DEFINITION TwoPartMessage */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_TwoPartMessage */
let _cached_decoder_for_TwoPartMessage: $.ASN1Decoder<TwoPartMessage> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_TwoPartMessage */

/* START_OF_SYMBOL_DEFINITION _decode_TwoPartMessage */
/**
 * @summary Decodes an ASN.1 element into a(n) TwoPartMessage
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {TwoPartMessage} The decoded data structure.
 */
export function _decode_TwoPartMessage(el: _Element) {
    if (!_cached_decoder_for_TwoPartMessage) {
        _cached_decoder_for_TwoPartMessage = _decode_NPartsMessage;
    }
    return _cached_decoder_for_TwoPartMessage(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_TwoPartMessage */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_TwoPartMessage */
let _cached_encoder_for_TwoPartMessage: $.ASN1Encoder<TwoPartMessage> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_TwoPartMessage */

/* START_OF_SYMBOL_DEFINITION _encode_TwoPartMessage */
/**
 * @summary Encodes a(n) TwoPartMessage into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The TwoPartMessage, encoded as an ASN.1 Element.
 */
export function _encode_TwoPartMessage(
    value: TwoPartMessage,
    elGetter: $.ASN1Encoder<TwoPartMessage>
) {
    if (!_cached_encoder_for_TwoPartMessage) {
        _cached_encoder_for_TwoPartMessage = _encode_NPartsMessage;
    }
    return _cached_encoder_for_TwoPartMessage(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_TwoPartMessage */

/* eslint-enable */
