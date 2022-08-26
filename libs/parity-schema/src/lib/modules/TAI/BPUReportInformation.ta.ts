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
import { BPUReport, _decode_BPUReport, _encode_BPUReport } from "../TAI/BPUReport.ta";
export { BPUReport, _decode_BPUReport, _encode_BPUReport } from "../TAI/BPUReport.ta";
import { URI, _decode_URI, _encode_URI } from "../TAI/URI.ta";
export { URI, _decode_URI, _encode_URI } from "../TAI/URI.ta";


/* START_OF_SYMBOL_DEFINITION BPUReportInformation */
/**
 * @summary BPUReportInformation
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * BPUReportInformation  ::=  CHOICE {
 *   bpuReport          BPUReport,
 *   bpuReportReferrer  URI
 * }
 * ```
 */
export
type BPUReportInformation =
    { bpuReport: BPUReport } /* CHOICE_ALT_ROOT */
    | { bpuReportReferrer: URI } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION BPUReportInformation */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BPUReportInformation */
let _cached_decoder_for_BPUReportInformation: $.ASN1Decoder<BPUReportInformation> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BPUReportInformation */

/* START_OF_SYMBOL_DEFINITION _decode_BPUReportInformation */
/**
 * @summary Decodes an ASN.1 element into a(n) BPUReportInformation
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BPUReportInformation} The decoded data structure.
 */
export
function _decode_BPUReportInformation (el: _Element) {
    if (!_cached_decoder_for_BPUReportInformation) { _cached_decoder_for_BPUReportInformation = $._decode_inextensible_choice<BPUReportInformation>({
    "CONTEXT 0": [ "bpuReport", _decode_BPUReport ],
    "CONTEXT 1": [ "bpuReportReferrer", _decode_URI ]
}); }
    return _cached_decoder_for_BPUReportInformation(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BPUReportInformation */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BPUReportInformation */
let _cached_encoder_for_BPUReportInformation: $.ASN1Encoder<BPUReportInformation> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BPUReportInformation */

/* START_OF_SYMBOL_DEFINITION _encode_BPUReportInformation */
/**
 * @summary Encodes a(n) BPUReportInformation into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BPUReportInformation, encoded as an ASN.1 Element.
 */
export
function _encode_BPUReportInformation (value: BPUReportInformation, elGetter: $.ASN1Encoder<BPUReportInformation>) {
    if (!_cached_encoder_for_BPUReportInformation) { _cached_encoder_for_BPUReportInformation = $._encode_choice<BPUReportInformation>({
    "bpuReport": _encode_BPUReport,
    "bpuReportReferrer": _encode_URI,
}, $.BER); }
    return _cached_encoder_for_BPUReportInformation(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BPUReportInformation */

/* eslint-enable */
