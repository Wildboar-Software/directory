/* eslint-disable */
import { ASN1Element as _Element } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import {
    MLData,
    _decode_MLData,
    _encode_MLData,
} from '../ExtendedSecurityServices-2009/MLData.ta';
export {
    MLData,
    _decode_MLData,
    _encode_MLData,
} from '../ExtendedSecurityServices-2009/MLData.ta';

/* START_OF_SYMBOL_DEFINITION MLExpansionHistory */
/**
 * @summary MLExpansionHistory
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * MLExpansionHistory  ::=  SEQUENCE
 *     SIZE (1..ub-ml-expansion-history) OF MLData
 * ```
 */
export type MLExpansionHistory = MLData[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION MLExpansionHistory */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_MLExpansionHistory */
let _cached_decoder_for_MLExpansionHistory: $.ASN1Decoder<MLExpansionHistory> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_MLExpansionHistory */

/* START_OF_SYMBOL_DEFINITION _decode_MLExpansionHistory */
/**
 * @summary Decodes an ASN.1 element into a(n) MLExpansionHistory
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {MLExpansionHistory} The decoded data structure.
 */
export function _decode_MLExpansionHistory(el: _Element) {
    if (!_cached_decoder_for_MLExpansionHistory) {
        _cached_decoder_for_MLExpansionHistory = $._decodeSequenceOf<MLData>(
            () => _decode_MLData
        );
    }
    return _cached_decoder_for_MLExpansionHistory(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_MLExpansionHistory */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_MLExpansionHistory */
let _cached_encoder_for_MLExpansionHistory: $.ASN1Encoder<MLExpansionHistory> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_MLExpansionHistory */

/* START_OF_SYMBOL_DEFINITION _encode_MLExpansionHistory */
/**
 * @summary Encodes a(n) MLExpansionHistory into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The MLExpansionHistory, encoded as an ASN.1 Element.
 */
export function _encode_MLExpansionHistory(
    value: MLExpansionHistory,
    elGetter: $.ASN1Encoder<MLExpansionHistory>
) {
    if (!_cached_encoder_for_MLExpansionHistory) {
        _cached_encoder_for_MLExpansionHistory = $._encodeSequenceOf<MLData>(
            () => _encode_MLData,
            $.BER
        );
    }
    return _cached_encoder_for_MLExpansionHistory(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_MLExpansionHistory */

/* eslint-enable */
