/* eslint-disable */
import {
    SIGNED,
    _get_decoder_for_SIGNED,
    _get_encoder_for_SIGNED,
} from '@wildboar/x500/AuthenticationFramework';
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    BiometricCertificateInfo,
    _decode_BiometricCertificateInfo,
    _encode_BiometricCertificateInfo,
} from '../TAI/BiometricCertificateInfo.ta';
export {
    SIGNED,
    _get_decoder_for_SIGNED,
    _get_encoder_for_SIGNED,
} from '@wildboar/x500/AuthenticationFramework';
export {
    BiometricCertificateInfo,
    _decode_BiometricCertificateInfo,
    _encode_BiometricCertificateInfo,
} from '../TAI/BiometricCertificateInfo.ta';

/* START_OF_SYMBOL_DEFINITION BiometricCertificate */
/**
 * @summary BiometricCertificate
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BiometricCertificate  ::=
 *   SIGNED{BiometricCertificateInfo}
 * ```
 */
export type BiometricCertificate = SIGNED<BiometricCertificateInfo>; // DefinedType
/* END_OF_SYMBOL_DEFINITION BiometricCertificate */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricCertificate */
let _cached_decoder_for_BiometricCertificate: $.ASN1Decoder<BiometricCertificate> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricCertificate */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricCertificate */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricCertificate
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricCertificate} The decoded data structure.
 */
export function _decode_BiometricCertificate(el: _Element) {
    if (!_cached_decoder_for_BiometricCertificate) {
        _cached_decoder_for_BiometricCertificate =
            _get_decoder_for_SIGNED<BiometricCertificateInfo>(
                _decode_BiometricCertificateInfo
            );
    }
    return _cached_decoder_for_BiometricCertificate(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricCertificate */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricCertificate */
let _cached_encoder_for_BiometricCertificate: $.ASN1Encoder<BiometricCertificate> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricCertificate */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricCertificate */
/**
 * @summary Encodes a(n) BiometricCertificate into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricCertificate, encoded as an ASN.1 Element.
 */
export function _encode_BiometricCertificate(
    value: BiometricCertificate,
    elGetter: $.ASN1Encoder<BiometricCertificate>
) {
    if (!_cached_encoder_for_BiometricCertificate) {
        _cached_encoder_for_BiometricCertificate =
            _get_encoder_for_SIGNED<BiometricCertificateInfo>(
                _encode_BiometricCertificateInfo
            );
    }
    return _cached_encoder_for_BiometricCertificate(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricCertificate */

/* eslint-enable */
