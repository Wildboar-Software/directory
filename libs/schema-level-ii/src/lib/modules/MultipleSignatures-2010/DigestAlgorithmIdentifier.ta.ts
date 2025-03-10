/* eslint-disable */
import { AlgorithmIdentifier, _decode_AlgorithmIdentifier, _encode_AlgorithmIdentifier } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";
import {
    ASN1Element as _Element
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";


/* START_OF_SYMBOL_DEFINITION DigestAlgorithmIdentifier */
/**
 * @summary DigestAlgorithmIdentifier
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * DigestAlgorithmIdentifier  ::=  AlgorithmIdentifier{{SupportedAlgorithms}}
 * ```
 */
export
type DigestAlgorithmIdentifier = AlgorithmIdentifier; // DefinedType
/* END_OF_SYMBOL_DEFINITION DigestAlgorithmIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_DigestAlgorithmIdentifier */
let _cached_decoder_for_DigestAlgorithmIdentifier: $.ASN1Decoder<DigestAlgorithmIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_DigestAlgorithmIdentifier */

/* START_OF_SYMBOL_DEFINITION _decode_DigestAlgorithmIdentifier */
/**
 * @summary Decodes an ASN.1 element into a(n) DigestAlgorithmIdentifier
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {DigestAlgorithmIdentifier} The decoded data structure.
 */
export
function _decode_DigestAlgorithmIdentifier (el: _Element) {
    if (!_cached_decoder_for_DigestAlgorithmIdentifier) { _cached_decoder_for_DigestAlgorithmIdentifier = _decode_AlgorithmIdentifier; }
    return _cached_decoder_for_DigestAlgorithmIdentifier(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_DigestAlgorithmIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_DigestAlgorithmIdentifier */
let _cached_encoder_for_DigestAlgorithmIdentifier: $.ASN1Encoder<DigestAlgorithmIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_DigestAlgorithmIdentifier */

/* START_OF_SYMBOL_DEFINITION _encode_DigestAlgorithmIdentifier */
/**
 * @summary Encodes a(n) DigestAlgorithmIdentifier into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The DigestAlgorithmIdentifier, encoded as an ASN.1 Element.
 */
export
function _encode_DigestAlgorithmIdentifier (value: DigestAlgorithmIdentifier, elGetter: $.ASN1Encoder<DigestAlgorithmIdentifier>) {
    if (!_cached_encoder_for_DigestAlgorithmIdentifier) { _cached_encoder_for_DigestAlgorithmIdentifier = _encode_AlgorithmIdentifier; }
    return _cached_encoder_for_DigestAlgorithmIdentifier(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_DigestAlgorithmIdentifier */

/* eslint-enable */
