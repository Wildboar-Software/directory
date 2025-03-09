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



/* START_OF_SYMBOL_DEFINITION Authenticator */
/**
 * @summary Authenticator
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * Authenticator  ::=  UTF8String
 * ```
 */
export
type Authenticator = UTF8String; // UTF8String
/* END_OF_SYMBOL_DEFINITION Authenticator */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Authenticator */
let _cached_decoder_for_Authenticator: $.ASN1Decoder<Authenticator> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Authenticator */

/* START_OF_SYMBOL_DEFINITION _decode_Authenticator */
/**
 * @summary Decodes an ASN.1 element into a(n) Authenticator
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Authenticator} The decoded data structure.
 */
export
function _decode_Authenticator (el: _Element) {
    if (!_cached_decoder_for_Authenticator) { _cached_decoder_for_Authenticator = $._decodeUTF8String; }
    return _cached_decoder_for_Authenticator(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Authenticator */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Authenticator */
let _cached_encoder_for_Authenticator: $.ASN1Encoder<Authenticator> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Authenticator */

/* START_OF_SYMBOL_DEFINITION _encode_Authenticator */
/**
 * @summary Encodes a(n) Authenticator into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Authenticator, encoded as an ASN.1 Element.
 */
export
function _encode_Authenticator (value: Authenticator, elGetter: $.ASN1Encoder<Authenticator>) {
    if (!_cached_encoder_for_Authenticator) { _cached_encoder_for_Authenticator = $._encodeUTF8String; }
    return _cached_encoder_for_Authenticator(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Authenticator */

/* eslint-enable */
