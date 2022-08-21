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
import { ContentInfo, _decode_ContentInfo, _encode_ContentInfo } from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/ContentInfo.ta";
export { ContentInfo, _decode_ContentInfo, _encode_ContentInfo } from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/ContentInfo.ta";


/* START_OF_SYMBOL_DEFINITION TimeStampToken */
/**
 * @summary TimeStampToken
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * TimeStampToken  ::=  ContentInfo
 * ```
 */
export
type TimeStampToken = ContentInfo; // DefinedType
/* END_OF_SYMBOL_DEFINITION TimeStampToken */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_TimeStampToken */
let _cached_decoder_for_TimeStampToken: $.ASN1Decoder<TimeStampToken> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_TimeStampToken */

/* START_OF_SYMBOL_DEFINITION _decode_TimeStampToken */
/**
 * @summary Decodes an ASN.1 element into a(n) TimeStampToken
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {TimeStampToken} The decoded data structure.
 */
export
function _decode_TimeStampToken (el: _Element) {
    if (!_cached_decoder_for_TimeStampToken) { _cached_decoder_for_TimeStampToken = _decode_ContentInfo; }
    return _cached_decoder_for_TimeStampToken(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_TimeStampToken */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_TimeStampToken */
let _cached_encoder_for_TimeStampToken: $.ASN1Encoder<TimeStampToken> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_TimeStampToken */

/* START_OF_SYMBOL_DEFINITION _encode_TimeStampToken */
/**
 * @summary Encodes a(n) TimeStampToken into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The TimeStampToken, encoded as an ASN.1 Element.
 */
export
function _encode_TimeStampToken (value: TimeStampToken, elGetter: $.ASN1Encoder<TimeStampToken>) {
    if (!_cached_encoder_for_TimeStampToken) { _cached_encoder_for_TimeStampToken = _encode_ContentInfo; }
    return _cached_encoder_for_TimeStampToken(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_TimeStampToken */

/* eslint-enable */
