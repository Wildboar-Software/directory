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
import { NPartsMessage, _decode_NPartsMessage, _encode_NPartsMessage } from "../IN-CS3-SCF-SDF-datatypes/NPartsMessage.ta";
export { NPartsMessage, _decode_NPartsMessage, _encode_NPartsMessage } from "../IN-CS3-SCF-SDF-datatypes/NPartsMessage.ta";


/* START_OF_SYMBOL_DEFINITION TwoPartMessage */
/**
 * @summary TwoPartMessage
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * TwoPartMessage  ::=  NPartsMessage
 * ```
 */
export
type TwoPartMessage = NPartsMessage; // DefinedType
/* END_OF_SYMBOL_DEFINITION TwoPartMessage */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_TwoPartMessage */
let _cached_decoder_for_TwoPartMessage: $.ASN1Decoder<TwoPartMessage> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_TwoPartMessage */

/* START_OF_SYMBOL_DEFINITION _decode_TwoPartMessage */
/**
 * @summary Decodes an ASN.1 element into a(n) TwoPartMessage
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {TwoPartMessage} The decoded data structure.
 */
export
function _decode_TwoPartMessage (el: _Element) {
    if (!_cached_decoder_for_TwoPartMessage) { _cached_decoder_for_TwoPartMessage = _decode_NPartsMessage; }
    return _cached_decoder_for_TwoPartMessage(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_TwoPartMessage */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_TwoPartMessage */
let _cached_encoder_for_TwoPartMessage: $.ASN1Encoder<TwoPartMessage> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_TwoPartMessage */

/* START_OF_SYMBOL_DEFINITION _encode_TwoPartMessage */
/**
 * @summary Encodes a(n) TwoPartMessage into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The TwoPartMessage, encoded as an ASN.1 Element.
 */
export
function _encode_TwoPartMessage (value: TwoPartMessage, elGetter: $.ASN1Encoder<TwoPartMessage>) {
    if (!_cached_encoder_for_TwoPartMessage) { _cached_encoder_for_TwoPartMessage = _encode_NPartsMessage; }
    return _cached_encoder_for_TwoPartMessage(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_TwoPartMessage */

/* eslint-enable */