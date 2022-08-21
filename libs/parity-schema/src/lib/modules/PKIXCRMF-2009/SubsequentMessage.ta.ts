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



/* START_OF_SYMBOL_DEFINITION SubsequentMessage */
/**
 * @summary SubsequentMessage
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * SubsequentMessage  ::=  INTEGER {
 *     encrCert (0),
 *     -- requests that resulting certificate be encrypted for the
 *     -- end entity (following which, POP will be proven in a
 *     -- confirmation message)
 *     challengeResp (1) }
 * ```
 */
export
type SubsequentMessage = INTEGER;
/* END_OF_SYMBOL_DEFINITION SubsequentMessage */

/* START_OF_SYMBOL_DEFINITION SubsequentMessage_encrCert */
/**
 * @summary SubsequentMessage_encrCert
 * @constant
 * @type {number}
 */
export
const SubsequentMessage_encrCert: SubsequentMessage = 0; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SubsequentMessage_encrCert */

/* START_OF_SYMBOL_DEFINITION encrCert */
/**
 * @summary SubsequentMessage_encrCert
 * @constant
 * @type {number}
 */
export
const encrCert: SubsequentMessage = SubsequentMessage_encrCert; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION encrCert */

/* START_OF_SYMBOL_DEFINITION SubsequentMessage_challengeResp */
/**
 * @summary SubsequentMessage_challengeResp
 * @constant
 * @type {number}
 */
export
const SubsequentMessage_challengeResp: SubsequentMessage = 1; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SubsequentMessage_challengeResp */

/* START_OF_SYMBOL_DEFINITION challengeResp */
/**
 * @summary SubsequentMessage_challengeResp
 * @constant
 * @type {number}
 */
export
const challengeResp: SubsequentMessage = SubsequentMessage_challengeResp; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION challengeResp */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SubsequentMessage */
let _cached_decoder_for_SubsequentMessage: $.ASN1Decoder<SubsequentMessage> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SubsequentMessage */

/* START_OF_SYMBOL_DEFINITION _decode_SubsequentMessage */
/**
 * @summary Decodes an ASN.1 element into a(n) SubsequentMessage
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SubsequentMessage} The decoded data structure.
 */
export
function _decode_SubsequentMessage (el: _Element) {
    if (!_cached_decoder_for_SubsequentMessage) { _cached_decoder_for_SubsequentMessage = $._decodeInteger; }
    return _cached_decoder_for_SubsequentMessage(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SubsequentMessage */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SubsequentMessage */
let _cached_encoder_for_SubsequentMessage: $.ASN1Encoder<SubsequentMessage> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SubsequentMessage */

/* START_OF_SYMBOL_DEFINITION _encode_SubsequentMessage */
/**
 * @summary Encodes a(n) SubsequentMessage into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SubsequentMessage, encoded as an ASN.1 Element.
 */
export
function _encode_SubsequentMessage (value: SubsequentMessage, elGetter: $.ASN1Encoder<SubsequentMessage>) {
    if (!_cached_encoder_for_SubsequentMessage) { _cached_encoder_for_SubsequentMessage = $._encodeInteger; }
    return _cached_encoder_for_SubsequentMessage(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SubsequentMessage */

/* eslint-enable */
