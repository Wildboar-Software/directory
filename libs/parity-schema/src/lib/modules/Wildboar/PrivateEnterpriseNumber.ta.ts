/* eslint-disable */
import { ASN1Element as _Element, INTEGER } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION PrivateEnterpriseNumber */
/**
 * @summary PrivateEnterpriseNumber
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * PrivateEnterpriseNumber  ::=  INTEGER (0..MAX)
 * ```
 */
export type PrivateEnterpriseNumber = INTEGER;
/* END_OF_SYMBOL_DEFINITION PrivateEnterpriseNumber */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PrivateEnterpriseNumber */
let _cached_decoder_for_PrivateEnterpriseNumber: $.ASN1Decoder<PrivateEnterpriseNumber> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PrivateEnterpriseNumber */

/* START_OF_SYMBOL_DEFINITION _decode_PrivateEnterpriseNumber */
/**
 * @summary Decodes an ASN.1 element into a(n) PrivateEnterpriseNumber
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PrivateEnterpriseNumber} The decoded data structure.
 */
export function _decode_PrivateEnterpriseNumber(el: _Element) {
    if (!_cached_decoder_for_PrivateEnterpriseNumber) {
        _cached_decoder_for_PrivateEnterpriseNumber = $._decodeInteger;
    }
    return _cached_decoder_for_PrivateEnterpriseNumber(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PrivateEnterpriseNumber */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PrivateEnterpriseNumber */
let _cached_encoder_for_PrivateEnterpriseNumber: $.ASN1Encoder<PrivateEnterpriseNumber> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PrivateEnterpriseNumber */

/* START_OF_SYMBOL_DEFINITION _encode_PrivateEnterpriseNumber */
/**
 * @summary Encodes a(n) PrivateEnterpriseNumber into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PrivateEnterpriseNumber, encoded as an ASN.1 Element.
 */
export function _encode_PrivateEnterpriseNumber(
    value: PrivateEnterpriseNumber,
    elGetter: $.ASN1Encoder<PrivateEnterpriseNumber>
) {
    if (!_cached_encoder_for_PrivateEnterpriseNumber) {
        _cached_encoder_for_PrivateEnterpriseNumber = $._encodeInteger;
    }
    return _cached_encoder_for_PrivateEnterpriseNumber(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_PrivateEnterpriseNumber */

/* eslint-enable */
