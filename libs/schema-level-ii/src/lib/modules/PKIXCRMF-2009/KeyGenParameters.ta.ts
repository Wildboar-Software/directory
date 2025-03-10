/* eslint-disable */
import {
    ASN1Element as _Element,
    OCTET_STRING
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";



/* START_OF_SYMBOL_DEFINITION KeyGenParameters */
/**
 * @summary KeyGenParameters
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * KeyGenParameters  ::=  OCTET STRING
 * ```
 */
export
type KeyGenParameters = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION KeyGenParameters */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_KeyGenParameters */
let _cached_decoder_for_KeyGenParameters: $.ASN1Decoder<KeyGenParameters> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_KeyGenParameters */

/* START_OF_SYMBOL_DEFINITION _decode_KeyGenParameters */
/**
 * @summary Decodes an ASN.1 element into a(n) KeyGenParameters
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {KeyGenParameters} The decoded data structure.
 */
export
function _decode_KeyGenParameters (el: _Element) {
    if (!_cached_decoder_for_KeyGenParameters) { _cached_decoder_for_KeyGenParameters = $._decodeOctetString; }
    return _cached_decoder_for_KeyGenParameters(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_KeyGenParameters */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_KeyGenParameters */
let _cached_encoder_for_KeyGenParameters: $.ASN1Encoder<KeyGenParameters> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_KeyGenParameters */

/* START_OF_SYMBOL_DEFINITION _encode_KeyGenParameters */
/**
 * @summary Encodes a(n) KeyGenParameters into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The KeyGenParameters, encoded as an ASN.1 Element.
 */
export
function _encode_KeyGenParameters (value: KeyGenParameters, elGetter: $.ASN1Encoder<KeyGenParameters>) {
    if (!_cached_encoder_for_KeyGenParameters) { _cached_encoder_for_KeyGenParameters = $._encodeOctetString; }
    return _cached_encoder_for_KeyGenParameters(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_KeyGenParameters */

/* eslint-enable */
