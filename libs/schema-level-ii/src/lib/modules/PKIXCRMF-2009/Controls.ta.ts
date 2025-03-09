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
import {
    AttributeTypeAndValue as SingleAttribute,
    _decode_AttributeTypeAndValue as _decode_SingleAttribute,
    _encode_AttributeTypeAndValue as _encode_SingleAttribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";


/* START_OF_SYMBOL_DEFINITION Controls */
/**
 * @summary Controls
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * Controls   ::=  SEQUENCE SIZE(1..MAX) OF SingleAttribute
 *                 {{RegControlSet}}
 * ```
 */
export
type Controls = SingleAttribute[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION Controls */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Controls */
let _cached_decoder_for_Controls: $.ASN1Decoder<Controls> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Controls */

/* START_OF_SYMBOL_DEFINITION _decode_Controls */
/**
 * @summary Decodes an ASN.1 element into a(n) Controls
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Controls} The decoded data structure.
 */
export
function _decode_Controls (el: _Element) {
    if (!_cached_decoder_for_Controls) { _cached_decoder_for_Controls = $._decodeSequenceOf<SingleAttribute>(() => _decode_SingleAttribute); }
    return _cached_decoder_for_Controls(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Controls */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Controls */
let _cached_encoder_for_Controls: $.ASN1Encoder<Controls> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Controls */

/* START_OF_SYMBOL_DEFINITION _encode_Controls */
/**
 * @summary Encodes a(n) Controls into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Controls, encoded as an ASN.1 Element.
 */
export
function _encode_Controls (value: Controls, elGetter: $.ASN1Encoder<Controls>) {
    if (!_cached_encoder_for_Controls) { _cached_encoder_for_Controls = $._encodeSequenceOf<SingleAttribute>(() => _encode_SingleAttribute, $.BER); }
    return _cached_encoder_for_Controls(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Controls */

/* eslint-enable */
