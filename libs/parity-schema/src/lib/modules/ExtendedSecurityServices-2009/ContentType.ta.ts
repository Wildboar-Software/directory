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



/* START_OF_SYMBOL_DEFINITION ContentType */
/**
 * @summary ContentType
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * ContentType  ::=  OBJECT IDENTIFIER
 * ```
 */
export
type ContentType = OBJECT_IDENTIFIER; // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION ContentType */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ContentType */
let _cached_decoder_for_ContentType: $.ASN1Decoder<ContentType> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ContentType */

/* START_OF_SYMBOL_DEFINITION _decode_ContentType */
/**
 * @summary Decodes an ASN.1 element into a(n) ContentType
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ContentType} The decoded data structure.
 */
export
function _decode_ContentType (el: _Element) {
    if (!_cached_decoder_for_ContentType) { _cached_decoder_for_ContentType = $._decodeObjectIdentifier; }
    return _cached_decoder_for_ContentType(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ContentType */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ContentType */
let _cached_encoder_for_ContentType: $.ASN1Encoder<ContentType> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ContentType */

/* START_OF_SYMBOL_DEFINITION _encode_ContentType */
/**
 * @summary Encodes a(n) ContentType into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ContentType, encoded as an ASN.1 Element.
 */
export
function _encode_ContentType (value: ContentType, elGetter: $.ASN1Encoder<ContentType>) {
    if (!_cached_encoder_for_ContentType) { _cached_encoder_for_ContentType = $._encodeObjectIdentifier; }
    return _cached_encoder_for_ContentType(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ContentType */

/* eslint-enable */
