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
import { UniqueIdentifierOfBioParaInfo, _decode_UniqueIdentifierOfBioParaInfo, _encode_UniqueIdentifierOfBioParaInfo } from "../TAI/UniqueIdentifierOfBioParaInfo.ta";
export { UniqueIdentifierOfBioParaInfo, _decode_UniqueIdentifierOfBioParaInfo, _encode_UniqueIdentifierOfBioParaInfo } from "../TAI/UniqueIdentifierOfBioParaInfo.ta";


/* START_OF_SYMBOL_DEFINITION SecurityLevelofPrivilege_bioSecLevel */
/**
 * @summary SecurityLevelofPrivilege_bioSecLevel
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * SecurityLevelofPrivilege-bioSecLevel ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
 * ```
 */
export
type SecurityLevelofPrivilege_bioSecLevel =
    { x520identifier: UniqueIdentifierOfBioParaInfo } /* CHOICE_ALT_ROOT */
    | { simpleidentifier: INTEGER } /* CHOICE_ALT_ROOT */;
/* END_OF_SYMBOL_DEFINITION SecurityLevelofPrivilege_bioSecLevel */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SecurityLevelofPrivilege_bioSecLevel */
let _cached_decoder_for_SecurityLevelofPrivilege_bioSecLevel: $.ASN1Decoder<SecurityLevelofPrivilege_bioSecLevel> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SecurityLevelofPrivilege_bioSecLevel */

/* START_OF_SYMBOL_DEFINITION _decode_SecurityLevelofPrivilege_bioSecLevel */
/**
 * @summary Decodes an ASN.1 element into a(n) SecurityLevelofPrivilege_bioSecLevel
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SecurityLevelofPrivilege_bioSecLevel} The decoded data structure.
 */
export
function _decode_SecurityLevelofPrivilege_bioSecLevel (el: _Element) {
    if (!_cached_decoder_for_SecurityLevelofPrivilege_bioSecLevel) { _cached_decoder_for_SecurityLevelofPrivilege_bioSecLevel = $._decode_inextensible_choice<SecurityLevelofPrivilege_bioSecLevel>({
    "CONTEXT 0": [ "x520identifier", _decode_UniqueIdentifierOfBioParaInfo ],
    "CONTEXT 1": [ "simpleidentifier", $._decodeInteger ]
}); }
    return _cached_decoder_for_SecurityLevelofPrivilege_bioSecLevel(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SecurityLevelofPrivilege_bioSecLevel */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SecurityLevelofPrivilege_bioSecLevel */
let _cached_encoder_for_SecurityLevelofPrivilege_bioSecLevel: $.ASN1Encoder<SecurityLevelofPrivilege_bioSecLevel> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SecurityLevelofPrivilege_bioSecLevel */

/* START_OF_SYMBOL_DEFINITION _encode_SecurityLevelofPrivilege_bioSecLevel */
/**
 * @summary Encodes a(n) SecurityLevelofPrivilege_bioSecLevel into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SecurityLevelofPrivilege_bioSecLevel, encoded as an ASN.1 Element.
 */
export
function _encode_SecurityLevelofPrivilege_bioSecLevel (value: SecurityLevelofPrivilege_bioSecLevel, elGetter: $.ASN1Encoder<SecurityLevelofPrivilege_bioSecLevel>) {
    if (!_cached_encoder_for_SecurityLevelofPrivilege_bioSecLevel) { _cached_encoder_for_SecurityLevelofPrivilege_bioSecLevel = $._encode_choice<SecurityLevelofPrivilege_bioSecLevel>({
    "x520identifier": _encode_UniqueIdentifierOfBioParaInfo,
    "simpleidentifier": $._encodeInteger,
}, $.BER); }
    return _cached_encoder_for_SecurityLevelofPrivilege_bioSecLevel(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SecurityLevelofPrivilege_bioSecLevel */

/* eslint-enable */
