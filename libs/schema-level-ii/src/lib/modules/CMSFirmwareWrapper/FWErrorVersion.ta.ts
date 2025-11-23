/* eslint-disable */
import {
    ASN1Element as _Element,
    INTEGER
} from "@wildboar/asn1";
import * as $ from "@wildboar/asn1/functional";


/* START_OF_SYMBOL_DEFINITION FWErrorVersion */
/**
 * @summary FWErrorVersion
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * FWErrorVersion  ::=  INTEGER { v1(1) }
 * ```
 */
export
type FWErrorVersion = INTEGER;
/* END_OF_SYMBOL_DEFINITION FWErrorVersion */

/* START_OF_SYMBOL_DEFINITION FWErrorVersion_v1 */
/**
 * @summary FWErrorVersion_v1
 * @constant
 * @type {number}
 */
export
const FWErrorVersion_v1: FWErrorVersion = 1; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION FWErrorVersion_v1 */

/* START_OF_SYMBOL_DEFINITION v1 */
/**
 * @summary FWErrorVersion_v1
 * @constant
 * @type {number}
 */
export
const v1: FWErrorVersion = FWErrorVersion_v1; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION v1 */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_FWErrorVersion */
let _cached_decoder_for_FWErrorVersion: $.ASN1Decoder<FWErrorVersion> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_FWErrorVersion */

/* START_OF_SYMBOL_DEFINITION _decode_FWErrorVersion */
/**
 * @summary Decodes an ASN.1 element into a(n) FWErrorVersion
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {FWErrorVersion} The decoded data structure.
 */
export
function _decode_FWErrorVersion (el: _Element) {
    if (!_cached_decoder_for_FWErrorVersion) { _cached_decoder_for_FWErrorVersion = $._decodeInteger; }
    return _cached_decoder_for_FWErrorVersion(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_FWErrorVersion */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_FWErrorVersion */
let _cached_encoder_for_FWErrorVersion: $.ASN1Encoder<FWErrorVersion> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_FWErrorVersion */

/* START_OF_SYMBOL_DEFINITION _encode_FWErrorVersion */
/**
 * @summary Encodes a(n) FWErrorVersion into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The FWErrorVersion, encoded as an ASN.1 Element.
 */
export
function _encode_FWErrorVersion (value: FWErrorVersion, elGetter: $.ASN1Encoder<FWErrorVersion>) {
    if (!_cached_encoder_for_FWErrorVersion) { _cached_encoder_for_FWErrorVersion = $._encodeInteger; }
    return _cached_encoder_for_FWErrorVersion(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_FWErrorVersion */

/* eslint-enable */
