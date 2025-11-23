/* eslint-disable */
import {
    ASN1Element as _Element,
    INTEGER
} from "@wildboar/asn1";
import * as $ from "@wildboar/asn1/functional";


/* START_OF_SYMBOL_DEFINITION SinglePubInfo_pubMethod */
/**
 * @summary SinglePubInfo_pubMethod
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * SinglePubInfo-pubMethod ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
 * ```
 */
export
type SinglePubInfo_pubMethod = INTEGER;
/* END_OF_SYMBOL_DEFINITION SinglePubInfo_pubMethod */

/* START_OF_SYMBOL_DEFINITION SinglePubInfo_pubMethod_dontCare */
/**
 * @summary SinglePubInfo_pubMethod_dontCare
 * @constant
 * @type {number}
 */
export
const SinglePubInfo_pubMethod_dontCare: SinglePubInfo_pubMethod = 0; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SinglePubInfo_pubMethod_dontCare */

/* START_OF_SYMBOL_DEFINITION dontCare */
/**
 * @summary SinglePubInfo_pubMethod_dontCare
 * @constant
 * @type {number}
 */
export
const dontCare: SinglePubInfo_pubMethod = SinglePubInfo_pubMethod_dontCare; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION dontCare */

/* START_OF_SYMBOL_DEFINITION SinglePubInfo_pubMethod_x500 */
/**
 * @summary SinglePubInfo_pubMethod_x500
 * @constant
 * @type {number}
 */
export
const SinglePubInfo_pubMethod_x500: SinglePubInfo_pubMethod = 1; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SinglePubInfo_pubMethod_x500 */

/* START_OF_SYMBOL_DEFINITION x500 */
/**
 * @summary SinglePubInfo_pubMethod_x500
 * @constant
 * @type {number}
 */
export
const x500: SinglePubInfo_pubMethod = SinglePubInfo_pubMethod_x500; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION x500 */

/* START_OF_SYMBOL_DEFINITION SinglePubInfo_pubMethod_web */
/**
 * @summary SinglePubInfo_pubMethod_web
 * @constant
 * @type {number}
 */
export
const SinglePubInfo_pubMethod_web: SinglePubInfo_pubMethod = 2; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SinglePubInfo_pubMethod_web */

/* START_OF_SYMBOL_DEFINITION web */
/**
 * @summary SinglePubInfo_pubMethod_web
 * @constant
 * @type {number}
 */
export
const web: SinglePubInfo_pubMethod = SinglePubInfo_pubMethod_web; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION web */

/* START_OF_SYMBOL_DEFINITION SinglePubInfo_pubMethod_ldap */
/**
 * @summary SinglePubInfo_pubMethod_ldap
 * @constant
 * @type {number}
 */
export
const SinglePubInfo_pubMethod_ldap: SinglePubInfo_pubMethod = 3; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SinglePubInfo_pubMethod_ldap */

/* START_OF_SYMBOL_DEFINITION ldap */
/**
 * @summary SinglePubInfo_pubMethod_ldap
 * @constant
 * @type {number}
 */
export
const ldap: SinglePubInfo_pubMethod = SinglePubInfo_pubMethod_ldap; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION ldap */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SinglePubInfo_pubMethod */
let _cached_decoder_for_SinglePubInfo_pubMethod: $.ASN1Decoder<SinglePubInfo_pubMethod> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SinglePubInfo_pubMethod */

/* START_OF_SYMBOL_DEFINITION _decode_SinglePubInfo_pubMethod */
/**
 * @summary Decodes an ASN.1 element into a(n) SinglePubInfo_pubMethod
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SinglePubInfo_pubMethod} The decoded data structure.
 */
export
function _decode_SinglePubInfo_pubMethod (el: _Element) {
    if (!_cached_decoder_for_SinglePubInfo_pubMethod) { _cached_decoder_for_SinglePubInfo_pubMethod = $._decodeInteger; }
    return _cached_decoder_for_SinglePubInfo_pubMethod(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SinglePubInfo_pubMethod */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SinglePubInfo_pubMethod */
let _cached_encoder_for_SinglePubInfo_pubMethod: $.ASN1Encoder<SinglePubInfo_pubMethod> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SinglePubInfo_pubMethod */

/* START_OF_SYMBOL_DEFINITION _encode_SinglePubInfo_pubMethod */
/**
 * @summary Encodes a(n) SinglePubInfo_pubMethod into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SinglePubInfo_pubMethod, encoded as an ASN.1 Element.
 */
export
function _encode_SinglePubInfo_pubMethod (value: SinglePubInfo_pubMethod, elGetter: $.ASN1Encoder<SinglePubInfo_pubMethod>) {
    if (!_cached_encoder_for_SinglePubInfo_pubMethod) { _cached_encoder_for_SinglePubInfo_pubMethod = $._encodeInteger; }
    return _cached_encoder_for_SinglePubInfo_pubMethod(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SinglePubInfo_pubMethod */

/* eslint-enable */
