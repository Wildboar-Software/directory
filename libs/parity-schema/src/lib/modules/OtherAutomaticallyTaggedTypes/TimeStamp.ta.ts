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
import { TimeStampToken, _decode_TimeStampToken, _encode_TimeStampToken } from "../OtherAutomaticallyTaggedTypes/TimeStampToken.ta";
export { TimeStampToken, _decode_TimeStampToken, _encode_TimeStampToken } from "../OtherAutomaticallyTaggedTypes/TimeStampToken.ta";


/* START_OF_SYMBOL_DEFINITION TimeStamp */
/**
 * @summary TimeStamp
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * TimeStamp     ::=  CHOICE {
 *     timeStampToken    TimeStampToken,
 *     localTimeStamp    GeneralizedTime,
 *     ...    -- Expect additional time types --
 * }
 * ```
 */
export
type TimeStamp =
    { timeStampToken: TimeStampToken } /* CHOICE_ALT_ROOT */
    | { localTimeStamp: GeneralizedTime } /* CHOICE_ALT_ROOT */
    | _Element /* CHOICE_ALT_UNRECOGNIZED_EXT */;
/* END_OF_SYMBOL_DEFINITION TimeStamp */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_TimeStamp */
let _cached_decoder_for_TimeStamp: $.ASN1Decoder<TimeStamp> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_TimeStamp */

/* START_OF_SYMBOL_DEFINITION _decode_TimeStamp */
/**
 * @summary Decodes an ASN.1 element into a(n) TimeStamp
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {TimeStamp} The decoded data structure.
 */
export
function _decode_TimeStamp (el: _Element) {
    if (!_cached_decoder_for_TimeStamp) { _cached_decoder_for_TimeStamp = $._decode_extensible_choice<TimeStamp>({
    "CONTEXT 0": [ "timeStampToken", _decode_TimeStampToken ],
    "CONTEXT 1": [ "localTimeStamp", $._decodeGeneralizedTime ]
}); }
    return _cached_decoder_for_TimeStamp(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_TimeStamp */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_TimeStamp */
let _cached_encoder_for_TimeStamp: $.ASN1Encoder<TimeStamp> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_TimeStamp */

/* START_OF_SYMBOL_DEFINITION _encode_TimeStamp */
/**
 * @summary Encodes a(n) TimeStamp into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The TimeStamp, encoded as an ASN.1 Element.
 */
export
function _encode_TimeStamp (value: TimeStamp, elGetter: $.ASN1Encoder<TimeStamp>) {
    if (!_cached_encoder_for_TimeStamp) { _cached_encoder_for_TimeStamp = $._encode_choice<TimeStamp>({
    "timeStampToken": _encode_TimeStampToken,
    "localTimeStamp": $._encodeGeneralizedTime,
}, $.BER); }
    return _cached_encoder_for_TimeStamp(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_TimeStamp */

/* eslint-enable */
