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
import { Pointer, _decode_Pointer, _encode_Pointer } from "../OtherAutomaticallyTaggedTypes/Pointer.ta";
export { Pointer, _decode_Pointer, _encode_Pointer } from "../OtherAutomaticallyTaggedTypes/Pointer.ta";


/* START_OF_SYMBOL_DEFINITION Pointers */
/**
 * @summary Pointers
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * Pointers  ::=  SEQUENCE SIZE(1..MAX) OF pointer Pointer
 * ```
 */
export
type Pointers = Pointer[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION Pointers */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Pointers */
let _cached_decoder_for_Pointers: $.ASN1Decoder<Pointers> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Pointers */

/* START_OF_SYMBOL_DEFINITION _decode_Pointers */
/**
 * @summary Decodes an ASN.1 element into a(n) Pointers
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Pointers} The decoded data structure.
 */
export
function _decode_Pointers (el: _Element) {
    if (!_cached_decoder_for_Pointers) { _cached_decoder_for_Pointers = $._decodeSequenceOf<Pointer>(() => _decode_Pointer); }
    return _cached_decoder_for_Pointers(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Pointers */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Pointers */
let _cached_encoder_for_Pointers: $.ASN1Encoder<Pointers> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Pointers */

/* START_OF_SYMBOL_DEFINITION _encode_Pointers */
/**
 * @summary Encodes a(n) Pointers into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Pointers, encoded as an ASN.1 Element.
 */
export
function _encode_Pointers (value: Pointers, elGetter: $.ASN1Encoder<Pointers>) {
    if (!_cached_encoder_for_Pointers) { _cached_encoder_for_Pointers = $._encodeSequenceOf<Pointer>(() => _encode_Pointer, $.BER); }
    return _cached_encoder_for_Pointers(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Pointers */

/* eslint-enable */
