/* eslint-disable */
import {
    ASN1Element as _Element
} from "@wildboar/asn1";
import * as $ from "@wildboar/asn1/functional";
import { SSID, _decode_SSID, _encode_SSID } from "../WLANCertExtn-2010/SSID.ta";


/* START_OF_SYMBOL_DEFINITION SSIDList */
/**
 * @summary SSIDList
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * SSIDList  ::=  SEQUENCE SIZE (1..MAX) OF SSID
 * ```
 */
export
type SSIDList = SSID[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION SSIDList */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SSIDList */
let _cached_decoder_for_SSIDList: $.ASN1Decoder<SSIDList> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SSIDList */

/* START_OF_SYMBOL_DEFINITION _decode_SSIDList */
/**
 * @summary Decodes an ASN.1 element into a(n) SSIDList
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SSIDList} The decoded data structure.
 */
export
function _decode_SSIDList (el: _Element) {
    if (!_cached_decoder_for_SSIDList) { _cached_decoder_for_SSIDList = $._decodeSequenceOf<SSID>(() => _decode_SSID); }
    return _cached_decoder_for_SSIDList(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SSIDList */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SSIDList */
let _cached_encoder_for_SSIDList: $.ASN1Encoder<SSIDList> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SSIDList */

/* START_OF_SYMBOL_DEFINITION _encode_SSIDList */
/**
 * @summary Encodes a(n) SSIDList into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SSIDList, encoded as an ASN.1 Element.
 */
export
function _encode_SSIDList (value: SSIDList, elGetter: $.ASN1Encoder<SSIDList>) {
    if (!_cached_encoder_for_SSIDList) { _cached_encoder_for_SSIDList = $._encodeSequenceOf<SSID>(() => _encode_SSID, $.BER); }
    return _cached_encoder_for_SSIDList(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SSIDList */

/* eslint-enable */
