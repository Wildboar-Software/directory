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


/* START_OF_SYMBOL_DEFINITION ParentBlock */
/**
 * @summary ParentBlock
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * ParentBlock     ::=  HashPointer
 * ```
 */
export
type ParentBlock = HashPointer; // DefinedType
/* END_OF_SYMBOL_DEFINITION ParentBlock */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ParentBlock */
let _cached_decoder_for_ParentBlock: $.ASN1Decoder<ParentBlock> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ParentBlock */

/* START_OF_SYMBOL_DEFINITION _decode_ParentBlock */
/**
 * @summary Decodes an ASN.1 element into a(n) ParentBlock
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ParentBlock} The decoded data structure.
 */
export
function _decode_ParentBlock (el: _Element) {
    if (!_cached_decoder_for_ParentBlock) { _cached_decoder_for_ParentBlock = _decode_HashPointer; }
    return _cached_decoder_for_ParentBlock(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ParentBlock */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ParentBlock */
let _cached_encoder_for_ParentBlock: $.ASN1Encoder<ParentBlock> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ParentBlock */

/* START_OF_SYMBOL_DEFINITION _encode_ParentBlock */
/**
 * @summary Encodes a(n) ParentBlock into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ParentBlock, encoded as an ASN.1 Element.
 */
export
function _encode_ParentBlock (value: ParentBlock, elGetter: $.ASN1Encoder<ParentBlock>) {
    if (!_cached_encoder_for_ParentBlock) { _cached_encoder_for_ParentBlock = _encode_HashPointer; }
    return _cached_encoder_for_ParentBlock(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ParentBlock */

/* eslint-enable */
