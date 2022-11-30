/* eslint-disable */
import { ASN1Element as _Element } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import {
    CertId,
    _decode_CertId,
    _encode_CertId,
} from '../PKIXCRMF-2009/CertId.ta';
export {
    CertId,
    _decode_CertId,
    _encode_CertId,
} from '../PKIXCRMF-2009/CertId.ta';

/* START_OF_SYMBOL_DEFINITION OldCertId */
/**
 * @summary OldCertId
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * OldCertId  ::=  CertId
 * ```
 */
export type OldCertId = CertId; // DefinedType
/* END_OF_SYMBOL_DEFINITION OldCertId */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_OldCertId */
let _cached_decoder_for_OldCertId: $.ASN1Decoder<OldCertId> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_OldCertId */

/* START_OF_SYMBOL_DEFINITION _decode_OldCertId */
/**
 * @summary Decodes an ASN.1 element into a(n) OldCertId
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {OldCertId} The decoded data structure.
 */
export function _decode_OldCertId(el: _Element) {
    if (!_cached_decoder_for_OldCertId) {
        _cached_decoder_for_OldCertId = _decode_CertId;
    }
    return _cached_decoder_for_OldCertId(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_OldCertId */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_OldCertId */
let _cached_encoder_for_OldCertId: $.ASN1Encoder<OldCertId> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_OldCertId */

/* START_OF_SYMBOL_DEFINITION _encode_OldCertId */
/**
 * @summary Encodes a(n) OldCertId into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The OldCertId, encoded as an ASN.1 Element.
 */
export function _encode_OldCertId(
    value: OldCertId,
    elGetter: $.ASN1Encoder<OldCertId>
) {
    if (!_cached_encoder_for_OldCertId) {
        _cached_encoder_for_OldCertId = _encode_CertId;
    }
    return _cached_encoder_for_OldCertId(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_OldCertId */

/* eslint-enable */
