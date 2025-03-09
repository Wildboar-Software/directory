/* eslint-disable */
import {
    itu_t,
    itu_r,
    ccitt,
    iso,
    joint_iso_itu_t,
    joint_iso_ccitt,
    OPTIONAL,
    BOOLEAN,
    INTEGER,
    BIT_STRING,
    OCTET_STRING,
    NULL,
    OBJECT_IDENTIFIER,
    ObjectDescriptor,
    EXTERNAL,
    REAL,
    INSTANCE_OF,
    ENUMERATED,
    EMBEDDED_PDV,
    UTF8String,
    RELATIVE_OID,
    SEQUENCE,
    SEQUENCE_OF,
    SET,
    SET_OF,
    GraphicString,
    NumericString,
    VisibleString,
    PrintableString,
    ISO646String,
    TeletexString,
    GeneralString,
    T61String,
    UniversalString,
    VideotexString,
    BMPString,
    IA5String,
    CharacterString,
    UTCTime,
    GeneralizedTime,
    TIME,
    DATE,
    TIME_OF_DAY,
    DATE_TIME,
    DURATION,
    OID_IRI,
    RELATIVE_OID_IRI,
    TRUE,
    FALSE,
    TRUE_BIT,
    FALSE_BIT,
    PLUS_INFINITY,
    MINUS_INFINITY,
    NOT_A_NUMBER,
    TYPE_IDENTIFIER,
    ABSTRACT_SYNTAX,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    ASN1Construction as _Construction,
    ASN1UniversalType as _UniversalType,
    ObjectIdentifier as _OID,
    External as _External,
    EmbeddedPDV as _PDV,
    ASN1ConstructionError as _ConstructionError,
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";



/* START_OF_SYMBOL_DEFINITION _enum_for_DSAQualitySyntax_serviceQuality */
/**
 * @summary DSAQualitySyntax_serviceQuality
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * DSAQualitySyntax-serviceQuality ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
 * ```@enum {number}
 */
export
enum _enum_for_DSAQualitySyntax_serviceQuality {
    defunct = 0,
    experimental = 1,
    best_effort = 2,
    pilot_service = 3,
    full_service = 4,
}
/* END_OF_SYMBOL_DEFINITION _enum_for_DSAQualitySyntax_serviceQuality */

/* START_OF_SYMBOL_DEFINITION DSAQualitySyntax_serviceQuality */
/**
 * @summary DSAQualitySyntax_serviceQuality
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * DSAQualitySyntax-serviceQuality ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
 * ```@enum {number}
 */
export
type DSAQualitySyntax_serviceQuality = _enum_for_DSAQualitySyntax_serviceQuality;
/* END_OF_SYMBOL_DEFINITION DSAQualitySyntax_serviceQuality */

/* START_OF_SYMBOL_DEFINITION DSAQualitySyntax_serviceQuality */
/**
 * @summary DSAQualitySyntax_serviceQuality
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * DSAQualitySyntax-serviceQuality ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
 * ```@enum {number}
 */
export
const DSAQualitySyntax_serviceQuality = _enum_for_DSAQualitySyntax_serviceQuality;
/* END_OF_SYMBOL_DEFINITION DSAQualitySyntax_serviceQuality */

/* START_OF_SYMBOL_DEFINITION DSAQualitySyntax_serviceQuality_defunct */
/**
 * @summary DSAQualitySyntax_serviceQuality_defunct
 * @constant
 * @type {number}
 */
export
const DSAQualitySyntax_serviceQuality_defunct: DSAQualitySyntax_serviceQuality = DSAQualitySyntax_serviceQuality.defunct; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION DSAQualitySyntax_serviceQuality_defunct */

/* START_OF_SYMBOL_DEFINITION defunct */
/**
 * @summary defunct
 * @constant
 * @type {number}
 */
export
const defunct: DSAQualitySyntax_serviceQuality = DSAQualitySyntax_serviceQuality.defunct; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION defunct */

/* START_OF_SYMBOL_DEFINITION DSAQualitySyntax_serviceQuality_experimental */
/**
 * @summary DSAQualitySyntax_serviceQuality_experimental
 * @constant
 * @type {number}
 */
export
const DSAQualitySyntax_serviceQuality_experimental: DSAQualitySyntax_serviceQuality = DSAQualitySyntax_serviceQuality.experimental; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION DSAQualitySyntax_serviceQuality_experimental */

/* START_OF_SYMBOL_DEFINITION experimental */
/**
 * @summary experimental
 * @constant
 * @type {number}
 */
export
const experimental: DSAQualitySyntax_serviceQuality = DSAQualitySyntax_serviceQuality.experimental; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION experimental */

/* START_OF_SYMBOL_DEFINITION DSAQualitySyntax_serviceQuality_best_effort */
/**
 * @summary DSAQualitySyntax_serviceQuality_best_effort
 * @constant
 * @type {number}
 */
export
const DSAQualitySyntax_serviceQuality_best_effort: DSAQualitySyntax_serviceQuality = DSAQualitySyntax_serviceQuality.best_effort; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION DSAQualitySyntax_serviceQuality_best_effort */

/* START_OF_SYMBOL_DEFINITION best_effort */
/**
 * @summary best_effort
 * @constant
 * @type {number}
 */
export
const best_effort: DSAQualitySyntax_serviceQuality = DSAQualitySyntax_serviceQuality.best_effort; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION best_effort */

/* START_OF_SYMBOL_DEFINITION DSAQualitySyntax_serviceQuality_pilot_service */
/**
 * @summary DSAQualitySyntax_serviceQuality_pilot_service
 * @constant
 * @type {number}
 */
export
const DSAQualitySyntax_serviceQuality_pilot_service: DSAQualitySyntax_serviceQuality = DSAQualitySyntax_serviceQuality.pilot_service; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION DSAQualitySyntax_serviceQuality_pilot_service */

/* START_OF_SYMBOL_DEFINITION pilot_service */
/**
 * @summary pilot_service
 * @constant
 * @type {number}
 */
export
const pilot_service: DSAQualitySyntax_serviceQuality = DSAQualitySyntax_serviceQuality.pilot_service; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION pilot_service */

/* START_OF_SYMBOL_DEFINITION DSAQualitySyntax_serviceQuality_full_service */
/**
 * @summary DSAQualitySyntax_serviceQuality_full_service
 * @constant
 * @type {number}
 */
export
const DSAQualitySyntax_serviceQuality_full_service: DSAQualitySyntax_serviceQuality = DSAQualitySyntax_serviceQuality.full_service; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION DSAQualitySyntax_serviceQuality_full_service */

/* START_OF_SYMBOL_DEFINITION full_service */
/**
 * @summary full_service
 * @constant
 * @type {number}
 */
export
const full_service: DSAQualitySyntax_serviceQuality = DSAQualitySyntax_serviceQuality.full_service; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION full_service */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_DSAQualitySyntax_serviceQuality */
let _cached_decoder_for_DSAQualitySyntax_serviceQuality: $.ASN1Decoder<DSAQualitySyntax_serviceQuality> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_DSAQualitySyntax_serviceQuality */

/* START_OF_SYMBOL_DEFINITION _decode_DSAQualitySyntax_serviceQuality */
/**
 * @summary Decodes an ASN.1 element into a(n) DSAQualitySyntax_serviceQuality
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {DSAQualitySyntax_serviceQuality} The decoded data structure.
 */
export
function _decode_DSAQualitySyntax_serviceQuality (el: _Element) {
    if (!_cached_decoder_for_DSAQualitySyntax_serviceQuality) { _cached_decoder_for_DSAQualitySyntax_serviceQuality = $._decodeEnumerated; }
    return _cached_decoder_for_DSAQualitySyntax_serviceQuality(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_DSAQualitySyntax_serviceQuality */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_DSAQualitySyntax_serviceQuality */
let _cached_encoder_for_DSAQualitySyntax_serviceQuality: $.ASN1Encoder<DSAQualitySyntax_serviceQuality> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_DSAQualitySyntax_serviceQuality */

/* START_OF_SYMBOL_DEFINITION _encode_DSAQualitySyntax_serviceQuality */
/**
 * @summary Encodes a(n) DSAQualitySyntax_serviceQuality into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The DSAQualitySyntax_serviceQuality, encoded as an ASN.1 Element.
 */
export
function _encode_DSAQualitySyntax_serviceQuality (value: DSAQualitySyntax_serviceQuality, elGetter: $.ASN1Encoder<DSAQualitySyntax_serviceQuality>) {
    if (!_cached_encoder_for_DSAQualitySyntax_serviceQuality) { _cached_encoder_for_DSAQualitySyntax_serviceQuality = $._encodeEnumerated; }
    return _cached_encoder_for_DSAQualitySyntax_serviceQuality(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_DSAQualitySyntax_serviceQuality */

/* eslint-enable */
