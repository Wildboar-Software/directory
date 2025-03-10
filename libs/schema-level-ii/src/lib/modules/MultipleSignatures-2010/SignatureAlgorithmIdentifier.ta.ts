/* eslint-disable */
import { AlgorithmIdentifier, _decode_AlgorithmIdentifier, _encode_AlgorithmIdentifier } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";
import {
    ASN1Element as _Element
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";


/* START_OF_SYMBOL_DEFINITION SignatureAlgorithmIdentifier */
/**
 * @summary SignatureAlgorithmIdentifier
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * SignatureAlgorithmIdentifier  ::=  AlgorithmIdentifier{{SupportedAlgorithms}}
 * ```
 */
export
type SignatureAlgorithmIdentifier = AlgorithmIdentifier; // DefinedType
/* END_OF_SYMBOL_DEFINITION SignatureAlgorithmIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SignatureAlgorithmIdentifier */
let _cached_decoder_for_SignatureAlgorithmIdentifier: $.ASN1Decoder<SignatureAlgorithmIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SignatureAlgorithmIdentifier */

/* START_OF_SYMBOL_DEFINITION _decode_SignatureAlgorithmIdentifier */
/**
 * @summary Decodes an ASN.1 element into a(n) SignatureAlgorithmIdentifier
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SignatureAlgorithmIdentifier} The decoded data structure.
 */
export
function _decode_SignatureAlgorithmIdentifier (el: _Element) {
    if (!_cached_decoder_for_SignatureAlgorithmIdentifier) { _cached_decoder_for_SignatureAlgorithmIdentifier = _decode_AlgorithmIdentifier; }
    return _cached_decoder_for_SignatureAlgorithmIdentifier(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SignatureAlgorithmIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SignatureAlgorithmIdentifier */
let _cached_encoder_for_SignatureAlgorithmIdentifier: $.ASN1Encoder<SignatureAlgorithmIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SignatureAlgorithmIdentifier */

/* START_OF_SYMBOL_DEFINITION _encode_SignatureAlgorithmIdentifier */
/**
 * @summary Encodes a(n) SignatureAlgorithmIdentifier into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SignatureAlgorithmIdentifier, encoded as an ASN.1 Element.
 */
export
function _encode_SignatureAlgorithmIdentifier (value: SignatureAlgorithmIdentifier, elGetter: $.ASN1Encoder<SignatureAlgorithmIdentifier>) {
    if (!_cached_encoder_for_SignatureAlgorithmIdentifier) { _cached_encoder_for_SignatureAlgorithmIdentifier = _encode_AlgorithmIdentifier; }
    return _cached_encoder_for_SignatureAlgorithmIdentifier(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SignatureAlgorithmIdentifier */

/* eslint-enable */
