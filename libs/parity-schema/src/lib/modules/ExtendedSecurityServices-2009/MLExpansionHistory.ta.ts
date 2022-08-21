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
import { MLData, _decode_MLData, _encode_MLData } from "../ExtendedSecurityServices-2009/MLData.ta";
export { MLData, _decode_MLData, _encode_MLData } from "../ExtendedSecurityServices-2009/MLData.ta";


/* START_OF_SYMBOL_DEFINITION MLExpansionHistory */
/**
 * @summary MLExpansionHistory
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * MLExpansionHistory  ::=  SEQUENCE
 *     SIZE (1..ub-ml-expansion-history) OF MLData
 * ```
 */
export
type MLExpansionHistory = MLData[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION MLExpansionHistory */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_MLExpansionHistory */
let _cached_decoder_for_MLExpansionHistory: $.ASN1Decoder<MLExpansionHistory> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_MLExpansionHistory */

/* START_OF_SYMBOL_DEFINITION _decode_MLExpansionHistory */
/**
 * @summary Decodes an ASN.1 element into a(n) MLExpansionHistory
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {MLExpansionHistory} The decoded data structure.
 */
export
function _decode_MLExpansionHistory (el: _Element) {
    if (!_cached_decoder_for_MLExpansionHistory) { _cached_decoder_for_MLExpansionHistory = $._decodeSequenceOf<MLData>(() => _decode_MLData); }
    return _cached_decoder_for_MLExpansionHistory(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_MLExpansionHistory */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_MLExpansionHistory */
let _cached_encoder_for_MLExpansionHistory: $.ASN1Encoder<MLExpansionHistory> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_MLExpansionHistory */

/* START_OF_SYMBOL_DEFINITION _encode_MLExpansionHistory */
/**
 * @summary Encodes a(n) MLExpansionHistory into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The MLExpansionHistory, encoded as an ASN.1 Element.
 */
export
function _encode_MLExpansionHistory (value: MLExpansionHistory, elGetter: $.ASN1Encoder<MLExpansionHistory>) {
    if (!_cached_encoder_for_MLExpansionHistory) { _cached_encoder_for_MLExpansionHistory = $._encodeSequenceOf<MLData>(() => _encode_MLData, $.BER); }
    return _cached_encoder_for_MLExpansionHistory(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_MLExpansionHistory */

/* eslint-enable */
