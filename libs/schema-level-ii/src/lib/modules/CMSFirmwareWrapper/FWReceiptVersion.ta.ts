/* eslint-disable */
import {
    ASN1Element as _Element,
    INTEGER
} from "@wildboar/asn1";
import * as $ from "@wildboar/asn1/functional";


/* START_OF_SYMBOL_DEFINITION FWReceiptVersion */
/**
 * @summary FWReceiptVersion
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * FWReceiptVersion  ::=  INTEGER { v1(1) }
 * ```
 */
export
type FWReceiptVersion = INTEGER;
/* END_OF_SYMBOL_DEFINITION FWReceiptVersion */

/* START_OF_SYMBOL_DEFINITION FWReceiptVersion_v1 */
/**
 * @summary FWReceiptVersion_v1
 * @constant
 * @type {number}
 */
export
const FWReceiptVersion_v1: FWReceiptVersion = 1; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION FWReceiptVersion_v1 */

/* START_OF_SYMBOL_DEFINITION v1 */
/**
 * @summary FWReceiptVersion_v1
 * @constant
 * @type {number}
 */
export
const v1: FWReceiptVersion = FWReceiptVersion_v1; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION v1 */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_FWReceiptVersion */
let _cached_decoder_for_FWReceiptVersion: $.ASN1Decoder<FWReceiptVersion> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_FWReceiptVersion */

/* START_OF_SYMBOL_DEFINITION _decode_FWReceiptVersion */
/**
 * @summary Decodes an ASN.1 element into a(n) FWReceiptVersion
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {FWReceiptVersion} The decoded data structure.
 */
export
function _decode_FWReceiptVersion (el: _Element) {
    if (!_cached_decoder_for_FWReceiptVersion) { _cached_decoder_for_FWReceiptVersion = $._decodeInteger; }
    return _cached_decoder_for_FWReceiptVersion(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_FWReceiptVersion */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_FWReceiptVersion */
let _cached_encoder_for_FWReceiptVersion: $.ASN1Encoder<FWReceiptVersion> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_FWReceiptVersion */

/* START_OF_SYMBOL_DEFINITION _encode_FWReceiptVersion */
/**
 * @summary Encodes a(n) FWReceiptVersion into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The FWReceiptVersion, encoded as an ASN.1 Element.
 */
export
function _encode_FWReceiptVersion (value: FWReceiptVersion, elGetter: $.ASN1Encoder<FWReceiptVersion>) {
    if (!_cached_encoder_for_FWReceiptVersion) { _cached_encoder_for_FWReceiptVersion = $._encodeInteger; }
    return _cached_encoder_for_FWReceiptVersion(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_FWReceiptVersion */

/* eslint-enable */
