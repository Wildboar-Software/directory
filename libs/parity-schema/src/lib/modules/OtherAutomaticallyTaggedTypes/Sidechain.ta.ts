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
import { HashPointer, _decode_HashPointer, _encode_HashPointer } from "../OtherAutomaticallyTaggedTypes/HashPointer.ta";
export { HashPointer, _decode_HashPointer, _encode_HashPointer } from "../OtherAutomaticallyTaggedTypes/HashPointer.ta";


/* START_OF_SYMBOL_DEFINITION Sidechain */
/**
 * @summary Sidechain
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * Sidechain     ::=  HashPointer
 * ```
 */
export
type Sidechain = HashPointer; // DefinedType
/* END_OF_SYMBOL_DEFINITION Sidechain */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Sidechain */
let _cached_decoder_for_Sidechain: $.ASN1Decoder<Sidechain> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Sidechain */

/* START_OF_SYMBOL_DEFINITION _decode_Sidechain */
/**
 * @summary Decodes an ASN.1 element into a(n) Sidechain
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Sidechain} The decoded data structure.
 */
export
function _decode_Sidechain (el: _Element) {
    if (!_cached_decoder_for_Sidechain) { _cached_decoder_for_Sidechain = _decode_HashPointer; }
    return _cached_decoder_for_Sidechain(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Sidechain */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Sidechain */
let _cached_encoder_for_Sidechain: $.ASN1Encoder<Sidechain> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Sidechain */

/* START_OF_SYMBOL_DEFINITION _encode_Sidechain */
/**
 * @summary Encodes a(n) Sidechain into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Sidechain, encoded as an ASN.1 Element.
 */
export
function _encode_Sidechain (value: Sidechain, elGetter: $.ASN1Encoder<Sidechain>) {
    if (!_cached_encoder_for_Sidechain) { _cached_encoder_for_Sidechain = _encode_HashPointer; }
    return _cached_encoder_for_Sidechain(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Sidechain */

/* eslint-enable */
