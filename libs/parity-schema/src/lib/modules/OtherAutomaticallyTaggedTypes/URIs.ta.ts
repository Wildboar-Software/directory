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
import { URI, _decode_URI, _encode_URI } from "../OtherAutomaticallyTaggedTypes/URI.ta";
export { URI, _decode_URI, _encode_URI } from "../OtherAutomaticallyTaggedTypes/URI.ta";


/* START_OF_SYMBOL_DEFINITION URIs */
/**
 * @summary URIs
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * URIs  ::=  SEQUENCE SIZE(1..MAX) OF uri URI
 * ```
 */
export
type URIs = URI[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION URIs */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_URIs */
let _cached_decoder_for_URIs: $.ASN1Decoder<URIs> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_URIs */

/* START_OF_SYMBOL_DEFINITION _decode_URIs */
/**
 * @summary Decodes an ASN.1 element into a(n) URIs
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {URIs} The decoded data structure.
 */
export
function _decode_URIs (el: _Element) {
    if (!_cached_decoder_for_URIs) { _cached_decoder_for_URIs = $._decodeSequenceOf<URI>(() => _decode_URI); }
    return _cached_decoder_for_URIs(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_URIs */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_URIs */
let _cached_encoder_for_URIs: $.ASN1Encoder<URIs> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_URIs */

/* START_OF_SYMBOL_DEFINITION _encode_URIs */
/**
 * @summary Encodes a(n) URIs into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The URIs, encoded as an ASN.1 Element.
 */
export
function _encode_URIs (value: URIs, elGetter: $.ASN1Encoder<URIs>) {
    if (!_cached_encoder_for_URIs) { _cached_encoder_for_URIs = $._encodeSequenceOf<URI>(() => _encode_URI, $.BER); }
    return _cached_encoder_for_URIs(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_URIs */

/* eslint-enable */
