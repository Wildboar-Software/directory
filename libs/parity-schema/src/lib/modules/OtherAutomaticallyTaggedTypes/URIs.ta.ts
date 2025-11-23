/* eslint-disable */
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    URI,
    _decode_URI,
    _encode_URI,
} from '../OtherAutomaticallyTaggedTypes/URI.ta';
export {
    URI,
    _decode_URI,
    _encode_URI,
} from '../OtherAutomaticallyTaggedTypes/URI.ta';

/* START_OF_SYMBOL_DEFINITION URIs */
/**
 * @summary URIs
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * URIs  ::=  SEQUENCE SIZE(1..MAX) OF uri URI
 * ```
 */
export type URIs = URI[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION URIs */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_URIs */
let _cached_decoder_for_URIs: $.ASN1Decoder<URIs> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_URIs */

/* START_OF_SYMBOL_DEFINITION _decode_URIs */
/**
 * @summary Decodes an ASN.1 element into a(n) URIs
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {URIs} The decoded data structure.
 */
export function _decode_URIs(el: _Element) {
    if (!_cached_decoder_for_URIs) {
        _cached_decoder_for_URIs = $._decodeSequenceOf<URI>(() => _decode_URI);
    }
    return _cached_decoder_for_URIs(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_URIs */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_URIs */
let _cached_encoder_for_URIs: $.ASN1Encoder<URIs> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_URIs */

/* START_OF_SYMBOL_DEFINITION _encode_URIs */
/**
 * @summary Encodes a(n) URIs into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The URIs, encoded as an ASN.1 Element.
 */
export function _encode_URIs(value: URIs, elGetter: $.ASN1Encoder<URIs>) {
    if (!_cached_encoder_for_URIs) {
        _cached_encoder_for_URIs = $._encodeSequenceOf<URI>(
            () => _encode_URI,
            $.BER
        );
    }
    return _cached_encoder_for_URIs(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_URIs */

/* eslint-enable */
