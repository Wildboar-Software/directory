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



/* START_OF_SYMBOL_DEFINITION InterfaceTypeName */
/**
 * @summary InterfaceTypeName
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * InterfaceTypeName  ::=  OBJECT IDENTIFIER
 * ```
 */
export
type InterfaceTypeName = OBJECT_IDENTIFIER; // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION InterfaceTypeName */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_InterfaceTypeName */
let _cached_decoder_for_InterfaceTypeName: $.ASN1Decoder<InterfaceTypeName> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_InterfaceTypeName */

/* START_OF_SYMBOL_DEFINITION _decode_InterfaceTypeName */
/**
 * @summary Decodes an ASN.1 element into a(n) InterfaceTypeName
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {InterfaceTypeName} The decoded data structure.
 */
export
function _decode_InterfaceTypeName (el: _Element) {
    if (!_cached_decoder_for_InterfaceTypeName) { _cached_decoder_for_InterfaceTypeName = $._decodeObjectIdentifier; }
    return _cached_decoder_for_InterfaceTypeName(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_InterfaceTypeName */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_InterfaceTypeName */
let _cached_encoder_for_InterfaceTypeName: $.ASN1Encoder<InterfaceTypeName> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_InterfaceTypeName */

/* START_OF_SYMBOL_DEFINITION _encode_InterfaceTypeName */
/**
 * @summary Encodes a(n) InterfaceTypeName into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The InterfaceTypeName, encoded as an ASN.1 Element.
 */
export
function _encode_InterfaceTypeName (value: InterfaceTypeName, elGetter: $.ASN1Encoder<InterfaceTypeName>) {
    if (!_cached_encoder_for_InterfaceTypeName) { _cached_encoder_for_InterfaceTypeName = $._encodeObjectIdentifier; }
    return _cached_encoder_for_InterfaceTypeName(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_InterfaceTypeName */

/* eslint-enable */
