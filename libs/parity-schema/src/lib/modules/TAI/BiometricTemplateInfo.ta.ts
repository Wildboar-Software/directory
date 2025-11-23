/* eslint-disable */
import { ASN1Element as _Element } from '@wildboar/asn1';
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

/* START_OF_SYMBOL_DEFINITION BiometricTemplateInfo */
/**
 * @summary BiometricTemplateInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BiometricTemplateInfo  ::=  CHOICE {
 *   biometricTemplateInfo19785  BiometricInformationTemplate,
 *   ...
 * }
 * ```
 */
export type BiometricTemplateInfo =
    | {
          biometricTemplateInfo19785: BiometricInformationTemplate;
      } /* CHOICE_ALT_ROOT */
    | _Element /* CHOICE_ALT_UNRECOGNIZED_EXT */;
/* END_OF_SYMBOL_DEFINITION BiometricTemplateInfo */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricTemplateInfo */
let _cached_decoder_for_BiometricTemplateInfo: $.ASN1Decoder<BiometricTemplateInfo> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricTemplateInfo */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricTemplateInfo */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricTemplateInfo
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricTemplateInfo} The decoded data structure.
 */
export function _decode_BiometricTemplateInfo(el: _Element) {
    if (!_cached_decoder_for_BiometricTemplateInfo) {
        _cached_decoder_for_BiometricTemplateInfo =
            $._decode_extensible_choice<BiometricTemplateInfo>({
                'CONTEXT 0': [
                    'biometricTemplateInfo19785',
                    _decode_BiometricInformationTemplate,
                ],
            });
    }
    return _cached_decoder_for_BiometricTemplateInfo(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricTemplateInfo */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricTemplateInfo */
let _cached_encoder_for_BiometricTemplateInfo: $.ASN1Encoder<BiometricTemplateInfo> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricTemplateInfo */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricTemplateInfo */
/**
 * @summary Encodes a(n) BiometricTemplateInfo into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricTemplateInfo, encoded as an ASN.1 Element.
 */
export function _encode_BiometricTemplateInfo(
    value: BiometricTemplateInfo,
    elGetter: $.ASN1Encoder<BiometricTemplateInfo>
) {
    if (!_cached_encoder_for_BiometricTemplateInfo) {
        _cached_encoder_for_BiometricTemplateInfo =
            $._encode_choice<BiometricTemplateInfo>(
                {
                    biometricTemplateInfo19785:
                        _encode_BiometricInformationTemplate,
                },
                $.BER
            );
    }
    return _cached_encoder_for_BiometricTemplateInfo(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricTemplateInfo */

/* eslint-enable */
