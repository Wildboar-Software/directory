/* eslint-disable */
import {
    ASN1Element as _Element
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";


/* START_OF_SYMBOL_DEFINITION _enum_for_AttributeQuality_maintenance_level */
/**
 * @summary AttributeQuality_maintenance_level
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * AttributeQuality-maintenance-level ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
 * ```@enum {number}
 */
export
enum _enum_for_AttributeQuality_maintenance_level {
    unknown = 1,
    external = 2,
    system_maintained = 3,
    user_supplied = 4,
}
/* END_OF_SYMBOL_DEFINITION _enum_for_AttributeQuality_maintenance_level */

/* START_OF_SYMBOL_DEFINITION AttributeQuality_maintenance_level */
/**
 * @summary AttributeQuality_maintenance_level
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * AttributeQuality-maintenance-level ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
 * ```@enum {number}
 */
export
type AttributeQuality_maintenance_level = _enum_for_AttributeQuality_maintenance_level;
/* END_OF_SYMBOL_DEFINITION AttributeQuality_maintenance_level */

/* START_OF_SYMBOL_DEFINITION AttributeQuality_maintenance_level */
/**
 * @summary AttributeQuality_maintenance_level
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * AttributeQuality-maintenance-level ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
 * ```@enum {number}
 */
export
const AttributeQuality_maintenance_level = _enum_for_AttributeQuality_maintenance_level;
/* END_OF_SYMBOL_DEFINITION AttributeQuality_maintenance_level */

/* START_OF_SYMBOL_DEFINITION AttributeQuality_maintenance_level_unknown */
/**
 * @summary AttributeQuality_maintenance_level_unknown
 * @constant
 * @type {number}
 */
export
const AttributeQuality_maintenance_level_unknown: AttributeQuality_maintenance_level = AttributeQuality_maintenance_level.unknown; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION AttributeQuality_maintenance_level_unknown */

/* START_OF_SYMBOL_DEFINITION unknown */
/**
 * @summary unknown
 * @constant
 * @type {number}
 */
export
const unknown: AttributeQuality_maintenance_level = AttributeQuality_maintenance_level.unknown; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION unknown */

/* START_OF_SYMBOL_DEFINITION AttributeQuality_maintenance_level_external */
/**
 * @summary AttributeQuality_maintenance_level_external
 * @constant
 * @type {number}
 */
export
const AttributeQuality_maintenance_level_external: AttributeQuality_maintenance_level = AttributeQuality_maintenance_level.external; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION AttributeQuality_maintenance_level_external */

/* START_OF_SYMBOL_DEFINITION external */
/**
 * @summary external
 * @constant
 * @type {number}
 */
export
const external: AttributeQuality_maintenance_level = AttributeQuality_maintenance_level.external; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION external */

/* START_OF_SYMBOL_DEFINITION AttributeQuality_maintenance_level_system_maintained */
/**
 * @summary AttributeQuality_maintenance_level_system_maintained
 * @constant
 * @type {number}
 */
export
const AttributeQuality_maintenance_level_system_maintained: AttributeQuality_maintenance_level = AttributeQuality_maintenance_level.system_maintained; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION AttributeQuality_maintenance_level_system_maintained */

/* START_OF_SYMBOL_DEFINITION system_maintained */
/**
 * @summary system_maintained
 * @constant
 * @type {number}
 */
export
const system_maintained: AttributeQuality_maintenance_level = AttributeQuality_maintenance_level.system_maintained; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION system_maintained */

/* START_OF_SYMBOL_DEFINITION AttributeQuality_maintenance_level_user_supplied */
/**
 * @summary AttributeQuality_maintenance_level_user_supplied
 * @constant
 * @type {number}
 */
export
const AttributeQuality_maintenance_level_user_supplied: AttributeQuality_maintenance_level = AttributeQuality_maintenance_level.user_supplied; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION AttributeQuality_maintenance_level_user_supplied */

/* START_OF_SYMBOL_DEFINITION user_supplied */
/**
 * @summary user_supplied
 * @constant
 * @type {number}
 */
export
const user_supplied: AttributeQuality_maintenance_level = AttributeQuality_maintenance_level.user_supplied; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION user_supplied */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_AttributeQuality_maintenance_level */
let _cached_decoder_for_AttributeQuality_maintenance_level: $.ASN1Decoder<AttributeQuality_maintenance_level> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_AttributeQuality_maintenance_level */

/* START_OF_SYMBOL_DEFINITION _decode_AttributeQuality_maintenance_level */
/**
 * @summary Decodes an ASN.1 element into a(n) AttributeQuality_maintenance_level
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {AttributeQuality_maintenance_level} The decoded data structure.
 */
export
function _decode_AttributeQuality_maintenance_level (el: _Element) {
    if (!_cached_decoder_for_AttributeQuality_maintenance_level) { _cached_decoder_for_AttributeQuality_maintenance_level = $._decodeEnumerated; }
    return _cached_decoder_for_AttributeQuality_maintenance_level(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_AttributeQuality_maintenance_level */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_AttributeQuality_maintenance_level */
let _cached_encoder_for_AttributeQuality_maintenance_level: $.ASN1Encoder<AttributeQuality_maintenance_level> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_AttributeQuality_maintenance_level */

/* START_OF_SYMBOL_DEFINITION _encode_AttributeQuality_maintenance_level */
/**
 * @summary Encodes a(n) AttributeQuality_maintenance_level into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The AttributeQuality_maintenance_level, encoded as an ASN.1 Element.
 */
export
function _encode_AttributeQuality_maintenance_level (value: AttributeQuality_maintenance_level, elGetter: $.ASN1Encoder<AttributeQuality_maintenance_level>) {
    if (!_cached_encoder_for_AttributeQuality_maintenance_level) { _cached_encoder_for_AttributeQuality_maintenance_level = $._encodeEnumerated; }
    return _cached_encoder_for_AttributeQuality_maintenance_level(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_AttributeQuality_maintenance_level */

/* eslint-enable */
