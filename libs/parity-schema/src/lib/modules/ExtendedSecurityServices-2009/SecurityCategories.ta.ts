/* eslint-disable */
import {
    SecurityCategory,
    _decode_SecurityCategory,
    _encode_SecurityCategory,
} from '@wildboar/x500/EnhancedSecurity';
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
export {
    SecurityCategory,
    _decode_SecurityCategory,
    _encode_SecurityCategory,
} from '@wildboar/x500/EnhancedSecurity';

/* START_OF_SYMBOL_DEFINITION SecurityCategories */
/**
 * @summary SecurityCategories
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * SecurityCategories  ::=
 *     SET SIZE (1..ub-security-categories) OF SecurityCategory
 *         {{SupportedSecurityCategories}}
 * ```
 */
export type SecurityCategories = SecurityCategory[]; // SetOfType
/* END_OF_SYMBOL_DEFINITION SecurityCategories */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SecurityCategories */
let _cached_decoder_for_SecurityCategories: $.ASN1Decoder<SecurityCategories> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SecurityCategories */

/* START_OF_SYMBOL_DEFINITION _decode_SecurityCategories */
/**
 * @summary Decodes an ASN.1 element into a(n) SecurityCategories
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SecurityCategories} The decoded data structure.
 */
export function _decode_SecurityCategories(el: _Element) {
    if (!_cached_decoder_for_SecurityCategories) {
        _cached_decoder_for_SecurityCategories =
            $._decodeSetOf<SecurityCategory>(() => _decode_SecurityCategory);
    }
    return _cached_decoder_for_SecurityCategories(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SecurityCategories */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SecurityCategories */
let _cached_encoder_for_SecurityCategories: $.ASN1Encoder<SecurityCategories> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SecurityCategories */

/* START_OF_SYMBOL_DEFINITION _encode_SecurityCategories */
/**
 * @summary Encodes a(n) SecurityCategories into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SecurityCategories, encoded as an ASN.1 Element.
 */
export function _encode_SecurityCategories(
    value: SecurityCategories,
    elGetter: $.ASN1Encoder<SecurityCategories>
) {
    if (!_cached_encoder_for_SecurityCategories) {
        _cached_encoder_for_SecurityCategories =
            $._encodeSetOf<SecurityCategory>(
                () => _encode_SecurityCategory,
                $.BER
            );
    }
    return _cached_encoder_for_SecurityCategories(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SecurityCategories */

/* eslint-enable */
