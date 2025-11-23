/* eslint-disable */
import { ASN1Element as _Element, ASN1TagClass as _TagClass } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    BiometricInformationTemplate,
    _decode_BiometricInformationTemplate,
    _encode_BiometricInformationTemplate,
} from '../CBEFF-SMARTCARD-BIDO/BiometricInformationTemplate.ta';
export {
    BiometricInformationTemplate,
    _decode_BiometricInformationTemplate,
    _encode_BiometricInformationTemplate,
} from '../CBEFF-SMARTCARD-BIDO/BiometricInformationTemplate.ta';

/* START_OF_SYMBOL_DEFINITION GroupBIT */
/**
 * @summary GroupBIT
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * GroupBIT  ::=  [APPLICATION 97]  SET OF BiometricInformationTemplate
 * ```
 */
export type GroupBIT = BiometricInformationTemplate[]; // SetOfType
/* END_OF_SYMBOL_DEFINITION GroupBIT */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_GroupBIT */
let _cached_decoder_for_GroupBIT: $.ASN1Decoder<GroupBIT> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_GroupBIT */

/* START_OF_SYMBOL_DEFINITION _decode_GroupBIT */
/**
 * @summary Decodes an ASN.1 element into a(n) GroupBIT
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {GroupBIT} The decoded data structure.
 */
export function _decode_GroupBIT(el: _Element) {
    if (!_cached_decoder_for_GroupBIT) {
        _cached_decoder_for_GroupBIT = $._decode_implicit<GroupBIT>(() =>
            $._decodeSetOf<BiometricInformationTemplate>(
                () => _decode_BiometricInformationTemplate
            )
        );
    }
    return _cached_decoder_for_GroupBIT(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_GroupBIT */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_GroupBIT */
let _cached_encoder_for_GroupBIT: $.ASN1Encoder<GroupBIT> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_GroupBIT */

/* START_OF_SYMBOL_DEFINITION _encode_GroupBIT */
/**
 * @summary Encodes a(n) GroupBIT into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The GroupBIT, encoded as an ASN.1 Element.
 */
export function _encode_GroupBIT(
    value: GroupBIT,
    elGetter: $.ASN1Encoder<GroupBIT>
) {
    if (!_cached_encoder_for_GroupBIT) {
        _cached_encoder_for_GroupBIT = $._encode_implicit(
            _TagClass.application,
            97,
            () =>
                $._encodeSetOf<BiometricInformationTemplate>(
                    () => _encode_BiometricInformationTemplate,
                    $.BER
                ),
            $.BER
        );
    }
    return _cached_encoder_for_GroupBIT(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_GroupBIT */

/* eslint-enable */
