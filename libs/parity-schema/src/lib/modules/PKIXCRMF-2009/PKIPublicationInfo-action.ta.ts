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



/* START_OF_SYMBOL_DEFINITION PKIPublicationInfo_action */
/**
 * @summary PKIPublicationInfo_action
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * PKIPublicationInfo-action ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
 * ```
 */
export
type PKIPublicationInfo_action = INTEGER;
/* END_OF_SYMBOL_DEFINITION PKIPublicationInfo_action */

/* START_OF_SYMBOL_DEFINITION PKIPublicationInfo_action_dontPublish */
/**
 * @summary PKIPublicationInfo_action_dontPublish
 * @constant
 * @type {number}
 */
export
const PKIPublicationInfo_action_dontPublish: PKIPublicationInfo_action = 0; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION PKIPublicationInfo_action_dontPublish */

/* START_OF_SYMBOL_DEFINITION dontPublish */
/**
 * @summary PKIPublicationInfo_action_dontPublish
 * @constant
 * @type {number}
 */
export
const dontPublish: PKIPublicationInfo_action = PKIPublicationInfo_action_dontPublish; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION dontPublish */

/* START_OF_SYMBOL_DEFINITION PKIPublicationInfo_action_pleasePublish */
/**
 * @summary PKIPublicationInfo_action_pleasePublish
 * @constant
 * @type {number}
 */
export
const PKIPublicationInfo_action_pleasePublish: PKIPublicationInfo_action = 1; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION PKIPublicationInfo_action_pleasePublish */

/* START_OF_SYMBOL_DEFINITION pleasePublish */
/**
 * @summary PKIPublicationInfo_action_pleasePublish
 * @constant
 * @type {number}
 */
export
const pleasePublish: PKIPublicationInfo_action = PKIPublicationInfo_action_pleasePublish; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION pleasePublish */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PKIPublicationInfo_action */
let _cached_decoder_for_PKIPublicationInfo_action: $.ASN1Decoder<PKIPublicationInfo_action> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PKIPublicationInfo_action */

/* START_OF_SYMBOL_DEFINITION _decode_PKIPublicationInfo_action */
/**
 * @summary Decodes an ASN.1 element into a(n) PKIPublicationInfo_action
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PKIPublicationInfo_action} The decoded data structure.
 */
export
function _decode_PKIPublicationInfo_action (el: _Element) {
    if (!_cached_decoder_for_PKIPublicationInfo_action) { _cached_decoder_for_PKIPublicationInfo_action = $._decodeInteger; }
    return _cached_decoder_for_PKIPublicationInfo_action(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PKIPublicationInfo_action */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PKIPublicationInfo_action */
let _cached_encoder_for_PKIPublicationInfo_action: $.ASN1Encoder<PKIPublicationInfo_action> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PKIPublicationInfo_action */

/* START_OF_SYMBOL_DEFINITION _encode_PKIPublicationInfo_action */
/**
 * @summary Encodes a(n) PKIPublicationInfo_action into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PKIPublicationInfo_action, encoded as an ASN.1 Element.
 */
export
function _encode_PKIPublicationInfo_action (value: PKIPublicationInfo_action, elGetter: $.ASN1Encoder<PKIPublicationInfo_action>) {
    if (!_cached_encoder_for_PKIPublicationInfo_action) { _cached_encoder_for_PKIPublicationInfo_action = $._encodeInteger; }
    return _cached_encoder_for_PKIPublicationInfo_action(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_PKIPublicationInfo_action */

/* eslint-enable */
