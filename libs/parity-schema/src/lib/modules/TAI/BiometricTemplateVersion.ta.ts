/* eslint-disable */
import { ASN1Element as _Element, INTEGER } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION BiometricTemplateVersion */
/**
 * @summary BiometricTemplateVersion
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BiometricTemplateVersion  ::=  INTEGER {v0(0)}(v0, ...)
 * ```
 */
export type BiometricTemplateVersion = INTEGER;
/* END_OF_SYMBOL_DEFINITION BiometricTemplateVersion */

/* START_OF_SYMBOL_DEFINITION BiometricTemplateVersion_v0 */
/**
 * @summary BiometricTemplateVersion_v0
 * @constant
 * @type {number}
 */
export const BiometricTemplateVersion_v0: BiometricTemplateVersion = 0; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION BiometricTemplateVersion_v0 */

/* START_OF_SYMBOL_DEFINITION v0 */
/**
 * @summary BiometricTemplateVersion_v0
 * @constant
 * @type {number}
 */
export const v0: BiometricTemplateVersion =
    BiometricTemplateVersion_v0; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION v0 */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricTemplateVersion */
let _cached_decoder_for_BiometricTemplateVersion: $.ASN1Decoder<BiometricTemplateVersion> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricTemplateVersion */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricTemplateVersion */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricTemplateVersion
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricTemplateVersion} The decoded data structure.
 */
export function _decode_BiometricTemplateVersion(el: _Element) {
    if (!_cached_decoder_for_BiometricTemplateVersion) {
        _cached_decoder_for_BiometricTemplateVersion = $._decodeInteger;
    }
    return _cached_decoder_for_BiometricTemplateVersion(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricTemplateVersion */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricTemplateVersion */
let _cached_encoder_for_BiometricTemplateVersion: $.ASN1Encoder<BiometricTemplateVersion> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricTemplateVersion */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricTemplateVersion */
/**
 * @summary Encodes a(n) BiometricTemplateVersion into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricTemplateVersion, encoded as an ASN.1 Element.
 */
export function _encode_BiometricTemplateVersion(
    value: BiometricTemplateVersion,
    elGetter: $.ASN1Encoder<BiometricTemplateVersion>
) {
    if (!_cached_encoder_for_BiometricTemplateVersion) {
        _cached_encoder_for_BiometricTemplateVersion = $._encodeInteger;
    }
    return _cached_encoder_for_BiometricTemplateVersion(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricTemplateVersion */

/* eslint-enable */
