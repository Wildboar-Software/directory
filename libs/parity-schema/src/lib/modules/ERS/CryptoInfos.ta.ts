/* eslint-disable */
import {
    Attribute,
    _decode_Attribute,
    _encode_Attribute,
} from '@wildboar/x500/InformationFramework';
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
export {
    Attribute,
    _decode_Attribute,
    _encode_Attribute,
} from '@wildboar/x500/InformationFramework';

/* START_OF_SYMBOL_DEFINITION CryptoInfos */
/**
 * @summary CryptoInfos
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * CryptoInfos  ::=  SEQUENCE SIZE (1..MAX) OF Attribute
 * ```
 */
export type CryptoInfos = Attribute[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION CryptoInfos */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_CryptoInfos */
let _cached_decoder_for_CryptoInfos: $.ASN1Decoder<CryptoInfos> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_CryptoInfos */

/* START_OF_SYMBOL_DEFINITION _decode_CryptoInfos */
/**
 * @summary Decodes an ASN.1 element into a(n) CryptoInfos
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {CryptoInfos} The decoded data structure.
 */
export function _decode_CryptoInfos(el: _Element) {
    if (!_cached_decoder_for_CryptoInfos) {
        _cached_decoder_for_CryptoInfos = $._decodeSequenceOf<Attribute>(
            () => _decode_Attribute
        );
    }
    return _cached_decoder_for_CryptoInfos(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_CryptoInfos */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_CryptoInfos */
let _cached_encoder_for_CryptoInfos: $.ASN1Encoder<CryptoInfos> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_CryptoInfos */

/* START_OF_SYMBOL_DEFINITION _encode_CryptoInfos */
/**
 * @summary Encodes a(n) CryptoInfos into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The CryptoInfos, encoded as an ASN.1 Element.
 */
export function _encode_CryptoInfos(
    value: CryptoInfos,
    elGetter: $.ASN1Encoder<CryptoInfos>
) {
    if (!_cached_encoder_for_CryptoInfos) {
        _cached_encoder_for_CryptoInfos = $._encodeSequenceOf<Attribute>(
            () => _encode_Attribute,
            $.BER
        );
    }
    return _cached_encoder_for_CryptoInfos(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_CryptoInfos */

/* eslint-enable */
