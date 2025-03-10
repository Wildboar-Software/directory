/* eslint-disable */
import {
    ASN1Element as _Element,
    INTEGER
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";



/* START_OF_SYMBOL_DEFINITION atn_amhs_addressing_scheme_Type */
/**
 * @summary atn_amhs_addressing_scheme_Type
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-amhs-addressing-scheme-Type ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
 * ```
 */
export
type atn_amhs_addressing_scheme_Type = INTEGER;
/* END_OF_SYMBOL_DEFINITION atn_amhs_addressing_scheme_Type */

/* START_OF_SYMBOL_DEFINITION atn_amhs_addressing_scheme_Type_xf */
/**
 * @summary atn_amhs_addressing_scheme_Type_xf
 * @constant
 * @type {number}
 */
export
const atn_amhs_addressing_scheme_Type_xf: atn_amhs_addressing_scheme_Type = 0; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION atn_amhs_addressing_scheme_Type_xf */

/* START_OF_SYMBOL_DEFINITION xf */
/**
 * @summary atn_amhs_addressing_scheme_Type_xf
 * @constant
 * @type {number}
 */
export
const xf: atn_amhs_addressing_scheme_Type = atn_amhs_addressing_scheme_Type_xf; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION xf */

/* START_OF_SYMBOL_DEFINITION atn_amhs_addressing_scheme_Type_caas */
/**
 * @summary atn_amhs_addressing_scheme_Type_caas
 * @constant
 * @type {number}
 */
export
const atn_amhs_addressing_scheme_Type_caas: atn_amhs_addressing_scheme_Type = 1; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION atn_amhs_addressing_scheme_Type_caas */

/* START_OF_SYMBOL_DEFINITION caas */
/**
 * @summary atn_amhs_addressing_scheme_Type_caas
 * @constant
 * @type {number}
 */
export
const caas: atn_amhs_addressing_scheme_Type = atn_amhs_addressing_scheme_Type_caas; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION caas */

/* START_OF_SYMBOL_DEFINITION atn_amhs_addressing_scheme_Type_other */
/**
 * @summary atn_amhs_addressing_scheme_Type_other
 * @constant
 * @type {number}
 */
export
const atn_amhs_addressing_scheme_Type_other: atn_amhs_addressing_scheme_Type = 2; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION atn_amhs_addressing_scheme_Type_other */

/* START_OF_SYMBOL_DEFINITION other */
/**
 * @summary atn_amhs_addressing_scheme_Type_other
 * @constant
 * @type {number}
 */
export
const other: atn_amhs_addressing_scheme_Type = atn_amhs_addressing_scheme_Type_other; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION other */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_atn_amhs_addressing_scheme_Type */
let _cached_decoder_for_atn_amhs_addressing_scheme_Type: $.ASN1Decoder<atn_amhs_addressing_scheme_Type> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_atn_amhs_addressing_scheme_Type */

/* START_OF_SYMBOL_DEFINITION _decode_atn_amhs_addressing_scheme_Type */
/**
 * @summary Decodes an ASN.1 element into a(n) atn_amhs_addressing_scheme_Type
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {atn_amhs_addressing_scheme_Type} The decoded data structure.
 */
export
function _decode_atn_amhs_addressing_scheme_Type (el: _Element) {
    if (!_cached_decoder_for_atn_amhs_addressing_scheme_Type) { _cached_decoder_for_atn_amhs_addressing_scheme_Type = $._decodeInteger; }
    return _cached_decoder_for_atn_amhs_addressing_scheme_Type(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_atn_amhs_addressing_scheme_Type */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_atn_amhs_addressing_scheme_Type */
let _cached_encoder_for_atn_amhs_addressing_scheme_Type: $.ASN1Encoder<atn_amhs_addressing_scheme_Type> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_atn_amhs_addressing_scheme_Type */

/* START_OF_SYMBOL_DEFINITION _encode_atn_amhs_addressing_scheme_Type */
/**
 * @summary Encodes a(n) atn_amhs_addressing_scheme_Type into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The atn_amhs_addressing_scheme_Type, encoded as an ASN.1 Element.
 */
export
function _encode_atn_amhs_addressing_scheme_Type (value: atn_amhs_addressing_scheme_Type, elGetter: $.ASN1Encoder<atn_amhs_addressing_scheme_Type>) {
    if (!_cached_encoder_for_atn_amhs_addressing_scheme_Type) { _cached_encoder_for_atn_amhs_addressing_scheme_Type = $._encodeInteger; }
    return _cached_encoder_for_atn_amhs_addressing_scheme_Type(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_atn_amhs_addressing_scheme_Type */

/* eslint-enable */
