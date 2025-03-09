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



/* START_OF_SYMBOL_DEFINITION FWReceiptVersion */
/**
 * @summary FWReceiptVersion
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * FWReceiptVersion  ::=  INTEGER { v1(1) }
 * ```
 */
export
type FWReceiptVersion = INTEGER;
/* END_OF_SYMBOL_DEFINITION FWReceiptVersion */

/* START_OF_SYMBOL_DEFINITION FWReceiptVersion_v1 */
/**
 * @summary FWReceiptVersion_v1
 * @constant
 * @type {number}
 */
export
const FWReceiptVersion_v1: FWReceiptVersion = 1; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION FWReceiptVersion_v1 */

/* START_OF_SYMBOL_DEFINITION v1 */
/**
 * @summary FWReceiptVersion_v1
 * @constant
 * @type {number}
 */
export
const v1: FWReceiptVersion = FWReceiptVersion_v1; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION v1 */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_FWReceiptVersion */
let _cached_decoder_for_FWReceiptVersion: $.ASN1Decoder<FWReceiptVersion> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_FWReceiptVersion */

/* START_OF_SYMBOL_DEFINITION _decode_FWReceiptVersion */
/**
 * @summary Decodes an ASN.1 element into a(n) FWReceiptVersion
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {FWReceiptVersion} The decoded data structure.
 */
export
function _decode_FWReceiptVersion (el: _Element) {
    if (!_cached_decoder_for_FWReceiptVersion) { _cached_decoder_for_FWReceiptVersion = $._decodeInteger; }
    return _cached_decoder_for_FWReceiptVersion(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_FWReceiptVersion */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_FWReceiptVersion */
let _cached_encoder_for_FWReceiptVersion: $.ASN1Encoder<FWReceiptVersion> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_FWReceiptVersion */

/* START_OF_SYMBOL_DEFINITION _encode_FWReceiptVersion */
/**
 * @summary Encodes a(n) FWReceiptVersion into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The FWReceiptVersion, encoded as an ASN.1 Element.
 */
export
function _encode_FWReceiptVersion (value: FWReceiptVersion, elGetter: $.ASN1Encoder<FWReceiptVersion>) {
    if (!_cached_encoder_for_FWReceiptVersion) { _cached_encoder_for_FWReceiptVersion = $._encodeInteger; }
    return _cached_encoder_for_FWReceiptVersion(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_FWReceiptVersion */

/* eslint-enable */
