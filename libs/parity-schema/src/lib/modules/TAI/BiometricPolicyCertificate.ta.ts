/* eslint-disable */
import {
    SIGNED,
    _get_decoder_for_SIGNED,
    _get_encoder_for_SIGNED,
} from '@wildboar/x500/AuthenticationFramework';
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    BiometricPolicyCertificateInfo,
    _decode_BiometricPolicyCertificateInfo,
    _encode_BiometricPolicyCertificateInfo,
} from '../TAI/BiometricPolicyCertificateInfo.ta';
export {
    SIGNED,
    _get_decoder_for_SIGNED,
    _get_encoder_for_SIGNED,
} from '@wildboar/x500/AuthenticationFramework';
export {
    BiometricPolicyCertificateInfo,
    _decode_BiometricPolicyCertificateInfo,
    _encode_BiometricPolicyCertificateInfo,
} from '../TAI/BiometricPolicyCertificateInfo.ta';

/* START_OF_SYMBOL_DEFINITION BiometricPolicyCertificate */
/**
 * @summary BiometricPolicyCertificate
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BiometricPolicyCertificate  ::=
 *   SIGNED{BiometricPolicyCertificateInfo}
 * ```
 */
export type BiometricPolicyCertificate = SIGNED<BiometricPolicyCertificateInfo>; // DefinedType
/* END_OF_SYMBOL_DEFINITION BiometricPolicyCertificate */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricPolicyCertificate */
let _cached_decoder_for_BiometricPolicyCertificate: $.ASN1Decoder<BiometricPolicyCertificate> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricPolicyCertificate */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricPolicyCertificate */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricPolicyCertificate
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricPolicyCertificate} The decoded data structure.
 */
export function _decode_BiometricPolicyCertificate(el: _Element) {
    if (!_cached_decoder_for_BiometricPolicyCertificate) {
        _cached_decoder_for_BiometricPolicyCertificate =
            _get_decoder_for_SIGNED<BiometricPolicyCertificateInfo>(
                _decode_BiometricPolicyCertificateInfo
            );
    }
    return _cached_decoder_for_BiometricPolicyCertificate(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricPolicyCertificate */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricPolicyCertificate */
let _cached_encoder_for_BiometricPolicyCertificate: $.ASN1Encoder<BiometricPolicyCertificate> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricPolicyCertificate */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricPolicyCertificate */
/**
 * @summary Encodes a(n) BiometricPolicyCertificate into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricPolicyCertificate, encoded as an ASN.1 Element.
 */
export function _encode_BiometricPolicyCertificate(
    value: BiometricPolicyCertificate,
    elGetter: $.ASN1Encoder<BiometricPolicyCertificate>
) {
    if (!_cached_encoder_for_BiometricPolicyCertificate) {
        _cached_encoder_for_BiometricPolicyCertificate =
            _get_encoder_for_SIGNED<BiometricPolicyCertificateInfo>(
                _encode_BiometricPolicyCertificateInfo
            );
    }
    return _cached_encoder_for_BiometricPolicyCertificate(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricPolicyCertificate */

/* eslint-enable */
