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



/* START_OF_SYMBOL_DEFINITION BodyPartID */
/**
 * @summary BodyPartID
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * BodyPartID  ::=  INTEGER(0..4294967295)
 * ```
 */
export
type BodyPartID = INTEGER;
/* END_OF_SYMBOL_DEFINITION BodyPartID */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BodyPartID */
let _cached_decoder_for_BodyPartID: $.ASN1Decoder<BodyPartID> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BodyPartID */

/* START_OF_SYMBOL_DEFINITION _decode_BodyPartID */
/**
 * @summary Decodes an ASN.1 element into a(n) BodyPartID
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BodyPartID} The decoded data structure.
 */
export
function _decode_BodyPartID (el: _Element) {
    if (!_cached_decoder_for_BodyPartID) { _cached_decoder_for_BodyPartID = $._decodeInteger; }
    return _cached_decoder_for_BodyPartID(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BodyPartID */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BodyPartID */
let _cached_encoder_for_BodyPartID: $.ASN1Encoder<BodyPartID> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BodyPartID */

/* START_OF_SYMBOL_DEFINITION _encode_BodyPartID */
/**
 * @summary Encodes a(n) BodyPartID into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BodyPartID, encoded as an ASN.1 Element.
 */
export
function _encode_BodyPartID (value: BodyPartID, elGetter: $.ASN1Encoder<BodyPartID>) {
    if (!_cached_encoder_for_BodyPartID) { _cached_encoder_for_BodyPartID = $._encodeInteger; }
    return _cached_encoder_for_BodyPartID(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BodyPartID */

/* eslint-enable */
