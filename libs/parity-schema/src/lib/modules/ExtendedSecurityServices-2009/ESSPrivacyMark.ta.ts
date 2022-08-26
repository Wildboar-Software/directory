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



/* START_OF_SYMBOL_DEFINITION ESSPrivacyMark */
/**
 * @summary ESSPrivacyMark
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * ESSPrivacyMark  ::=  CHOICE {
 *     pString      PrintableString (SIZE (1..ub-privacy-mark-length)),
 *     utf8String   UTF8String (SIZE (1..MAX))
 * }
 * ```
 */
export
type ESSPrivacyMark =
    { pString: PrintableString } /* CHOICE_ALT_ROOT */
    | { utf8String: UTF8String } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION ESSPrivacyMark */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ESSPrivacyMark */
let _cached_decoder_for_ESSPrivacyMark: $.ASN1Decoder<ESSPrivacyMark> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ESSPrivacyMark */

/* START_OF_SYMBOL_DEFINITION _decode_ESSPrivacyMark */
/**
 * @summary Decodes an ASN.1 element into a(n) ESSPrivacyMark
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ESSPrivacyMark} The decoded data structure.
 */
export
function _decode_ESSPrivacyMark (el: _Element) {
    if (!_cached_decoder_for_ESSPrivacyMark) { _cached_decoder_for_ESSPrivacyMark = $._decode_inextensible_choice<ESSPrivacyMark>({
    "UNIVERSAL 19": [ "pString", $._decodePrintableString ],
    "UNIVERSAL 12": [ "utf8String", $._decodeUTF8String ]
}); }
    return _cached_decoder_for_ESSPrivacyMark(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ESSPrivacyMark */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ESSPrivacyMark */
let _cached_encoder_for_ESSPrivacyMark: $.ASN1Encoder<ESSPrivacyMark> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ESSPrivacyMark */

/* START_OF_SYMBOL_DEFINITION _encode_ESSPrivacyMark */
/**
 * @summary Encodes a(n) ESSPrivacyMark into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ESSPrivacyMark, encoded as an ASN.1 Element.
 */
export
function _encode_ESSPrivacyMark (value: ESSPrivacyMark, elGetter: $.ASN1Encoder<ESSPrivacyMark>) {
    if (!_cached_encoder_for_ESSPrivacyMark) { _cached_encoder_for_ESSPrivacyMark = $._encode_choice<ESSPrivacyMark>({
    "pString": $._encodePrintableString,
    "utf8String": $._encodeUTF8String,
}, $.BER); }
    return _cached_encoder_for_ESSPrivacyMark(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ESSPrivacyMark */

/* eslint-enable */
