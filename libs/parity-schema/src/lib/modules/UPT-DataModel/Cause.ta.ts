/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION Cause */
/**
 * @summary Cause
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * Cause  ::=  OCTET STRING(SIZE (minCauseLength..maxCauseLength))
 * ```
 */
export type Cause = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION Cause */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Cause */
let _cached_decoder_for_Cause: $.ASN1Decoder<Cause> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Cause */

/* START_OF_SYMBOL_DEFINITION _decode_Cause */
/**
 * @summary Decodes an ASN.1 element into a(n) Cause
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Cause} The decoded data structure.
 */
export function _decode_Cause(el: _Element) {
    if (!_cached_decoder_for_Cause) {
        _cached_decoder_for_Cause = $._decodeOctetString;
    }
    return _cached_decoder_for_Cause(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Cause */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Cause */
let _cached_encoder_for_Cause: $.ASN1Encoder<Cause> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Cause */

/* START_OF_SYMBOL_DEFINITION _encode_Cause */
/**
 * @summary Encodes a(n) Cause into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Cause, encoded as an ASN.1 Element.
 */
export function _encode_Cause(value: Cause, elGetter: $.ASN1Encoder<Cause>) {
    if (!_cached_encoder_for_Cause) {
        _cached_encoder_for_Cause = $._encodeOctetString;
    }
    return _cached_encoder_for_Cause(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Cause */

/* eslint-enable */
