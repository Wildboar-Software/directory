/* eslint-disable */
import {
    Certificate,
    _decode_Certificate,
    _encode_Certificate,
} from '@wildboar/x500/AuthenticationFramework';
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { URI, _decode_URI, _encode_URI } from '../TAI/URI.ta';

/* START_OF_SYMBOL_DEFINITION BdcPKCInformation */
/**
 * @summary BdcPKCInformation
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BdcPKCInformation  ::=  CHOICE {
 *   bdcPublicKeyCertificate  Certificate,
 *   -- Certificate is imported from [ITU-T X.509]
 *   bpuCertificateReference  URI
 * }
 * ```
 */
export type BdcPKCInformation =
    | { bdcPublicKeyCertificate: Certificate } /* CHOICE_ALT_ROOT */
    | { bpuCertificateReference: URI } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION BdcPKCInformation */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BdcPKCInformation */
let _cached_decoder_for_BdcPKCInformation: $.ASN1Decoder<BdcPKCInformation> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BdcPKCInformation */

/* START_OF_SYMBOL_DEFINITION _decode_BdcPKCInformation */
/**
 * @summary Decodes an ASN.1 element into a(n) BdcPKCInformation
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BdcPKCInformation} The decoded data structure.
 */
export function _decode_BdcPKCInformation(el: _Element) {
    if (!_cached_decoder_for_BdcPKCInformation) {
        _cached_decoder_for_BdcPKCInformation =
            $._decode_inextensible_choice<BdcPKCInformation>({
                'CONTEXT 0': ['bdcPublicKeyCertificate', _decode_Certificate],
                'CONTEXT 1': ['bpuCertificateReference', _decode_URI],
            });
    }
    return _cached_decoder_for_BdcPKCInformation(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BdcPKCInformation */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BdcPKCInformation */
let _cached_encoder_for_BdcPKCInformation: $.ASN1Encoder<BdcPKCInformation> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BdcPKCInformation */

/* START_OF_SYMBOL_DEFINITION _encode_BdcPKCInformation */
/**
 * @summary Encodes a(n) BdcPKCInformation into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BdcPKCInformation, encoded as an ASN.1 Element.
 */
export function _encode_BdcPKCInformation(
    value: BdcPKCInformation,
    elGetter: $.ASN1Encoder<BdcPKCInformation>
) {
    if (!_cached_encoder_for_BdcPKCInformation) {
        _cached_encoder_for_BdcPKCInformation =
            $._encode_choice<BdcPKCInformation>(
                {
                    bdcPublicKeyCertificate: _encode_Certificate,
                    bpuCertificateReference: _encode_URI,
                },
                $.BER
            );
    }
    return _cached_encoder_for_BdcPKCInformation(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BdcPKCInformation */

/* eslint-enable */
