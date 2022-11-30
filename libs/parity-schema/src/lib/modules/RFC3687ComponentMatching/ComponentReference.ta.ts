/* eslint-disable */
import { ASN1Element as _Element, UTF8String } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION ComponentReference */
/**
 * @summary ComponentReference
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ComponentReference  ::=  UTF8String
 * ```
 */
export type ComponentReference = UTF8String; // UTF8String
/* END_OF_SYMBOL_DEFINITION ComponentReference */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ComponentReference */
let _cached_decoder_for_ComponentReference: $.ASN1Decoder<ComponentReference> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ComponentReference */

/* START_OF_SYMBOL_DEFINITION _decode_ComponentReference */
/**
 * @summary Decodes an ASN.1 element into a(n) ComponentReference
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ComponentReference} The decoded data structure.
 */
export function _decode_ComponentReference(el: _Element) {
    if (!_cached_decoder_for_ComponentReference) {
        _cached_decoder_for_ComponentReference = $._decodeUTF8String;
    }
    return _cached_decoder_for_ComponentReference(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ComponentReference */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ComponentReference */
let _cached_encoder_for_ComponentReference: $.ASN1Encoder<ComponentReference> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ComponentReference */

/* START_OF_SYMBOL_DEFINITION _encode_ComponentReference */
/**
 * @summary Encodes a(n) ComponentReference into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ComponentReference, encoded as an ASN.1 Element.
 */
export function _encode_ComponentReference(
    value: ComponentReference,
    elGetter: $.ASN1Encoder<ComponentReference>
) {
    if (!_cached_encoder_for_ComponentReference) {
        _cached_encoder_for_ComponentReference = $._encodeUTF8String;
    }
    return _cached_encoder_for_ComponentReference(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ComponentReference */

/* eslint-enable */
