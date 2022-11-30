/* eslint-disable */
import { ASN1Element as _Element } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import {
    CertReqMsg,
    _decode_CertReqMsg,
    _encode_CertReqMsg,
} from '../PKIXCRMF-2009/CertReqMsg.ta';
export {
    CertReqMsg,
    _decode_CertReqMsg,
    _encode_CertReqMsg,
} from '../PKIXCRMF-2009/CertReqMsg.ta';

/* START_OF_SYMBOL_DEFINITION CertReqMessages */
/**
 * @summary CertReqMessages
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * CertReqMessages  ::=  SEQUENCE SIZE (1..MAX) OF CertReqMsg
 * ```
 */
export type CertReqMessages = CertReqMsg[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION CertReqMessages */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_CertReqMessages */
let _cached_decoder_for_CertReqMessages: $.ASN1Decoder<CertReqMessages> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_CertReqMessages */

/* START_OF_SYMBOL_DEFINITION _decode_CertReqMessages */
/**
 * @summary Decodes an ASN.1 element into a(n) CertReqMessages
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {CertReqMessages} The decoded data structure.
 */
export function _decode_CertReqMessages(el: _Element) {
    if (!_cached_decoder_for_CertReqMessages) {
        _cached_decoder_for_CertReqMessages = $._decodeSequenceOf<CertReqMsg>(
            () => _decode_CertReqMsg
        );
    }
    return _cached_decoder_for_CertReqMessages(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_CertReqMessages */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_CertReqMessages */
let _cached_encoder_for_CertReqMessages: $.ASN1Encoder<CertReqMessages> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_CertReqMessages */

/* START_OF_SYMBOL_DEFINITION _encode_CertReqMessages */
/**
 * @summary Encodes a(n) CertReqMessages into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The CertReqMessages, encoded as an ASN.1 Element.
 */
export function _encode_CertReqMessages(
    value: CertReqMessages,
    elGetter: $.ASN1Encoder<CertReqMessages>
) {
    if (!_cached_encoder_for_CertReqMessages) {
        _cached_encoder_for_CertReqMessages = $._encodeSequenceOf<CertReqMsg>(
            () => _encode_CertReqMsg,
            $.BER
        );
    }
    return _cached_encoder_for_CertReqMessages(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_CertReqMessages */

/* eslint-enable */
