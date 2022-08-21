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



/* START_OF_SYMBOL_DEFINITION UTF8Pairs */
/**
 * @summary UTF8Pairs
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * UTF8Pairs  ::=  UTF8String
 * ```
 */
export
type UTF8Pairs = UTF8String; // UTF8String
/* END_OF_SYMBOL_DEFINITION UTF8Pairs */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_UTF8Pairs */
let _cached_decoder_for_UTF8Pairs: $.ASN1Decoder<UTF8Pairs> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_UTF8Pairs */

/* START_OF_SYMBOL_DEFINITION _decode_UTF8Pairs */
/**
 * @summary Decodes an ASN.1 element into a(n) UTF8Pairs
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {UTF8Pairs} The decoded data structure.
 */
export
function _decode_UTF8Pairs (el: _Element) {
    if (!_cached_decoder_for_UTF8Pairs) { _cached_decoder_for_UTF8Pairs = $._decodeUTF8String; }
    return _cached_decoder_for_UTF8Pairs(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_UTF8Pairs */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_UTF8Pairs */
let _cached_encoder_for_UTF8Pairs: $.ASN1Encoder<UTF8Pairs> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_UTF8Pairs */

/* START_OF_SYMBOL_DEFINITION _encode_UTF8Pairs */
/**
 * @summary Encodes a(n) UTF8Pairs into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The UTF8Pairs, encoded as an ASN.1 Element.
 */
export
function _encode_UTF8Pairs (value: UTF8Pairs, elGetter: $.ASN1Encoder<UTF8Pairs>) {
    if (!_cached_encoder_for_UTF8Pairs) { _cached_encoder_for_UTF8Pairs = $._encodeUTF8String; }
    return _cached_encoder_for_UTF8Pairs(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_UTF8Pairs */

/* eslint-enable */
