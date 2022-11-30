/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION PlaintextPasswordSyntax */
/**
 * @summary PlaintextPasswordSyntax
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * PlaintextPasswordSyntax  ::=  OCTET STRING
 * ```
 */
export type PlaintextPasswordSyntax = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION PlaintextPasswordSyntax */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PlaintextPasswordSyntax */
let _cached_decoder_for_PlaintextPasswordSyntax: $.ASN1Decoder<PlaintextPasswordSyntax> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PlaintextPasswordSyntax */

/* START_OF_SYMBOL_DEFINITION _decode_PlaintextPasswordSyntax */
/**
 * @summary Decodes an ASN.1 element into a(n) PlaintextPasswordSyntax
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PlaintextPasswordSyntax} The decoded data structure.
 */
export function _decode_PlaintextPasswordSyntax(el: _Element) {
    if (!_cached_decoder_for_PlaintextPasswordSyntax) {
        _cached_decoder_for_PlaintextPasswordSyntax = $._decodeOctetString;
    }
    return _cached_decoder_for_PlaintextPasswordSyntax(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PlaintextPasswordSyntax */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PlaintextPasswordSyntax */
let _cached_encoder_for_PlaintextPasswordSyntax: $.ASN1Encoder<PlaintextPasswordSyntax> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PlaintextPasswordSyntax */

/* START_OF_SYMBOL_DEFINITION _encode_PlaintextPasswordSyntax */
/**
 * @summary Encodes a(n) PlaintextPasswordSyntax into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PlaintextPasswordSyntax, encoded as an ASN.1 Element.
 */
export function _encode_PlaintextPasswordSyntax(
    value: PlaintextPasswordSyntax,
    elGetter: $.ASN1Encoder<PlaintextPasswordSyntax>
) {
    if (!_cached_encoder_for_PlaintextPasswordSyntax) {
        _cached_encoder_for_PlaintextPasswordSyntax = $._encodeOctetString;
    }
    return _cached_encoder_for_PlaintextPasswordSyntax(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_PlaintextPasswordSyntax */

/* eslint-enable */
