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



/* START_OF_SYMBOL_DEFINITION DecryptKeyIdentifier */
/**
 * @summary DecryptKeyIdentifier
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * DecryptKeyIdentifier  ::=  OCTET STRING
 * ```
 */
export
type DecryptKeyIdentifier = OCTET_STRING; // OctetStringType
/* END_OF_SYMBOL_DEFINITION DecryptKeyIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_DecryptKeyIdentifier */
let _cached_decoder_for_DecryptKeyIdentifier: $.ASN1Decoder<DecryptKeyIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_DecryptKeyIdentifier */

/* START_OF_SYMBOL_DEFINITION _decode_DecryptKeyIdentifier */
/**
 * @summary Decodes an ASN.1 element into a(n) DecryptKeyIdentifier
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {DecryptKeyIdentifier} The decoded data structure.
 */
export
function _decode_DecryptKeyIdentifier (el: _Element) {
    if (!_cached_decoder_for_DecryptKeyIdentifier) { _cached_decoder_for_DecryptKeyIdentifier = $._decodeOctetString; }
    return _cached_decoder_for_DecryptKeyIdentifier(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_DecryptKeyIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_DecryptKeyIdentifier */
let _cached_encoder_for_DecryptKeyIdentifier: $.ASN1Encoder<DecryptKeyIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_DecryptKeyIdentifier */

/* START_OF_SYMBOL_DEFINITION _encode_DecryptKeyIdentifier */
/**
 * @summary Encodes a(n) DecryptKeyIdentifier into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The DecryptKeyIdentifier, encoded as an ASN.1 Element.
 */
export
function _encode_DecryptKeyIdentifier (value: DecryptKeyIdentifier, elGetter: $.ASN1Encoder<DecryptKeyIdentifier>) {
    if (!_cached_encoder_for_DecryptKeyIdentifier) { _cached_encoder_for_DecryptKeyIdentifier = $._encodeOctetString; }
    return _cached_encoder_for_DecryptKeyIdentifier(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_DecryptKeyIdentifier */

/* eslint-enable */
