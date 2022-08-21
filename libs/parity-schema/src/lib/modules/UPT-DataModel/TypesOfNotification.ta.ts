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



/* START_OF_SYMBOL_DEFINITION TypesOfNotification */
/**
 * @summary TypesOfNotification
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * TypesOfNotification  ::=  BIT STRING {
 *   servedUserForwardedCall(0), callingUserWithForwardedToNumber(1),
 *   callingUserWithoutForwardedToNumber(2), servedUserForwardingActivation(3)
 * }
 * ```
 */
export
type TypesOfNotification = BIT_STRING;
/* END_OF_SYMBOL_DEFINITION TypesOfNotification */

/* START_OF_SYMBOL_DEFINITION TypesOfNotification_servedUserForwardedCall */
/**
 * @summary TypesOfNotification_servedUserForwardedCall
 * @constant
 */
export
const TypesOfNotification_servedUserForwardedCall: number = 0; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION TypesOfNotification_servedUserForwardedCall */

/* START_OF_SYMBOL_DEFINITION servedUserForwardedCall */
/**
 * @summary servedUserForwardedCall
 * @constant
 */
export
const servedUserForwardedCall: number = TypesOfNotification_servedUserForwardedCall; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION servedUserForwardedCall */

/* START_OF_SYMBOL_DEFINITION TypesOfNotification_callingUserWithForwardedToNumber */
/**
 * @summary TypesOfNotification_callingUserWithForwardedToNumber
 * @constant
 */
export
const TypesOfNotification_callingUserWithForwardedToNumber: number = 1; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION TypesOfNotification_callingUserWithForwardedToNumber */

/* START_OF_SYMBOL_DEFINITION callingUserWithForwardedToNumber */
/**
 * @summary callingUserWithForwardedToNumber
 * @constant
 */
export
const callingUserWithForwardedToNumber: number = TypesOfNotification_callingUserWithForwardedToNumber; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION callingUserWithForwardedToNumber */

/* START_OF_SYMBOL_DEFINITION TypesOfNotification_callingUserWithoutForwardedToNumber */
/**
 * @summary TypesOfNotification_callingUserWithoutForwardedToNumber
 * @constant
 */
export
const TypesOfNotification_callingUserWithoutForwardedToNumber: number = 2; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION TypesOfNotification_callingUserWithoutForwardedToNumber */

/* START_OF_SYMBOL_DEFINITION callingUserWithoutForwardedToNumber */
/**
 * @summary callingUserWithoutForwardedToNumber
 * @constant
 */
export
const callingUserWithoutForwardedToNumber: number = TypesOfNotification_callingUserWithoutForwardedToNumber; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION callingUserWithoutForwardedToNumber */

/* START_OF_SYMBOL_DEFINITION TypesOfNotification_servedUserForwardingActivation */
/**
 * @summary TypesOfNotification_servedUserForwardingActivation
 * @constant
 */
export
const TypesOfNotification_servedUserForwardingActivation: number = 3; /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION TypesOfNotification_servedUserForwardingActivation */

/* START_OF_SYMBOL_DEFINITION servedUserForwardingActivation */
/**
 * @summary servedUserForwardingActivation
 * @constant
 */
export
const servedUserForwardingActivation: number = TypesOfNotification_servedUserForwardingActivation; /* SHORT_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION servedUserForwardingActivation */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_TypesOfNotification */
let _cached_decoder_for_TypesOfNotification: $.ASN1Decoder<TypesOfNotification> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_TypesOfNotification */

/* START_OF_SYMBOL_DEFINITION _decode_TypesOfNotification */
/**
 * @summary Decodes an ASN.1 element into a(n) TypesOfNotification
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {TypesOfNotification} The decoded data structure.
 */
export
function _decode_TypesOfNotification (el: _Element) {
    if (!_cached_decoder_for_TypesOfNotification) { _cached_decoder_for_TypesOfNotification = $._decodeBitString; }
    return _cached_decoder_for_TypesOfNotification(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_TypesOfNotification */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_TypesOfNotification */
let _cached_encoder_for_TypesOfNotification: $.ASN1Encoder<TypesOfNotification> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_TypesOfNotification */

/* START_OF_SYMBOL_DEFINITION _encode_TypesOfNotification */
/**
 * @summary Encodes a(n) TypesOfNotification into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The TypesOfNotification, encoded as an ASN.1 Element.
 */
export
function _encode_TypesOfNotification (value: TypesOfNotification, elGetter: $.ASN1Encoder<TypesOfNotification>) {
    if (!_cached_encoder_for_TypesOfNotification) { _cached_encoder_for_TypesOfNotification = $._encodeBitString; }
    return _cached_encoder_for_TypesOfNotification(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_TypesOfNotification */

/* eslint-enable */
