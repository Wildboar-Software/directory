/* eslint-disable */
import { ASN1Element as _Element } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import {
    ESSSecurityLabel,
    _decode_ESSSecurityLabel,
    _encode_ESSSecurityLabel,
} from '../ExtendedSecurityServices-2009/ESSSecurityLabel.ta';
export {
    ESSSecurityLabel,
    _decode_ESSSecurityLabel,
    _encode_ESSSecurityLabel,
} from '../ExtendedSecurityServices-2009/ESSSecurityLabel.ta';

/* START_OF_SYMBOL_DEFINITION EquivalentLabels */
/**
 * @summary EquivalentLabels
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * EquivalentLabels  ::=  SEQUENCE OF ESSSecurityLabel
 * ```
 */
export type EquivalentLabels = ESSSecurityLabel[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION EquivalentLabels */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_EquivalentLabels */
let _cached_decoder_for_EquivalentLabels: $.ASN1Decoder<EquivalentLabels> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_EquivalentLabels */

/* START_OF_SYMBOL_DEFINITION _decode_EquivalentLabels */
/**
 * @summary Decodes an ASN.1 element into a(n) EquivalentLabels
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {EquivalentLabels} The decoded data structure.
 */
export function _decode_EquivalentLabels(el: _Element) {
    if (!_cached_decoder_for_EquivalentLabels) {
        _cached_decoder_for_EquivalentLabels =
            $._decodeSequenceOf<ESSSecurityLabel>(
                () => _decode_ESSSecurityLabel
            );
    }
    return _cached_decoder_for_EquivalentLabels(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_EquivalentLabels */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_EquivalentLabels */
let _cached_encoder_for_EquivalentLabels: $.ASN1Encoder<EquivalentLabels> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_EquivalentLabels */

/* START_OF_SYMBOL_DEFINITION _encode_EquivalentLabels */
/**
 * @summary Encodes a(n) EquivalentLabels into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The EquivalentLabels, encoded as an ASN.1 Element.
 */
export function _encode_EquivalentLabels(
    value: EquivalentLabels,
    elGetter: $.ASN1Encoder<EquivalentLabels>
) {
    if (!_cached_encoder_for_EquivalentLabels) {
        _cached_encoder_for_EquivalentLabels =
            $._encodeSequenceOf<ESSSecurityLabel>(
                () => _encode_ESSSecurityLabel,
                $.BER
            );
    }
    return _cached_encoder_for_EquivalentLabels(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_EquivalentLabels */

/* eslint-enable */
