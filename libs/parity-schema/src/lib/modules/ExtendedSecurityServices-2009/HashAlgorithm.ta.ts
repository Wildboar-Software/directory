/* eslint-disable */
import {
    AlgorithmIdentifier,
    _decode_AlgorithmIdentifier,
    _encode_AlgorithmIdentifier,
} from '@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta';
import { ASN1Element as _Element } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
export {
    AlgorithmIdentifier,
    _decode_AlgorithmIdentifier,
    _encode_AlgorithmIdentifier,
} from '@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta';

/* START_OF_SYMBOL_DEFINITION HashAlgorithm */
/**
 * @summary HashAlgorithm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * HashAlgorithm  ::=  AlgorithmIdentifier{{SupportedAlgorithms}}
 * ```
 */
export type HashAlgorithm = AlgorithmIdentifier; // DefinedType
/* END_OF_SYMBOL_DEFINITION HashAlgorithm */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_HashAlgorithm */
let _cached_decoder_for_HashAlgorithm: $.ASN1Decoder<HashAlgorithm> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_HashAlgorithm */

/* START_OF_SYMBOL_DEFINITION _decode_HashAlgorithm */
/**
 * @summary Decodes an ASN.1 element into a(n) HashAlgorithm
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {HashAlgorithm} The decoded data structure.
 */
export function _decode_HashAlgorithm(el: _Element) {
    if (!_cached_decoder_for_HashAlgorithm) {
        _cached_decoder_for_HashAlgorithm = _decode_AlgorithmIdentifier;
    }
    return _cached_decoder_for_HashAlgorithm(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_HashAlgorithm */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_HashAlgorithm */
let _cached_encoder_for_HashAlgorithm: $.ASN1Encoder<HashAlgorithm> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_HashAlgorithm */

/* START_OF_SYMBOL_DEFINITION _encode_HashAlgorithm */
/**
 * @summary Encodes a(n) HashAlgorithm into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The HashAlgorithm, encoded as an ASN.1 Element.
 */
export function _encode_HashAlgorithm(
    value: HashAlgorithm,
    elGetter: $.ASN1Encoder<HashAlgorithm>
) {
    if (!_cached_encoder_for_HashAlgorithm) {
        _cached_encoder_for_HashAlgorithm = _encode_AlgorithmIdentifier;
    }
    return _cached_encoder_for_HashAlgorithm(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_HashAlgorithm */

/* eslint-enable */
