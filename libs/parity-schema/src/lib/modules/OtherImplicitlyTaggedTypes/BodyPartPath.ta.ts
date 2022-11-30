/* eslint-disable */
import { ASN1Element as _Element } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import {
    BodyPartID,
    _decode_BodyPartID,
    _encode_BodyPartID,
} from '../OtherImplicitlyTaggedTypes/BodyPartID.ta';

/* START_OF_SYMBOL_DEFINITION BodyPartPath */
/**
 * @summary BodyPartPath
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BodyPartPath  ::=  SEQUENCE SIZE (1..MAX) OF BodyPartID
 * ```
 */
export type BodyPartPath = BodyPartID[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION BodyPartPath */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BodyPartPath */
let _cached_decoder_for_BodyPartPath: $.ASN1Decoder<BodyPartPath> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BodyPartPath */

/* START_OF_SYMBOL_DEFINITION _decode_BodyPartPath */
/**
 * @summary Decodes an ASN.1 element into a(n) BodyPartPath
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BodyPartPath} The decoded data structure.
 */
export function _decode_BodyPartPath(el: _Element) {
    if (!_cached_decoder_for_BodyPartPath) {
        _cached_decoder_for_BodyPartPath = $._decodeSequenceOf<BodyPartID>(
            () => _decode_BodyPartID
        );
    }
    return _cached_decoder_for_BodyPartPath(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BodyPartPath */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BodyPartPath */
let _cached_encoder_for_BodyPartPath: $.ASN1Encoder<BodyPartPath> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BodyPartPath */

/* START_OF_SYMBOL_DEFINITION _encode_BodyPartPath */
/**
 * @summary Encodes a(n) BodyPartPath into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BodyPartPath, encoded as an ASN.1 Element.
 */
export function _encode_BodyPartPath(
    value: BodyPartPath,
    elGetter: $.ASN1Encoder<BodyPartPath>
) {
    if (!_cached_encoder_for_BodyPartPath) {
        _cached_encoder_for_BodyPartPath = $._encodeSequenceOf<BodyPartID>(
            () => _encode_BodyPartID,
            $.BER
        );
    }
    return _cached_encoder_for_BodyPartPath(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BodyPartPath */

/* eslint-enable */
