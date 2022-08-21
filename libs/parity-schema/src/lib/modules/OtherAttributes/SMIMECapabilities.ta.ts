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
import { SMIMECapability, _decode_SMIMECapability, _encode_SMIMECapability } from "../OtherAttributes/SMIMECapability.ta";
export { SMIMECapability, _decode_SMIMECapability, _encode_SMIMECapability } from "../OtherAttributes/SMIMECapability.ta";


/* START_OF_SYMBOL_DEFINITION SMIMECapabilities */
/**
 * @summary SMIMECapabilities
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * SMIMECapabilities  ::=  SEQUENCE SIZE (1..MAX) OF SMIMECapability
 * ```
 */
export
type SMIMECapabilities = SMIMECapability[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION SMIMECapabilities */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SMIMECapabilities */
let _cached_decoder_for_SMIMECapabilities: $.ASN1Decoder<SMIMECapabilities> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SMIMECapabilities */

/* START_OF_SYMBOL_DEFINITION _decode_SMIMECapabilities */
/**
 * @summary Decodes an ASN.1 element into a(n) SMIMECapabilities
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SMIMECapabilities} The decoded data structure.
 */
export
function _decode_SMIMECapabilities (el: _Element) {
    if (!_cached_decoder_for_SMIMECapabilities) { _cached_decoder_for_SMIMECapabilities = $._decodeSequenceOf<SMIMECapability>(() => _decode_SMIMECapability); }
    return _cached_decoder_for_SMIMECapabilities(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SMIMECapabilities */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SMIMECapabilities */
let _cached_encoder_for_SMIMECapabilities: $.ASN1Encoder<SMIMECapabilities> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SMIMECapabilities */

/* START_OF_SYMBOL_DEFINITION _encode_SMIMECapabilities */
/**
 * @summary Encodes a(n) SMIMECapabilities into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SMIMECapabilities, encoded as an ASN.1 Element.
 */
export
function _encode_SMIMECapabilities (value: SMIMECapabilities, elGetter: $.ASN1Encoder<SMIMECapabilities>) {
    if (!_cached_encoder_for_SMIMECapabilities) { _cached_encoder_for_SMIMECapabilities = $._encodeSequenceOf<SMIMECapability>(() => _encode_SMIMECapability, $.BER); }
    return _cached_encoder_for_SMIMECapabilities(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SMIMECapabilities */

/* eslint-enable */
