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



/* START_OF_SYMBOL_DEFINITION URI */
/**
 * @summary URI
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * URI  ::= 
 *   UTF8String
 *     (CONSTRAINED BY {
 *        -- shall be a valid URI as defined in IETF RFC 3986 --})
 * ```
 */
export
type URI = UTF8String; // UTF8String
/* END_OF_SYMBOL_DEFINITION URI */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_URI */
let _cached_decoder_for_URI: $.ASN1Decoder<URI> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_URI */

/* START_OF_SYMBOL_DEFINITION _decode_URI */
/**
 * @summary Decodes an ASN.1 element into a(n) URI
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {URI} The decoded data structure.
 */
export
function _decode_URI (el: _Element) {
    if (!_cached_decoder_for_URI) { _cached_decoder_for_URI = $._decodeUTF8String; }
    return _cached_decoder_for_URI(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_URI */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_URI */
let _cached_encoder_for_URI: $.ASN1Encoder<URI> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_URI */

/* START_OF_SYMBOL_DEFINITION _encode_URI */
/**
 * @summary Encodes a(n) URI into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The URI, encoded as an ASN.1 Element.
 */
export
function _encode_URI (value: URI, elGetter: $.ASN1Encoder<URI>) {
    if (!_cached_encoder_for_URI) { _cached_encoder_for_URI = $._encodeUTF8String; }
    return _cached_encoder_for_URI(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_URI */

/* eslint-enable */
