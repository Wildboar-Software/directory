/* eslint-disable */
import { ASN1Element as _Element } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import {
    Digits,
    _decode_Digits,
    _encode_Digits,
} from '../IN-CS3-SCF-SDF-datatypes/Digits.ta';

/* START_OF_SYMBOL_DEFINITION IsdnAddress */
/**
 * @summary IsdnAddress
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * IsdnAddress  ::=  Digits (SIZE (1..10))
 * ```
 */
export type IsdnAddress = Digits; // DefinedType
/* END_OF_SYMBOL_DEFINITION IsdnAddress */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_IsdnAddress */
let _cached_decoder_for_IsdnAddress: $.ASN1Decoder<IsdnAddress> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_IsdnAddress */

/* START_OF_SYMBOL_DEFINITION _decode_IsdnAddress */
/**
 * @summary Decodes an ASN.1 element into a(n) IsdnAddress
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {IsdnAddress} The decoded data structure.
 */
export function _decode_IsdnAddress(el: _Element) {
    if (!_cached_decoder_for_IsdnAddress) {
        _cached_decoder_for_IsdnAddress = _decode_Digits;
    }
    return _cached_decoder_for_IsdnAddress(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_IsdnAddress */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_IsdnAddress */
let _cached_encoder_for_IsdnAddress: $.ASN1Encoder<IsdnAddress> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_IsdnAddress */

/* START_OF_SYMBOL_DEFINITION _encode_IsdnAddress */
/**
 * @summary Encodes a(n) IsdnAddress into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The IsdnAddress, encoded as an ASN.1 Element.
 */
export function _encode_IsdnAddress(
    value: IsdnAddress,
    elGetter: $.ASN1Encoder<IsdnAddress>
) {
    if (!_cached_encoder_for_IsdnAddress) {
        _cached_encoder_for_IsdnAddress = _encode_Digits;
    }
    return _cached_encoder_for_IsdnAddress(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_IsdnAddress */

/* eslint-enable */
