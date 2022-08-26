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



/* START_OF_SYMBOL_DEFINITION NPartsMessage */
/**
 * @summary NPartsMessage
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * NPartsMessage  ::=  SEQUENCE SIZE (2..MAX) OF BIT STRING
 * ```
 */
export
type NPartsMessage = BIT_STRING[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION NPartsMessage */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_NPartsMessage */
let _cached_decoder_for_NPartsMessage: $.ASN1Decoder<NPartsMessage> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_NPartsMessage */

/* START_OF_SYMBOL_DEFINITION _decode_NPartsMessage */
/**
 * @summary Decodes an ASN.1 element into a(n) NPartsMessage
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {NPartsMessage} The decoded data structure.
 */
export
function _decode_NPartsMessage (el: _Element) {
    if (!_cached_decoder_for_NPartsMessage) { _cached_decoder_for_NPartsMessage = $._decodeSequenceOf<BIT_STRING>(() => $._decodeBitString); }
    return _cached_decoder_for_NPartsMessage(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_NPartsMessage */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_NPartsMessage */
let _cached_encoder_for_NPartsMessage: $.ASN1Encoder<NPartsMessage> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_NPartsMessage */

/* START_OF_SYMBOL_DEFINITION _encode_NPartsMessage */
/**
 * @summary Encodes a(n) NPartsMessage into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The NPartsMessage, encoded as an ASN.1 Element.
 */
export
function _encode_NPartsMessage (value: NPartsMessage, elGetter: $.ASN1Encoder<NPartsMessage>) {
    if (!_cached_encoder_for_NPartsMessage) { _cached_encoder_for_NPartsMessage = $._encodeSequenceOf<BIT_STRING>(() => $._encodeBitString, $.BER); }
    return _cached_encoder_for_NPartsMessage(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_NPartsMessage */

/* eslint-enable */
