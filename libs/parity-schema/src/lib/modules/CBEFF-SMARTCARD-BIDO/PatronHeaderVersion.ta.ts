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



/* START_OF_SYMBOL_DEFINITION PatronHeaderVersion */
/**
 * @summary PatronHeaderVersion
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * PatronHeaderVersion  ::=  OCTET STRING(SIZE (2))
 * ```
 */
export
type PatronHeaderVersion = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION PatronHeaderVersion */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PatronHeaderVersion */
let _cached_decoder_for_PatronHeaderVersion: $.ASN1Decoder<PatronHeaderVersion> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PatronHeaderVersion */

/* START_OF_SYMBOL_DEFINITION _decode_PatronHeaderVersion */
/**
 * @summary Decodes an ASN.1 element into a(n) PatronHeaderVersion
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PatronHeaderVersion} The decoded data structure.
 */
export
function _decode_PatronHeaderVersion (el: _Element) {
    if (!_cached_decoder_for_PatronHeaderVersion) { _cached_decoder_for_PatronHeaderVersion = $._decodeOctetString; }
    return _cached_decoder_for_PatronHeaderVersion(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PatronHeaderVersion */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PatronHeaderVersion */
let _cached_encoder_for_PatronHeaderVersion: $.ASN1Encoder<PatronHeaderVersion> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PatronHeaderVersion */

/* START_OF_SYMBOL_DEFINITION _encode_PatronHeaderVersion */
/**
 * @summary Encodes a(n) PatronHeaderVersion into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PatronHeaderVersion, encoded as an ASN.1 Element.
 */
export
function _encode_PatronHeaderVersion (value: PatronHeaderVersion, elGetter: $.ASN1Encoder<PatronHeaderVersion>) {
    if (!_cached_encoder_for_PatronHeaderVersion) { _cached_encoder_for_PatronHeaderVersion = $._encodeOctetString; }
    return _cached_encoder_for_PatronHeaderVersion(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_PatronHeaderVersion */

/* eslint-enable */
