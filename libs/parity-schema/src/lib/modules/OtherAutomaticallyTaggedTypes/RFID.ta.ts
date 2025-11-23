/* eslint-disable */
import { ASN1Element as _Element, OCTET_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION RFID */
/**
 * @summary RFID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * RFID  ::=  OCTET STRING
 * ```
 */
export type RFID = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION RFID */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_RFID */
let _cached_decoder_for_RFID: $.ASN1Decoder<RFID> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_RFID */

/* START_OF_SYMBOL_DEFINITION _decode_RFID */
/**
 * @summary Decodes an ASN.1 element into a(n) RFID
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {RFID} The decoded data structure.
 */
export function _decode_RFID(el: _Element) {
    if (!_cached_decoder_for_RFID) {
        _cached_decoder_for_RFID = $._decodeOctetString;
    }
    return _cached_decoder_for_RFID(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_RFID */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_RFID */
let _cached_encoder_for_RFID: $.ASN1Encoder<RFID> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_RFID */

/* START_OF_SYMBOL_DEFINITION _encode_RFID */
/**
 * @summary Encodes a(n) RFID into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The RFID, encoded as an ASN.1 Element.
 */
export function _encode_RFID(value: RFID, elGetter: $.ASN1Encoder<RFID>) {
    if (!_cached_encoder_for_RFID) {
        _cached_encoder_for_RFID = $._encodeOctetString;
    }
    return _cached_encoder_for_RFID(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_RFID */

/* eslint-enable */
