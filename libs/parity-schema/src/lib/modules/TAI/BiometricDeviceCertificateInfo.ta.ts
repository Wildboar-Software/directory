/* eslint-disable */
import {
    TBSAttributeCertificate,
    _decode_TBSAttributeCertificate,
    _encode_TBSAttributeCertificate,
} from '@wildboar/x500/AttributeCertificateDefinitions';
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION BiometricDeviceCertificateInfo */
/**
 * @summary BiometricDeviceCertificateInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BiometricDeviceCertificateInfo  ::=
 *   AttributeCertificateInfo(WITH COMPONENTS {
 *                              ...,
 *                              attributes  (SIZE (1..MAX))
 *                            })
 * ```
 */
export type BiometricDeviceCertificateInfo = TBSAttributeCertificate; // DefinedType
/* END_OF_SYMBOL_DEFINITION BiometricDeviceCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricDeviceCertificateInfo */
let _cached_decoder_for_BiometricDeviceCertificateInfo: $.ASN1Decoder<BiometricDeviceCertificateInfo> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricDeviceCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricDeviceCertificateInfo */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricDeviceCertificateInfo
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricDeviceCertificateInfo} The decoded data structure.
 */
export function _decode_BiometricDeviceCertificateInfo(el: _Element) {
    if (!_cached_decoder_for_BiometricDeviceCertificateInfo) {
        _cached_decoder_for_BiometricDeviceCertificateInfo =
            _decode_TBSAttributeCertificate;
    }
    return _cached_decoder_for_BiometricDeviceCertificateInfo(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricDeviceCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricDeviceCertificateInfo */
let _cached_encoder_for_BiometricDeviceCertificateInfo: $.ASN1Encoder<BiometricDeviceCertificateInfo> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricDeviceCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricDeviceCertificateInfo */
/**
 * @summary Encodes a(n) BiometricDeviceCertificateInfo into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricDeviceCertificateInfo, encoded as an ASN.1 Element.
 */
export function _encode_BiometricDeviceCertificateInfo(
    value: BiometricDeviceCertificateInfo,
    elGetter: $.ASN1Encoder<BiometricDeviceCertificateInfo>
) {
    if (!_cached_encoder_for_BiometricDeviceCertificateInfo) {
        _cached_encoder_for_BiometricDeviceCertificateInfo =
            _encode_TBSAttributeCertificate;
    }
    return _cached_encoder_for_BiometricDeviceCertificateInfo(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricDeviceCertificateInfo */

/* eslint-enable */
