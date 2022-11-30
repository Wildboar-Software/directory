/* eslint-disable */
import {
    TBSAttributeCertificate,
    _decode_TBSAttributeCertificate,
    _encode_TBSAttributeCertificate,
} from '@wildboar/x500/src/lib/modules/AttributeCertificateDefinitions/TBSAttributeCertificate.ta';
import { ASN1Element as _Element } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION BiometricPolicyCertificateInfo */
/**
 * @summary BiometricPolicyCertificateInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BiometricPolicyCertificateInfo  ::=
 *   AttributeCertificateInfo(WITH COMPONENTS {
 *                              ...,
 *                              attributes  (SIZE (1..MAX))
 *                            })
 * ```
 */
export type BiometricPolicyCertificateInfo = TBSAttributeCertificate; // DefinedType
/* END_OF_SYMBOL_DEFINITION BiometricPolicyCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricPolicyCertificateInfo */
let _cached_decoder_for_BiometricPolicyCertificateInfo: $.ASN1Decoder<BiometricPolicyCertificateInfo> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricPolicyCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricPolicyCertificateInfo */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricPolicyCertificateInfo
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricPolicyCertificateInfo} The decoded data structure.
 */
export function _decode_BiometricPolicyCertificateInfo(el: _Element) {
    if (!_cached_decoder_for_BiometricPolicyCertificateInfo) {
        _cached_decoder_for_BiometricPolicyCertificateInfo =
            _decode_TBSAttributeCertificate;
    }
    return _cached_decoder_for_BiometricPolicyCertificateInfo(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricPolicyCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricPolicyCertificateInfo */
let _cached_encoder_for_BiometricPolicyCertificateInfo: $.ASN1Encoder<BiometricPolicyCertificateInfo> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricPolicyCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricPolicyCertificateInfo */
/**
 * @summary Encodes a(n) BiometricPolicyCertificateInfo into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricPolicyCertificateInfo, encoded as an ASN.1 Element.
 */
export function _encode_BiometricPolicyCertificateInfo(
    value: BiometricPolicyCertificateInfo,
    elGetter: $.ASN1Encoder<BiometricPolicyCertificateInfo>
) {
    if (!_cached_encoder_for_BiometricPolicyCertificateInfo) {
        _cached_encoder_for_BiometricPolicyCertificateInfo =
            _encode_TBSAttributeCertificate;
    }
    return _cached_encoder_for_BiometricPolicyCertificateInfo(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricPolicyCertificateInfo */

/* eslint-enable */
