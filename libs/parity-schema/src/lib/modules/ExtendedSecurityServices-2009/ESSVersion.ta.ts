/* eslint-disable */
import { ASN1Element as _Element, INTEGER } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION ESSVersion */
/**
 * @summary ESSVersion
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ESSVersion  ::=  INTEGER  { v1(1) }
 * ```
 */
export type ESSVersion = INTEGER;
/* END_OF_SYMBOL_DEFINITION ESSVersion */

/* START_OF_SYMBOL_DEFINITION ESSVersion_v1 */
/**
 * @summary ESSVersion_v1
 * @constant
 * @type {number}
 */
export const ESSVersion_v1: ESSVersion = 1; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION ESSVersion_v1 */

/* START_OF_SYMBOL_DEFINITION v1 */
/**
 * @summary ESSVersion_v1
 * @constant
 * @type {number}
 */
export const v1: ESSVersion = ESSVersion_v1; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION v1 */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ESSVersion */
let _cached_decoder_for_ESSVersion: $.ASN1Decoder<ESSVersion> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ESSVersion */

/* START_OF_SYMBOL_DEFINITION _decode_ESSVersion */
/**
 * @summary Decodes an ASN.1 element into a(n) ESSVersion
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ESSVersion} The decoded data structure.
 */
export function _decode_ESSVersion(el: _Element) {
    if (!_cached_decoder_for_ESSVersion) {
        _cached_decoder_for_ESSVersion = $._decodeInteger;
    }
    return _cached_decoder_for_ESSVersion(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ESSVersion */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ESSVersion */
let _cached_encoder_for_ESSVersion: $.ASN1Encoder<ESSVersion> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ESSVersion */

/* START_OF_SYMBOL_DEFINITION _encode_ESSVersion */
/**
 * @summary Encodes a(n) ESSVersion into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ESSVersion, encoded as an ASN.1 Element.
 */
export function _encode_ESSVersion(
    value: ESSVersion,
    elGetter: $.ASN1Encoder<ESSVersion>
) {
    if (!_cached_encoder_for_ESSVersion) {
        _cached_encoder_for_ESSVersion = $._encodeInteger;
    }
    return _cached_encoder_for_ESSVersion(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ESSVersion */

/* eslint-enable */
