/* eslint-disable */
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    type Sidechain,
    _decode_Sidechain,
    _encode_Sidechain,
} from '../OtherAutomaticallyTaggedTypes/Sidechain.ta';

/* START_OF_SYMBOL_DEFINITION Sidechains */
/**
 * @summary Sidechains
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * Sidechains     ::=  SEQUENCE (SIZE(0..MAX)) OF linked Sidechain
 * ```
 */
export type Sidechains = Sidechain[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION Sidechains */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Sidechains */
let _cached_decoder_for_Sidechains: $.ASN1Decoder<Sidechains> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Sidechains */

/* START_OF_SYMBOL_DEFINITION _decode_Sidechains */
/**
 * @summary Decodes an ASN.1 element into a(n) Sidechains
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Sidechains} The decoded data structure.
 */
export function _decode_Sidechains(el: _Element) {
    if (!_cached_decoder_for_Sidechains) {
        _cached_decoder_for_Sidechains = $._decodeSequenceOf<Sidechain>(
            () => _decode_Sidechain
        );
    }
    return _cached_decoder_for_Sidechains(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Sidechains */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Sidechains */
let _cached_encoder_for_Sidechains: $.ASN1Encoder<Sidechains> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Sidechains */

/* START_OF_SYMBOL_DEFINITION _encode_Sidechains */
/**
 * @summary Encodes a(n) Sidechains into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Sidechains, encoded as an ASN.1 Element.
 */
export function _encode_Sidechains(
    value: Sidechains,
    elGetter: $.ASN1Encoder<Sidechains>
) {
    if (!_cached_encoder_for_Sidechains) {
        _cached_encoder_for_Sidechains = $._encodeSequenceOf<Sidechain>(
            () => _encode_Sidechain,
            $.BER
        );
    }
    return _cached_encoder_for_Sidechains(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Sidechains */

/* eslint-enable */
