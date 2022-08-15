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



/* START_OF_SYMBOL_DEFINITION Uint16 */
/**
 * @summary Uint16
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * Uint16  ::=  INTEGER (0..maxUint16)
 * ```
 */
export
type Uint16 = INTEGER;
/* END_OF_SYMBOL_DEFINITION Uint16 */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Uint16 */
let _cached_decoder_for_Uint16: $.ASN1Decoder<Uint16> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Uint16 */

/* START_OF_SYMBOL_DEFINITION _decode_Uint16 */
/**
 * @summary Decodes an ASN.1 element into a(n) Uint16
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Uint16} The decoded data structure.
 */
export
function _decode_Uint16 (el: _Element) {
    if (!_cached_decoder_for_Uint16) { _cached_decoder_for_Uint16 = $._decodeInteger; }
    return _cached_decoder_for_Uint16(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Uint16 */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Uint16 */
let _cached_encoder_for_Uint16: $.ASN1Encoder<Uint16> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Uint16 */

/* START_OF_SYMBOL_DEFINITION _encode_Uint16 */
/**
 * @summary Encodes a(n) Uint16 into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Uint16, encoded as an ASN.1 Element.
 */
export
function _encode_Uint16 (value: Uint16, elGetter: $.ASN1Encoder<Uint16>) {
    if (!_cached_encoder_for_Uint16) { _cached_encoder_for_Uint16 = $._encodeInteger; }
    return _cached_encoder_for_Uint16(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Uint16 */

/* eslint-enable */
