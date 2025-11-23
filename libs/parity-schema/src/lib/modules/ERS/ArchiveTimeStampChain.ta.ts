/* eslint-disable */
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    ArchiveTimeStamp,
    _decode_ArchiveTimeStamp,
    _encode_ArchiveTimeStamp,
} from '../ERS/ArchiveTimeStamp.ta';
export {
    ArchiveTimeStamp,
    _decode_ArchiveTimeStamp,
    _encode_ArchiveTimeStamp,
} from '../ERS/ArchiveTimeStamp.ta';

/* START_OF_SYMBOL_DEFINITION ArchiveTimeStampChain */
/**
 * @summary ArchiveTimeStampChain
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ArchiveTimeStampChain     ::=  SEQUENCE OF ArchiveTimeStamp
 * ```
 */
export type ArchiveTimeStampChain = ArchiveTimeStamp[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION ArchiveTimeStampChain */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ArchiveTimeStampChain */
let _cached_decoder_for_ArchiveTimeStampChain: $.ASN1Decoder<ArchiveTimeStampChain> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ArchiveTimeStampChain */

/* START_OF_SYMBOL_DEFINITION _decode_ArchiveTimeStampChain */
/**
 * @summary Decodes an ASN.1 element into a(n) ArchiveTimeStampChain
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ArchiveTimeStampChain} The decoded data structure.
 */
export function _decode_ArchiveTimeStampChain(el: _Element) {
    if (!_cached_decoder_for_ArchiveTimeStampChain) {
        _cached_decoder_for_ArchiveTimeStampChain =
            $._decodeSequenceOf<ArchiveTimeStamp>(
                () => _decode_ArchiveTimeStamp
            );
    }
    return _cached_decoder_for_ArchiveTimeStampChain(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ArchiveTimeStampChain */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ArchiveTimeStampChain */
let _cached_encoder_for_ArchiveTimeStampChain: $.ASN1Encoder<ArchiveTimeStampChain> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ArchiveTimeStampChain */

/* START_OF_SYMBOL_DEFINITION _encode_ArchiveTimeStampChain */
/**
 * @summary Encodes a(n) ArchiveTimeStampChain into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ArchiveTimeStampChain, encoded as an ASN.1 Element.
 */
export function _encode_ArchiveTimeStampChain(
    value: ArchiveTimeStampChain,
    elGetter: $.ASN1Encoder<ArchiveTimeStampChain>
) {
    if (!_cached_encoder_for_ArchiveTimeStampChain) {
        _cached_encoder_for_ArchiveTimeStampChain =
            $._encodeSequenceOf<ArchiveTimeStamp>(
                () => _encode_ArchiveTimeStamp,
                $.BER
            );
    }
    return _cached_encoder_for_ArchiveTimeStampChain(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ArchiveTimeStampChain */

/* eslint-enable */
