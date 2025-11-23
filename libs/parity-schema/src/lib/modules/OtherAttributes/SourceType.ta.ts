/* eslint-disable */
import {
    DistinguishedName,
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from '@wildboar/x500/InformationFramework';
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
export {
    DistinguishedName,
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from '@wildboar/x500/InformationFramework';

/* START_OF_SYMBOL_DEFINITION SourceType */
/**
 * @summary SourceType
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * SourceType  ::=  DistinguishedName
 * ```
 */
export type SourceType = DistinguishedName; // DefinedType
/* END_OF_SYMBOL_DEFINITION SourceType */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SourceType */
let _cached_decoder_for_SourceType: $.ASN1Decoder<SourceType> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SourceType */

/* START_OF_SYMBOL_DEFINITION _decode_SourceType */
/**
 * @summary Decodes an ASN.1 element into a(n) SourceType
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SourceType} The decoded data structure.
 */
export function _decode_SourceType(el: _Element) {
    if (!_cached_decoder_for_SourceType) {
        _cached_decoder_for_SourceType = _decode_DistinguishedName;
    }
    return _cached_decoder_for_SourceType(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SourceType */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SourceType */
let _cached_encoder_for_SourceType: $.ASN1Encoder<SourceType> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SourceType */

/* START_OF_SYMBOL_DEFINITION _encode_SourceType */
/**
 * @summary Encodes a(n) SourceType into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SourceType, encoded as an ASN.1 Element.
 */
export function _encode_SourceType(
    value: SourceType,
    elGetter: $.ASN1Encoder<SourceType>
) {
    if (!_cached_encoder_for_SourceType) {
        _cached_encoder_for_SourceType = _encode_DistinguishedName;
    }
    return _cached_encoder_for_SourceType(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SourceType */

/* eslint-enable */
