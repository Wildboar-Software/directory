/* eslint-disable */
import { ASN1Element as _Element, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION MethodIDs */
/**
 * @summary MethodIDs
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * MethodIDs  ::=  OBJECT IDENTIFIER
 * ```
 */
export type MethodIDs = OBJECT_IDENTIFIER; // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION MethodIDs */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_MethodIDs */
let _cached_decoder_for_MethodIDs: $.ASN1Decoder<MethodIDs> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_MethodIDs */

/* START_OF_SYMBOL_DEFINITION _decode_MethodIDs */
/**
 * @summary Decodes an ASN.1 element into a(n) MethodIDs
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {MethodIDs} The decoded data structure.
 */
export function _decode_MethodIDs(el: _Element) {
    if (!_cached_decoder_for_MethodIDs) {
        _cached_decoder_for_MethodIDs = $._decodeObjectIdentifier;
    }
    return _cached_decoder_for_MethodIDs(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_MethodIDs */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_MethodIDs */
let _cached_encoder_for_MethodIDs: $.ASN1Encoder<MethodIDs> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_MethodIDs */

/* START_OF_SYMBOL_DEFINITION _encode_MethodIDs */
/**
 * @summary Encodes a(n) MethodIDs into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The MethodIDs, encoded as an ASN.1 Element.
 */
export function _encode_MethodIDs(
    value: MethodIDs,
    elGetter: $.ASN1Encoder<MethodIDs>
) {
    if (!_cached_encoder_for_MethodIDs) {
        _cached_encoder_for_MethodIDs = $._encodeObjectIdentifier;
    }
    return _cached_encoder_for_MethodIDs(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_MethodIDs */

/* eslint-enable */
