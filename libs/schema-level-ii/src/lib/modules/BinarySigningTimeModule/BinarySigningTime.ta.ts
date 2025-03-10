/* eslint-disable */
import {
    ASN1Element as _Element
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { BinaryTime, _decode_BinaryTime, _encode_BinaryTime } from "../BinarySigningTimeModule/BinaryTime.ta";
export { BinaryTime, _decode_BinaryTime, _encode_BinaryTime } from "../BinarySigningTimeModule/BinaryTime.ta";


/* START_OF_SYMBOL_DEFINITION BinarySigningTime */
/**
 * @summary BinarySigningTime
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BinarySigningTime  ::=  BinaryTime
 * ```
 */
export
type BinarySigningTime = BinaryTime; // DefinedType
/* END_OF_SYMBOL_DEFINITION BinarySigningTime */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BinarySigningTime */
let _cached_decoder_for_BinarySigningTime: $.ASN1Decoder<BinarySigningTime> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BinarySigningTime */

/* START_OF_SYMBOL_DEFINITION _decode_BinarySigningTime */
/**
 * @summary Decodes an ASN.1 element into a(n) BinarySigningTime
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BinarySigningTime} The decoded data structure.
 */
export
function _decode_BinarySigningTime (el: _Element) {
    if (!_cached_decoder_for_BinarySigningTime) { _cached_decoder_for_BinarySigningTime = _decode_BinaryTime; }
    return _cached_decoder_for_BinarySigningTime(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BinarySigningTime */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BinarySigningTime */
let _cached_encoder_for_BinarySigningTime: $.ASN1Encoder<BinarySigningTime> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BinarySigningTime */

/* START_OF_SYMBOL_DEFINITION _encode_BinarySigningTime */
/**
 * @summary Encodes a(n) BinarySigningTime into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BinarySigningTime, encoded as an ASN.1 Element.
 */
export
function _encode_BinarySigningTime (value: BinarySigningTime, elGetter: $.ASN1Encoder<BinarySigningTime>) {
    if (!_cached_encoder_for_BinarySigningTime) { _cached_encoder_for_BinarySigningTime = _encode_BinaryTime; }
    return _cached_encoder_for_BinarySigningTime(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BinarySigningTime */

/* eslint-enable */
