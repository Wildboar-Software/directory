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



/* START_OF_SYMBOL_DEFINITION RegToken */
/**
 * @summary RegToken
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * RegToken  ::=  UTF8String
 * ```
 */
export
type RegToken = UTF8String; // UTF8String
/* END_OF_SYMBOL_DEFINITION RegToken */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_RegToken */
let _cached_decoder_for_RegToken: $.ASN1Decoder<RegToken> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_RegToken */

/* START_OF_SYMBOL_DEFINITION _decode_RegToken */
/**
 * @summary Decodes an ASN.1 element into a(n) RegToken
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {RegToken} The decoded data structure.
 */
export
function _decode_RegToken (el: _Element) {
    if (!_cached_decoder_for_RegToken) { _cached_decoder_for_RegToken = $._decodeUTF8String; }
    return _cached_decoder_for_RegToken(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_RegToken */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_RegToken */
let _cached_encoder_for_RegToken: $.ASN1Encoder<RegToken> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_RegToken */

/* START_OF_SYMBOL_DEFINITION _encode_RegToken */
/**
 * @summary Encodes a(n) RegToken into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The RegToken, encoded as an ASN.1 Element.
 */
export
function _encode_RegToken (value: RegToken, elGetter: $.ASN1Encoder<RegToken>) {
    if (!_cached_encoder_for_RegToken) { _cached_encoder_for_RegToken = $._encodeUTF8String; }
    return _cached_encoder_for_RegToken(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_RegToken */

/* eslint-enable */
