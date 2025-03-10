/* eslint-disable */
import {
    ASN1Element as _Element
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";



/* START_OF_SYMBOL_DEFINITION _enum_for_AttributeQuality_attribute_completeness */
/**
 * @summary AttributeQuality_attribute_completeness
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * AttributeQuality-attribute-completeness ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
 * ```@enum {number}
 */
export
enum _enum_for_AttributeQuality_attribute_completeness {
    none = 1,
    sample = 2,
    selected = 3,
    substantial = 4,
    full = 5,
}
/* END_OF_SYMBOL_DEFINITION _enum_for_AttributeQuality_attribute_completeness */

/* START_OF_SYMBOL_DEFINITION AttributeQuality_attribute_completeness */
/**
 * @summary AttributeQuality_attribute_completeness
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * AttributeQuality-attribute-completeness ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
 * ```@enum {number}
 */
export
type AttributeQuality_attribute_completeness = _enum_for_AttributeQuality_attribute_completeness;
/* END_OF_SYMBOL_DEFINITION AttributeQuality_attribute_completeness */

/* START_OF_SYMBOL_DEFINITION AttributeQuality_attribute_completeness */
/**
 * @summary AttributeQuality_attribute_completeness
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * AttributeQuality-attribute-completeness ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
 * ```@enum {number}
 */
export
const AttributeQuality_attribute_completeness = _enum_for_AttributeQuality_attribute_completeness;
/* END_OF_SYMBOL_DEFINITION AttributeQuality_attribute_completeness */

/* START_OF_SYMBOL_DEFINITION AttributeQuality_attribute_completeness_none */
/**
 * @summary AttributeQuality_attribute_completeness_none
 * @constant
 * @type {number}
 */
export
const AttributeQuality_attribute_completeness_none: AttributeQuality_attribute_completeness = AttributeQuality_attribute_completeness.none; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION AttributeQuality_attribute_completeness_none */

/* START_OF_SYMBOL_DEFINITION none */
/**
 * @summary none
 * @constant
 * @type {number}
 */
export
const none: AttributeQuality_attribute_completeness = AttributeQuality_attribute_completeness.none; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION none */

/* START_OF_SYMBOL_DEFINITION AttributeQuality_attribute_completeness_sample */
/**
 * @summary AttributeQuality_attribute_completeness_sample
 * @constant
 * @type {number}
 */
export
const AttributeQuality_attribute_completeness_sample: AttributeQuality_attribute_completeness = AttributeQuality_attribute_completeness.sample; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION AttributeQuality_attribute_completeness_sample */

/* START_OF_SYMBOL_DEFINITION sample */
/**
 * @summary sample
 * @constant
 * @type {number}
 */
export
const sample: AttributeQuality_attribute_completeness = AttributeQuality_attribute_completeness.sample; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION sample */

/* START_OF_SYMBOL_DEFINITION AttributeQuality_attribute_completeness_selected */
/**
 * @summary AttributeQuality_attribute_completeness_selected
 * @constant
 * @type {number}
 */
export
const AttributeQuality_attribute_completeness_selected: AttributeQuality_attribute_completeness = AttributeQuality_attribute_completeness.selected; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION AttributeQuality_attribute_completeness_selected */

/* START_OF_SYMBOL_DEFINITION selected */
/**
 * @summary selected
 * @constant
 * @type {number}
 */
export
const selected: AttributeQuality_attribute_completeness = AttributeQuality_attribute_completeness.selected; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION selected */

/* START_OF_SYMBOL_DEFINITION AttributeQuality_attribute_completeness_substantial */
/**
 * @summary AttributeQuality_attribute_completeness_substantial
 * @constant
 * @type {number}
 */
export
const AttributeQuality_attribute_completeness_substantial: AttributeQuality_attribute_completeness = AttributeQuality_attribute_completeness.substantial; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION AttributeQuality_attribute_completeness_substantial */

/* START_OF_SYMBOL_DEFINITION substantial */
/**
 * @summary substantial
 * @constant
 * @type {number}
 */
export
const substantial: AttributeQuality_attribute_completeness = AttributeQuality_attribute_completeness.substantial; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION substantial */

/* START_OF_SYMBOL_DEFINITION AttributeQuality_attribute_completeness_full */
/**
 * @summary AttributeQuality_attribute_completeness_full
 * @constant
 * @type {number}
 */
export
const AttributeQuality_attribute_completeness_full: AttributeQuality_attribute_completeness = AttributeQuality_attribute_completeness.full; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION AttributeQuality_attribute_completeness_full */

/* START_OF_SYMBOL_DEFINITION full */
/**
 * @summary full
 * @constant
 * @type {number}
 */
export
const full: AttributeQuality_attribute_completeness = AttributeQuality_attribute_completeness.full; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION full */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_AttributeQuality_attribute_completeness */
let _cached_decoder_for_AttributeQuality_attribute_completeness: $.ASN1Decoder<AttributeQuality_attribute_completeness> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_AttributeQuality_attribute_completeness */

/* START_OF_SYMBOL_DEFINITION _decode_AttributeQuality_attribute_completeness */
/**
 * @summary Decodes an ASN.1 element into a(n) AttributeQuality_attribute_completeness
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {AttributeQuality_attribute_completeness} The decoded data structure.
 */
export
function _decode_AttributeQuality_attribute_completeness (el: _Element) {
    if (!_cached_decoder_for_AttributeQuality_attribute_completeness) { _cached_decoder_for_AttributeQuality_attribute_completeness = $._decodeEnumerated; }
    return _cached_decoder_for_AttributeQuality_attribute_completeness(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_AttributeQuality_attribute_completeness */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_AttributeQuality_attribute_completeness */
let _cached_encoder_for_AttributeQuality_attribute_completeness: $.ASN1Encoder<AttributeQuality_attribute_completeness> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_AttributeQuality_attribute_completeness */

/* START_OF_SYMBOL_DEFINITION _encode_AttributeQuality_attribute_completeness */
/**
 * @summary Encodes a(n) AttributeQuality_attribute_completeness into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The AttributeQuality_attribute_completeness, encoded as an ASN.1 Element.
 */
export
function _encode_AttributeQuality_attribute_completeness (value: AttributeQuality_attribute_completeness, elGetter: $.ASN1Encoder<AttributeQuality_attribute_completeness>) {
    if (!_cached_encoder_for_AttributeQuality_attribute_completeness) { _cached_encoder_for_AttributeQuality_attribute_completeness = $._encodeEnumerated; }
    return _cached_encoder_for_AttributeQuality_attribute_completeness(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_AttributeQuality_attribute_completeness */

/* eslint-enable */
