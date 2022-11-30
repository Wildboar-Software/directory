/* eslint-disable */
import { ASN1Element as _Element } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import {
    ArchiveTimeStampChain,
    _decode_ArchiveTimeStampChain,
    _encode_ArchiveTimeStampChain,
} from '../ERS/ArchiveTimeStampChain.ta';

/* START_OF_SYMBOL_DEFINITION ArchiveTimeStampSequence */
/**
 * @summary ArchiveTimeStampSequence
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ArchiveTimeStampSequence  ::=  SEQUENCE OF ArchiveTimeStampChain
 * ```
 */
export type ArchiveTimeStampSequence = ArchiveTimeStampChain[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION ArchiveTimeStampSequence */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ArchiveTimeStampSequence */
let _cached_decoder_for_ArchiveTimeStampSequence: $.ASN1Decoder<ArchiveTimeStampSequence> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ArchiveTimeStampSequence */

/* START_OF_SYMBOL_DEFINITION _decode_ArchiveTimeStampSequence */
/**
 * @summary Decodes an ASN.1 element into a(n) ArchiveTimeStampSequence
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ArchiveTimeStampSequence} The decoded data structure.
 */
export function _decode_ArchiveTimeStampSequence(el: _Element) {
    if (!_cached_decoder_for_ArchiveTimeStampSequence) {
        _cached_decoder_for_ArchiveTimeStampSequence =
            $._decodeSequenceOf<ArchiveTimeStampChain>(
                () => _decode_ArchiveTimeStampChain
            );
    }
    return _cached_decoder_for_ArchiveTimeStampSequence(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ArchiveTimeStampSequence */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ArchiveTimeStampSequence */
let _cached_encoder_for_ArchiveTimeStampSequence: $.ASN1Encoder<ArchiveTimeStampSequence> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ArchiveTimeStampSequence */

/* START_OF_SYMBOL_DEFINITION _encode_ArchiveTimeStampSequence */
/**
 * @summary Encodes a(n) ArchiveTimeStampSequence into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ArchiveTimeStampSequence, encoded as an ASN.1 Element.
 */
export function _encode_ArchiveTimeStampSequence(
    value: ArchiveTimeStampSequence,
    elGetter: $.ASN1Encoder<ArchiveTimeStampSequence>
) {
    if (!_cached_encoder_for_ArchiveTimeStampSequence) {
        _cached_encoder_for_ArchiveTimeStampSequence =
            $._encodeSequenceOf<ArchiveTimeStampChain>(
                () => _encode_ArchiveTimeStampChain,
                $.BER
            );
    }
    return _cached_encoder_for_ArchiveTimeStampSequence(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ArchiveTimeStampSequence */

/* eslint-enable */
