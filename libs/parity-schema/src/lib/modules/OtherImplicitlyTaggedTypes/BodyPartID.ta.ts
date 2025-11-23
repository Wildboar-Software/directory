/* eslint-disable */
import { ASN1Element as _Element, INTEGER } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION BodyPartID */
/**
 * @summary BodyPartID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BodyPartID  ::=  INTEGER (0..4294967295)
 * ```
 */
export type BodyPartID = INTEGER;
/* END_OF_SYMBOL_DEFINITION BodyPartID */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BodyPartID */
let _cached_decoder_for_BodyPartID: $.ASN1Decoder<BodyPartID> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BodyPartID */

/* START_OF_SYMBOL_DEFINITION _decode_BodyPartID */
/**
 * @summary Decodes an ASN.1 element into a(n) BodyPartID
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BodyPartID} The decoded data structure.
 */
export function _decode_BodyPartID(el: _Element) {
    if (!_cached_decoder_for_BodyPartID) {
        _cached_decoder_for_BodyPartID = $._decodeInteger;
    }
    return _cached_decoder_for_BodyPartID(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BodyPartID */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BodyPartID */
let _cached_encoder_for_BodyPartID: $.ASN1Encoder<BodyPartID> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BodyPartID */

/* START_OF_SYMBOL_DEFINITION _encode_BodyPartID */
/**
 * @summary Encodes a(n) BodyPartID into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BodyPartID, encoded as an ASN.1 Element.
 */
export function _encode_BodyPartID(
    value: BodyPartID,
    elGetter: $.ASN1Encoder<BodyPartID>
) {
    if (!_cached_encoder_for_BodyPartID) {
        _cached_encoder_for_BodyPartID = $._encodeInteger;
    }
    return _cached_encoder_for_BodyPartID(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BodyPartID */

/* eslint-enable */
