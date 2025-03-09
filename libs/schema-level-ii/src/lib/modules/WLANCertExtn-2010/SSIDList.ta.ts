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
import { SSID, _decode_SSID, _encode_SSID } from "../WLANCertExtn-2010/SSID.ta";


/* START_OF_SYMBOL_DEFINITION SSIDList */
/**
 * @summary SSIDList
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * SSIDList  ::=  SEQUENCE SIZE (1..MAX) OF SSID
 * ```
 */
export
type SSIDList = SSID[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION SSIDList */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SSIDList */
let _cached_decoder_for_SSIDList: $.ASN1Decoder<SSIDList> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SSIDList */

/* START_OF_SYMBOL_DEFINITION _decode_SSIDList */
/**
 * @summary Decodes an ASN.1 element into a(n) SSIDList
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SSIDList} The decoded data structure.
 */
export
function _decode_SSIDList (el: _Element) {
    if (!_cached_decoder_for_SSIDList) { _cached_decoder_for_SSIDList = $._decodeSequenceOf<SSID>(() => _decode_SSID); }
    return _cached_decoder_for_SSIDList(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SSIDList */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SSIDList */
let _cached_encoder_for_SSIDList: $.ASN1Encoder<SSIDList> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SSIDList */

/* START_OF_SYMBOL_DEFINITION _encode_SSIDList */
/**
 * @summary Encodes a(n) SSIDList into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SSIDList, encoded as an ASN.1 Element.
 */
export
function _encode_SSIDList (value: SSIDList, elGetter: $.ASN1Encoder<SSIDList>) {
    if (!_cached_encoder_for_SSIDList) { _cached_encoder_for_SSIDList = $._encodeSequenceOf<SSID>(() => _encode_SSID, $.BER); }
    return _cached_encoder_for_SSIDList(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SSIDList */

/* eslint-enable */
