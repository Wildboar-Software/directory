/* eslint-disable */
import {
    SIGNED,
    _get_decoder_for_SIGNED,
    _get_encoder_for_SIGNED,
} from '@wildboar/x500/AuthenticationFramework';
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    BiometricDeviceCertificateInfo,
    _decode_BiometricDeviceCertificateInfo,
    _encode_BiometricDeviceCertificateInfo,
} from '../TAI/BiometricDeviceCertificateInfo.ta';
export {
    SIGNED,
    _get_decoder_for_SIGNED,
    _get_encoder_for_SIGNED,
} from '@wildboar/x500/AuthenticationFramework';
export {
    BiometricDeviceCertificateInfo,
    _decode_BiometricDeviceCertificateInfo,
    _encode_BiometricDeviceCertificateInfo,
} from '../TAI/BiometricDeviceCertificateInfo.ta';

/* START_OF_SYMBOL_DEFINITION BiometricDeviceCertificate */
/**
 * @summary BiometricDeviceCertificate
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BiometricDeviceCertificate  ::=
 *   SIGNED{BiometricDeviceCertificateInfo}
 * ```
 */
export type BiometricDeviceCertificate = SIGNED<BiometricDeviceCertificateInfo>; // DefinedType
/* END_OF_SYMBOL_DEFINITION BiometricDeviceCertificate */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricDeviceCertificate */
let _cached_decoder_for_BiometricDeviceCertificate: $.ASN1Decoder<BiometricDeviceCertificate> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricDeviceCertificate */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricDeviceCertificate */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricDeviceCertificate
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricDeviceCertificate} The decoded data structure.
 */
export function _decode_BiometricDeviceCertificate(el: _Element) {
    if (!_cached_decoder_for_BiometricDeviceCertificate) {
        _cached_decoder_for_BiometricDeviceCertificate =
            _get_decoder_for_SIGNED<BiometricDeviceCertificateInfo>(
                _decode_BiometricDeviceCertificateInfo
            );
    }
    return _cached_decoder_for_BiometricDeviceCertificate(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricDeviceCertificate */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricDeviceCertificate */
let _cached_encoder_for_BiometricDeviceCertificate: $.ASN1Encoder<BiometricDeviceCertificate> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricDeviceCertificate */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricDeviceCertificate */
/**
 * @summary Encodes a(n) BiometricDeviceCertificate into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricDeviceCertificate, encoded as an ASN.1 Element.
 */
export function _encode_BiometricDeviceCertificate(
    value: BiometricDeviceCertificate,
    elGetter: $.ASN1Encoder<BiometricDeviceCertificate>
) {
    if (!_cached_encoder_for_BiometricDeviceCertificate) {
        _cached_encoder_for_BiometricDeviceCertificate =
            _get_encoder_for_SIGNED<BiometricDeviceCertificateInfo>(
                _encode_BiometricDeviceCertificateInfo
            );
    }
    return _cached_encoder_for_BiometricDeviceCertificate(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricDeviceCertificate */

/* eslint-enable */
