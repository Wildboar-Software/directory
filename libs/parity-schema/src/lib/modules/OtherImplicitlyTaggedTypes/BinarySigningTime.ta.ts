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
import { BinaryTime, _decode_BinaryTime, _encode_BinaryTime } from "../OtherImplicitlyTaggedTypes/BinaryTime.ta";
export { BinaryTime, _decode_BinaryTime, _encode_BinaryTime } from "../OtherImplicitlyTaggedTypes/BinaryTime.ta";


/* START_OF_SYMBOL_DEFINITION BinarySigningTime */
/**
 * @summary BinarySigningTime
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * BinarySigningTime  ::=  BinaryTime
 * ```
 */
export
type BinarySigningTime = BinaryTime; // DefinedType
/* END_OF_SYMBOL_DEFINITION BinarySigningTime */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BinarySigningTime */
let _cached_decoder_for_BinarySigningTime: $.ASN1Decoder<BinarySigningTime> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BinarySigningTime */

/* START_OF_SYMBOL_DEFINITION _decode_BinarySigningTime */
/**
 * @summary Decodes an ASN.1 element into a(n) BinarySigningTime
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BinarySigningTime} The decoded data structure.
 */
export
function _decode_BinarySigningTime (el: _Element) {
    if (!_cached_decoder_for_BinarySigningTime) { _cached_decoder_for_BinarySigningTime = _decode_BinaryTime; }
    return _cached_decoder_for_BinarySigningTime(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BinarySigningTime */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BinarySigningTime */
let _cached_encoder_for_BinarySigningTime: $.ASN1Encoder<BinarySigningTime> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BinarySigningTime */

/* START_OF_SYMBOL_DEFINITION _encode_BinarySigningTime */
/**
 * @summary Encodes a(n) BinarySigningTime into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BinarySigningTime, encoded as an ASN.1 Element.
 */
export
function _encode_BinarySigningTime (value: BinarySigningTime, elGetter: $.ASN1Encoder<BinarySigningTime>) {
    if (!_cached_encoder_for_BinarySigningTime) { _cached_encoder_for_BinarySigningTime = _encode_BinaryTime; }
    return _cached_encoder_for_BinarySigningTime(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BinarySigningTime */

/* eslint-enable */
