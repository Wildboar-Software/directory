/* eslint-disable */
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    type Pointer,
    _decode_Pointer,
    _encode_Pointer,
} from '../OtherAutomaticallyTaggedTypes/Pointer.ta';

/* START_OF_SYMBOL_DEFINITION Pointers */
/**
 * @summary Pointers
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * Pointers  ::=  SEQUENCE SIZE(1..MAX) OF pointer Pointer
 * ```
 */
export type Pointers = Pointer[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION Pointers */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Pointers */
let _cached_decoder_for_Pointers: $.ASN1Decoder<Pointers> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Pointers */

/* START_OF_SYMBOL_DEFINITION _decode_Pointers */
/**
 * @summary Decodes an ASN.1 element into a(n) Pointers
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Pointers} The decoded data structure.
 */
export function _decode_Pointers(el: _Element) {
    if (!_cached_decoder_for_Pointers) {
        _cached_decoder_for_Pointers = $._decodeSequenceOf<Pointer>(
            () => _decode_Pointer
        );
    }
    return _cached_decoder_for_Pointers(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Pointers */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Pointers */
let _cached_encoder_for_Pointers: $.ASN1Encoder<Pointers> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Pointers */

/* START_OF_SYMBOL_DEFINITION _encode_Pointers */
/**
 * @summary Encodes a(n) Pointers into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Pointers, encoded as an ASN.1 Element.
 */
export function _encode_Pointers(
    value: Pointers,
    elGetter: $.ASN1Encoder<Pointers>
) {
    if (!_cached_encoder_for_Pointers) {
        _cached_encoder_for_Pointers = $._encodeSequenceOf<Pointer>(
            () => _encode_Pointer,
            $.BER
        );
    }
    return _cached_encoder_for_Pointers(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Pointers */

/* eslint-enable */
