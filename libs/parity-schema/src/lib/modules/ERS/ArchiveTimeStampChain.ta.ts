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
import { ArchiveTimeStamp, _decode_ArchiveTimeStamp, _encode_ArchiveTimeStamp } from "../ERS/ArchiveTimeStamp.ta";
export { ArchiveTimeStamp, _decode_ArchiveTimeStamp, _encode_ArchiveTimeStamp } from "../ERS/ArchiveTimeStamp.ta";


/* START_OF_SYMBOL_DEFINITION ArchiveTimeStampChain */
/**
 * @summary ArchiveTimeStampChain
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * ArchiveTimeStampChain     ::=  SEQUENCE OF ArchiveTimeStamp
 * ```
 */
export
type ArchiveTimeStampChain = ArchiveTimeStamp[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION ArchiveTimeStampChain */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ArchiveTimeStampChain */
let _cached_decoder_for_ArchiveTimeStampChain: $.ASN1Decoder<ArchiveTimeStampChain> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ArchiveTimeStampChain */

/* START_OF_SYMBOL_DEFINITION _decode_ArchiveTimeStampChain */
/**
 * @summary Decodes an ASN.1 element into a(n) ArchiveTimeStampChain
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ArchiveTimeStampChain} The decoded data structure.
 */
export
function _decode_ArchiveTimeStampChain (el: _Element) {
    if (!_cached_decoder_for_ArchiveTimeStampChain) { _cached_decoder_for_ArchiveTimeStampChain = $._decodeSequenceOf<ArchiveTimeStamp>(() => _decode_ArchiveTimeStamp); }
    return _cached_decoder_for_ArchiveTimeStampChain(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ArchiveTimeStampChain */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ArchiveTimeStampChain */
let _cached_encoder_for_ArchiveTimeStampChain: $.ASN1Encoder<ArchiveTimeStampChain> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ArchiveTimeStampChain */

/* START_OF_SYMBOL_DEFINITION _encode_ArchiveTimeStampChain */
/**
 * @summary Encodes a(n) ArchiveTimeStampChain into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ArchiveTimeStampChain, encoded as an ASN.1 Element.
 */
export
function _encode_ArchiveTimeStampChain (value: ArchiveTimeStampChain, elGetter: $.ASN1Encoder<ArchiveTimeStampChain>) {
    if (!_cached_encoder_for_ArchiveTimeStampChain) { _cached_encoder_for_ArchiveTimeStampChain = $._encodeSequenceOf<ArchiveTimeStamp>(() => _encode_ArchiveTimeStamp, $.BER); }
    return _cached_encoder_for_ArchiveTimeStampChain(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ArchiveTimeStampChain */

/* eslint-enable */
