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



/* START_OF_SYMBOL_DEFINITION Uint8 */
/**
 * @summary Uint8
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * Uint8   ::=  INTEGER (0..maxUint8)
 * ```
 */
export
type Uint8 = INTEGER;
/* END_OF_SYMBOL_DEFINITION Uint8 */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Uint8 */
let _cached_decoder_for_Uint8: $.ASN1Decoder<Uint8> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Uint8 */

/* START_OF_SYMBOL_DEFINITION _decode_Uint8 */
/**
 * @summary Decodes an ASN.1 element into a(n) Uint8
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Uint8} The decoded data structure.
 */
export
function _decode_Uint8 (el: _Element) {
    if (!_cached_decoder_for_Uint8) { _cached_decoder_for_Uint8 = $._decodeInteger; }
    return _cached_decoder_for_Uint8(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Uint8 */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Uint8 */
let _cached_encoder_for_Uint8: $.ASN1Encoder<Uint8> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Uint8 */

/* START_OF_SYMBOL_DEFINITION _encode_Uint8 */
/**
 * @summary Encodes a(n) Uint8 into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Uint8, encoded as an ASN.1 Element.
 */
export
function _encode_Uint8 (value: Uint8, elGetter: $.ASN1Encoder<Uint8>) {
    if (!_cached_encoder_for_Uint8) { _cached_encoder_for_Uint8 = $._encodeInteger; }
    return _cached_encoder_for_Uint8(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Uint8 */

/* eslint-enable */
