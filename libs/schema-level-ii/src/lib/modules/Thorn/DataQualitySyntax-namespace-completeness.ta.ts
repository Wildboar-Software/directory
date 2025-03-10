/* eslint-disable */
import {
    ASN1Element as _Element
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";


/* START_OF_SYMBOL_DEFINITION _enum_for_DataQualitySyntax_namespace_completeness */
/**
 * @summary DataQualitySyntax_namespace_completeness
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * DataQualitySyntax-namespace-completeness ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
 * ```@enum {number}
 */
export
enum _enum_for_DataQualitySyntax_namespace_completeness {
    none = 1,
    sample = 2,
    selected = 3,
    substantial = 4,
    full = 5,
}
/* END_OF_SYMBOL_DEFINITION _enum_for_DataQualitySyntax_namespace_completeness */

/* START_OF_SYMBOL_DEFINITION DataQualitySyntax_namespace_completeness */
/**
 * @summary DataQualitySyntax_namespace_completeness
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * DataQualitySyntax-namespace-completeness ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
 * ```@enum {number}
 */
export
type DataQualitySyntax_namespace_completeness = _enum_for_DataQualitySyntax_namespace_completeness;
/* END_OF_SYMBOL_DEFINITION DataQualitySyntax_namespace_completeness */

/* START_OF_SYMBOL_DEFINITION DataQualitySyntax_namespace_completeness */
/**
 * @summary DataQualitySyntax_namespace_completeness
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * DataQualitySyntax-namespace-completeness ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
 * ```@enum {number}
 */
export
const DataQualitySyntax_namespace_completeness = _enum_for_DataQualitySyntax_namespace_completeness;
/* END_OF_SYMBOL_DEFINITION DataQualitySyntax_namespace_completeness */

/* START_OF_SYMBOL_DEFINITION DataQualitySyntax_namespace_completeness_none */
/**
 * @summary DataQualitySyntax_namespace_completeness_none
 * @constant
 * @type {number}
 */
export
const DataQualitySyntax_namespace_completeness_none: DataQualitySyntax_namespace_completeness = DataQualitySyntax_namespace_completeness.none; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION DataQualitySyntax_namespace_completeness_none */

/* START_OF_SYMBOL_DEFINITION none */
/**
 * @summary none
 * @constant
 * @type {number}
 */
export
const none: DataQualitySyntax_namespace_completeness = DataQualitySyntax_namespace_completeness.none; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION none */

/* START_OF_SYMBOL_DEFINITION DataQualitySyntax_namespace_completeness_sample */
/**
 * @summary DataQualitySyntax_namespace_completeness_sample
 * @constant
 * @type {number}
 */
export
const DataQualitySyntax_namespace_completeness_sample: DataQualitySyntax_namespace_completeness = DataQualitySyntax_namespace_completeness.sample; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION DataQualitySyntax_namespace_completeness_sample */

/* START_OF_SYMBOL_DEFINITION sample */
/**
 * @summary sample
 * @constant
 * @type {number}
 */
export
const sample: DataQualitySyntax_namespace_completeness = DataQualitySyntax_namespace_completeness.sample; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION sample */

/* START_OF_SYMBOL_DEFINITION DataQualitySyntax_namespace_completeness_selected */
/**
 * @summary DataQualitySyntax_namespace_completeness_selected
 * @constant
 * @type {number}
 */
export
const DataQualitySyntax_namespace_completeness_selected: DataQualitySyntax_namespace_completeness = DataQualitySyntax_namespace_completeness.selected; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION DataQualitySyntax_namespace_completeness_selected */

/* START_OF_SYMBOL_DEFINITION selected */
/**
 * @summary selected
 * @constant
 * @type {number}
 */
export
const selected: DataQualitySyntax_namespace_completeness = DataQualitySyntax_namespace_completeness.selected; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION selected */

/* START_OF_SYMBOL_DEFINITION DataQualitySyntax_namespace_completeness_substantial */
/**
 * @summary DataQualitySyntax_namespace_completeness_substantial
 * @constant
 * @type {number}
 */
export
const DataQualitySyntax_namespace_completeness_substantial: DataQualitySyntax_namespace_completeness = DataQualitySyntax_namespace_completeness.substantial; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION DataQualitySyntax_namespace_completeness_substantial */

/* START_OF_SYMBOL_DEFINITION substantial */
/**
 * @summary substantial
 * @constant
 * @type {number}
 */
export
const substantial: DataQualitySyntax_namespace_completeness = DataQualitySyntax_namespace_completeness.substantial; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION substantial */

/* START_OF_SYMBOL_DEFINITION DataQualitySyntax_namespace_completeness_full */
/**
 * @summary DataQualitySyntax_namespace_completeness_full
 * @constant
 * @type {number}
 */
export
const DataQualitySyntax_namespace_completeness_full: DataQualitySyntax_namespace_completeness = DataQualitySyntax_namespace_completeness.full; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION DataQualitySyntax_namespace_completeness_full */

/* START_OF_SYMBOL_DEFINITION full */
/**
 * @summary full
 * @constant
 * @type {number}
 */
export
const full: DataQualitySyntax_namespace_completeness = DataQualitySyntax_namespace_completeness.full; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION full */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_DataQualitySyntax_namespace_completeness */
let _cached_decoder_for_DataQualitySyntax_namespace_completeness: $.ASN1Decoder<DataQualitySyntax_namespace_completeness> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_DataQualitySyntax_namespace_completeness */

/* START_OF_SYMBOL_DEFINITION _decode_DataQualitySyntax_namespace_completeness */
/**
 * @summary Decodes an ASN.1 element into a(n) DataQualitySyntax_namespace_completeness
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {DataQualitySyntax_namespace_completeness} The decoded data structure.
 */
export
function _decode_DataQualitySyntax_namespace_completeness (el: _Element) {
    if (!_cached_decoder_for_DataQualitySyntax_namespace_completeness) { _cached_decoder_for_DataQualitySyntax_namespace_completeness = $._decodeEnumerated; }
    return _cached_decoder_for_DataQualitySyntax_namespace_completeness(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_DataQualitySyntax_namespace_completeness */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_DataQualitySyntax_namespace_completeness */
let _cached_encoder_for_DataQualitySyntax_namespace_completeness: $.ASN1Encoder<DataQualitySyntax_namespace_completeness> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_DataQualitySyntax_namespace_completeness */

/* START_OF_SYMBOL_DEFINITION _encode_DataQualitySyntax_namespace_completeness */
/**
 * @summary Encodes a(n) DataQualitySyntax_namespace_completeness into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The DataQualitySyntax_namespace_completeness, encoded as an ASN.1 Element.
 */
export
function _encode_DataQualitySyntax_namespace_completeness (value: DataQualitySyntax_namespace_completeness, elGetter: $.ASN1Encoder<DataQualitySyntax_namespace_completeness>) {
    if (!_cached_encoder_for_DataQualitySyntax_namespace_completeness) { _cached_encoder_for_DataQualitySyntax_namespace_completeness = $._encodeEnumerated; }
    return _cached_encoder_for_DataQualitySyntax_namespace_completeness(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_DataQualitySyntax_namespace_completeness */

/* eslint-enable */
