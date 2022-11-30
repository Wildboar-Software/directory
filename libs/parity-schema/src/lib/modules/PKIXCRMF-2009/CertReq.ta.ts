/* eslint-disable */
import { ASN1Element as _Element } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import {
    CertRequest,
    _decode_CertRequest,
    _encode_CertRequest,
} from '../PKIXCRMF-2009/CertRequest.ta';
export {
    CertRequest,
    _decode_CertRequest,
    _encode_CertRequest,
} from '../PKIXCRMF-2009/CertRequest.ta';

/* START_OF_SYMBOL_DEFINITION CertReq */
/**
 * @summary CertReq
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * CertReq  ::=  CertRequest
 * ```
 */
export type CertReq = CertRequest; // DefinedType
/* END_OF_SYMBOL_DEFINITION CertReq */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_CertReq */
let _cached_decoder_for_CertReq: $.ASN1Decoder<CertReq> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_CertReq */

/* START_OF_SYMBOL_DEFINITION _decode_CertReq */
/**
 * @summary Decodes an ASN.1 element into a(n) CertReq
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {CertReq} The decoded data structure.
 */
export function _decode_CertReq(el: _Element) {
    if (!_cached_decoder_for_CertReq) {
        _cached_decoder_for_CertReq = _decode_CertRequest;
    }
    return _cached_decoder_for_CertReq(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_CertReq */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_CertReq */
let _cached_encoder_for_CertReq: $.ASN1Encoder<CertReq> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_CertReq */

/* START_OF_SYMBOL_DEFINITION _encode_CertReq */
/**
 * @summary Encodes a(n) CertReq into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The CertReq, encoded as an ASN.1 Element.
 */
export function _encode_CertReq(
    value: CertReq,
    elGetter: $.ASN1Encoder<CertReq>
) {
    if (!_cached_encoder_for_CertReq) {
        _cached_encoder_for_CertReq = _encode_CertRequest;
    }
    return _cached_encoder_for_CertReq(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_CertReq */

/* eslint-enable */
