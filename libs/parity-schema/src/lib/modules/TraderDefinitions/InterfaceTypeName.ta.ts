/* eslint-disable */
import { ASN1Element as _Element, OBJECT_IDENTIFIER } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION InterfaceTypeName */
/**
 * @summary InterfaceTypeName
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * InterfaceTypeName  ::=  OBJECT IDENTIFIER
 * ```
 */
export type InterfaceTypeName = OBJECT_IDENTIFIER; // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION InterfaceTypeName */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_InterfaceTypeName */
let _cached_decoder_for_InterfaceTypeName: $.ASN1Decoder<InterfaceTypeName> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_InterfaceTypeName */

/* START_OF_SYMBOL_DEFINITION _decode_InterfaceTypeName */
/**
 * @summary Decodes an ASN.1 element into a(n) InterfaceTypeName
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {InterfaceTypeName} The decoded data structure.
 */
export function _decode_InterfaceTypeName(el: _Element) {
    if (!_cached_decoder_for_InterfaceTypeName) {
        _cached_decoder_for_InterfaceTypeName = $._decodeObjectIdentifier;
    }
    return _cached_decoder_for_InterfaceTypeName(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_InterfaceTypeName */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_InterfaceTypeName */
let _cached_encoder_for_InterfaceTypeName: $.ASN1Encoder<InterfaceTypeName> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_InterfaceTypeName */

/* START_OF_SYMBOL_DEFINITION _encode_InterfaceTypeName */
/**
 * @summary Encodes a(n) InterfaceTypeName into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The InterfaceTypeName, encoded as an ASN.1 Element.
 */
export function _encode_InterfaceTypeName(
    value: InterfaceTypeName,
    elGetter: $.ASN1Encoder<InterfaceTypeName>
) {
    if (!_cached_encoder_for_InterfaceTypeName) {
        _cached_encoder_for_InterfaceTypeName = $._encodeObjectIdentifier;
    }
    return _cached_encoder_for_InterfaceTypeName(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_InterfaceTypeName */

/* eslint-enable */
