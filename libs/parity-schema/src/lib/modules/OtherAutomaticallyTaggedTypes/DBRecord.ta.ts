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



/* START_OF_SYMBOL_DEFINITION DBRecord */
/**
 * @summary DBRecord
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * DBRecord  ::=  UTF8String
 * ```
 */
export
type DBRecord = UTF8String; // UTF8String
/* END_OF_SYMBOL_DEFINITION DBRecord */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_DBRecord */
let _cached_decoder_for_DBRecord: $.ASN1Decoder<DBRecord> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_DBRecord */

/* START_OF_SYMBOL_DEFINITION _decode_DBRecord */
/**
 * @summary Decodes an ASN.1 element into a(n) DBRecord
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {DBRecord} The decoded data structure.
 */
export
function _decode_DBRecord (el: _Element) {
    if (!_cached_decoder_for_DBRecord) { _cached_decoder_for_DBRecord = $._decodeUTF8String; }
    return _cached_decoder_for_DBRecord(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_DBRecord */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_DBRecord */
let _cached_encoder_for_DBRecord: $.ASN1Encoder<DBRecord> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_DBRecord */

/* START_OF_SYMBOL_DEFINITION _encode_DBRecord */
/**
 * @summary Encodes a(n) DBRecord into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The DBRecord, encoded as an ASN.1 Element.
 */
export
function _encode_DBRecord (value: DBRecord, elGetter: $.ASN1Encoder<DBRecord>) {
    if (!_cached_encoder_for_DBRecord) { _cached_encoder_for_DBRecord = $._encodeUTF8String; }
    return _cached_encoder_for_DBRecord(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_DBRecord */

/* eslint-enable */
