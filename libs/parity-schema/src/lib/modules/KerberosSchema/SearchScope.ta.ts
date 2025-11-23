/* eslint-disable */
import { ASN1Element as _Element, INTEGER } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION SearchScope */
/**
 * @summary SearchScope
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * SearchScope  ::=  INTEGER {
 *     oneLevel (1),
 *     subtree (2)
 * }
 * ```
 */
export type SearchScope = INTEGER;
/* END_OF_SYMBOL_DEFINITION SearchScope */

/* START_OF_SYMBOL_DEFINITION SearchScope_oneLevel */
/**
 * @summary SearchScope_oneLevel
 * @constant
 * @type {number}
 */
export const SearchScope_oneLevel: SearchScope = 1; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SearchScope_oneLevel */

/* START_OF_SYMBOL_DEFINITION oneLevel */
/**
 * @summary SearchScope_oneLevel
 * @constant
 * @type {number}
 */
export const oneLevel: SearchScope =
    SearchScope_oneLevel; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION oneLevel */

/* START_OF_SYMBOL_DEFINITION SearchScope_subtree */
/**
 * @summary SearchScope_subtree
 * @constant
 * @type {number}
 */
export const SearchScope_subtree: SearchScope = 2; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SearchScope_subtree */

/* START_OF_SYMBOL_DEFINITION subtree */
/**
 * @summary SearchScope_subtree
 * @constant
 * @type {number}
 */
export const subtree: SearchScope =
    SearchScope_subtree; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION subtree */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SearchScope */
let _cached_decoder_for_SearchScope: $.ASN1Decoder<SearchScope> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SearchScope */

/* START_OF_SYMBOL_DEFINITION _decode_SearchScope */
/**
 * @summary Decodes an ASN.1 element into a(n) SearchScope
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SearchScope} The decoded data structure.
 */
export function _decode_SearchScope(el: _Element) {
    if (!_cached_decoder_for_SearchScope) {
        _cached_decoder_for_SearchScope = $._decodeInteger;
    }
    return _cached_decoder_for_SearchScope(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SearchScope */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SearchScope */
let _cached_encoder_for_SearchScope: $.ASN1Encoder<SearchScope> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SearchScope */

/* START_OF_SYMBOL_DEFINITION _encode_SearchScope */
/**
 * @summary Encodes a(n) SearchScope into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SearchScope, encoded as an ASN.1 Element.
 */
export function _encode_SearchScope(
    value: SearchScope,
    elGetter: $.ASN1Encoder<SearchScope>
) {
    if (!_cached_encoder_for_SearchScope) {
        _cached_encoder_for_SearchScope = $._encodeInteger;
    }
    return _cached_encoder_for_SearchScope(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SearchScope */

/* eslint-enable */
