/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION DecryptKeyIdentifier */
/**
 * @summary DecryptKeyIdentifier
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * DecryptKeyIdentifier  ::=  OCTET STRING
 * ```
 */
export type DecryptKeyIdentifier = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION DecryptKeyIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_DecryptKeyIdentifier */
let _cached_decoder_for_DecryptKeyIdentifier: $.ASN1Decoder<DecryptKeyIdentifier> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_DecryptKeyIdentifier */

/* START_OF_SYMBOL_DEFINITION _decode_DecryptKeyIdentifier */
/**
 * @summary Decodes an ASN.1 element into a(n) DecryptKeyIdentifier
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {DecryptKeyIdentifier} The decoded data structure.
 */
export function _decode_DecryptKeyIdentifier(el: _Element) {
    if (!_cached_decoder_for_DecryptKeyIdentifier) {
        _cached_decoder_for_DecryptKeyIdentifier = $._decodeOctetString;
    }
    return _cached_decoder_for_DecryptKeyIdentifier(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_DecryptKeyIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_DecryptKeyIdentifier */
let _cached_encoder_for_DecryptKeyIdentifier: $.ASN1Encoder<DecryptKeyIdentifier> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_DecryptKeyIdentifier */

/* START_OF_SYMBOL_DEFINITION _encode_DecryptKeyIdentifier */
/**
 * @summary Encodes a(n) DecryptKeyIdentifier into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The DecryptKeyIdentifier, encoded as an ASN.1 Element.
 */
export function _encode_DecryptKeyIdentifier(
    value: DecryptKeyIdentifier,
    elGetter: $.ASN1Encoder<DecryptKeyIdentifier>
) {
    if (!_cached_encoder_for_DecryptKeyIdentifier) {
        _cached_encoder_for_DecryptKeyIdentifier = $._encodeOctetString;
    }
    return _cached_encoder_for_DecryptKeyIdentifier(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_DecryptKeyIdentifier */

/* eslint-enable */
