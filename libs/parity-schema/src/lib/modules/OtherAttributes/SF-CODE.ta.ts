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



/* START_OF_SYMBOL_DEFINITION SF_CODE */
/**
 * @summary SF_CODE
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * SF-CODE  ::=  OBJECT IDENTIFIER
 * ```
 */
export
type SF_CODE = OBJECT_IDENTIFIER; // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION SF_CODE */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SF_CODE */
let _cached_decoder_for_SF_CODE: $.ASN1Decoder<SF_CODE> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SF_CODE */

/* START_OF_SYMBOL_DEFINITION _decode_SF_CODE */
/**
 * @summary Decodes an ASN.1 element into a(n) SF_CODE
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SF_CODE} The decoded data structure.
 */
export
function _decode_SF_CODE (el: _Element) {
    if (!_cached_decoder_for_SF_CODE) { _cached_decoder_for_SF_CODE = $._decodeObjectIdentifier; }
    return _cached_decoder_for_SF_CODE(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SF_CODE */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SF_CODE */
let _cached_encoder_for_SF_CODE: $.ASN1Encoder<SF_CODE> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SF_CODE */

/* START_OF_SYMBOL_DEFINITION _encode_SF_CODE */
/**
 * @summary Encodes a(n) SF_CODE into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SF_CODE, encoded as an ASN.1 Element.
 */
export
function _encode_SF_CODE (value: SF_CODE, elGetter: $.ASN1Encoder<SF_CODE>) {
    if (!_cached_encoder_for_SF_CODE) { _cached_encoder_for_SF_CODE = $._encodeObjectIdentifier; }
    return _cached_encoder_for_SF_CODE(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SF_CODE */

/* eslint-enable */
