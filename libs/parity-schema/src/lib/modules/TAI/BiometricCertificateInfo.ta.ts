/* eslint-disable */
import {
    TBSAttributeCertificate,
    _decode_TBSAttributeCertificate,
    _encode_TBSAttributeCertificate,
} from '@wildboar/x500/AttributeCertificateDefinitions';
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION BiometricCertificateInfo */
/**
 * @summary BiometricCertificateInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BiometricCertificateInfo  ::=
 *   AttributeCertificateInfo(WITH COMPONENTS {
 *                              ...,
 *                              attributes  (SIZE (1..MAX))
 *                            })
 * ```
 */
export type BiometricCertificateInfo = TBSAttributeCertificate; // DefinedType
/* END_OF_SYMBOL_DEFINITION BiometricCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricCertificateInfo */
let _cached_decoder_for_BiometricCertificateInfo: $.ASN1Decoder<BiometricCertificateInfo> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricCertificateInfo */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricCertificateInfo
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricCertificateInfo} The decoded data structure.
 */
export function _decode_BiometricCertificateInfo(el: _Element) {
    if (!_cached_decoder_for_BiometricCertificateInfo) {
        _cached_decoder_for_BiometricCertificateInfo =
            _decode_TBSAttributeCertificate;
    }
    return _cached_decoder_for_BiometricCertificateInfo(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricCertificateInfo */
let _cached_encoder_for_BiometricCertificateInfo: $.ASN1Encoder<BiometricCertificateInfo> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricCertificateInfo */
/**
 * @summary Encodes a(n) BiometricCertificateInfo into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricCertificateInfo, encoded as an ASN.1 Element.
 */
export function _encode_BiometricCertificateInfo(
    value: BiometricCertificateInfo,
    elGetter: $.ASN1Encoder<BiometricCertificateInfo>
) {
    if (!_cached_encoder_for_BiometricCertificateInfo) {
        _cached_encoder_for_BiometricCertificateInfo =
            _encode_TBSAttributeCertificate;
    }
    return _cached_encoder_for_BiometricCertificateInfo(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricCertificateInfo */

/* eslint-enable */
