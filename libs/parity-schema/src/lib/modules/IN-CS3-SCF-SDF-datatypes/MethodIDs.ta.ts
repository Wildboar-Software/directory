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



/* START_OF_SYMBOL_DEFINITION MethodIDs */
/**
 * @summary MethodIDs
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * MethodIDs  ::=  OBJECT IDENTIFIER
 * ```
 */
export
type MethodIDs = OBJECT_IDENTIFIER; // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION MethodIDs */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_MethodIDs */
let _cached_decoder_for_MethodIDs: $.ASN1Decoder<MethodIDs> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_MethodIDs */

/* START_OF_SYMBOL_DEFINITION _decode_MethodIDs */
/**
 * @summary Decodes an ASN.1 element into a(n) MethodIDs
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {MethodIDs} The decoded data structure.
 */
export
function _decode_MethodIDs (el: _Element) {
    if (!_cached_decoder_for_MethodIDs) { _cached_decoder_for_MethodIDs = $._decodeObjectIdentifier; }
    return _cached_decoder_for_MethodIDs(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_MethodIDs */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_MethodIDs */
let _cached_encoder_for_MethodIDs: $.ASN1Encoder<MethodIDs> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_MethodIDs */

/* START_OF_SYMBOL_DEFINITION _encode_MethodIDs */
/**
 * @summary Encodes a(n) MethodIDs into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The MethodIDs, encoded as an ASN.1 Element.
 */
export
function _encode_MethodIDs (value: MethodIDs, elGetter: $.ASN1Encoder<MethodIDs>) {
    if (!_cached_encoder_for_MethodIDs) { _cached_encoder_for_MethodIDs = $._encodeObjectIdentifier; }
    return _cached_encoder_for_MethodIDs(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_MethodIDs */

/* eslint-enable */
