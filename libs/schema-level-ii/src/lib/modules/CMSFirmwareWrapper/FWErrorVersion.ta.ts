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
