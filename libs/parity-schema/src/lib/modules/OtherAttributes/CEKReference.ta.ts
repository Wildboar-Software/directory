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



/* START_OF_SYMBOL_DEFINITION CEKReference */
/**
 * @summary CEKReference
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * CEKReference  ::=  OCTET STRING
 * ```
 */
export
type CEKReference = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION CEKReference */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_CEKReference */
let _cached_decoder_for_CEKReference: $.ASN1Decoder<CEKReference> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_CEKReference */

/* START_OF_SYMBOL_DEFINITION _decode_CEKReference */
/**
 * @summary Decodes an ASN.1 element into a(n) CEKReference
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {CEKReference} The decoded data structure.
 */
export
function _decode_CEKReference (el: _Element) {
    if (!_cached_decoder_for_CEKReference) { _cached_decoder_for_CEKReference = $._decodeOctetString; }
    return _cached_decoder_for_CEKReference(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_CEKReference */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_CEKReference */
let _cached_encoder_for_CEKReference: $.ASN1Encoder<CEKReference> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_CEKReference */

/* START_OF_SYMBOL_DEFINITION _encode_CEKReference */
/**
 * @summary Encodes a(n) CEKReference into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The CEKReference, encoded as an ASN.1 Element.
 */
export
function _encode_CEKReference (value: CEKReference, elGetter: $.ASN1Encoder<CEKReference>) {
    if (!_cached_encoder_for_CEKReference) { _cached_encoder_for_CEKReference = $._encodeOctetString; }
    return _cached_encoder_for_CEKReference(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_CEKReference */

/* eslint-enable */
