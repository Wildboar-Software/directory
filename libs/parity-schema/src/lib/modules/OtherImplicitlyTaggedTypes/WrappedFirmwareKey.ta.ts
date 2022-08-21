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
import {
    EnvelopedData,
    _decode_EnvelopedData,
    _encode_EnvelopedData,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/EnvelopedData.ta";


/* START_OF_SYMBOL_DEFINITION WrappedFirmwareKey */
/**
 * @summary WrappedFirmwareKey
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * WrappedFirmwareKey  ::=  EnvelopedData
 * ```
 */
export
type WrappedFirmwareKey = EnvelopedData; // DefinedType
/* END_OF_SYMBOL_DEFINITION WrappedFirmwareKey */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_WrappedFirmwareKey */
let _cached_decoder_for_WrappedFirmwareKey: $.ASN1Decoder<WrappedFirmwareKey> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_WrappedFirmwareKey */

/* START_OF_SYMBOL_DEFINITION _decode_WrappedFirmwareKey */
/**
 * @summary Decodes an ASN.1 element into a(n) WrappedFirmwareKey
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {WrappedFirmwareKey} The decoded data structure.
 */
export
function _decode_WrappedFirmwareKey (el: _Element) {
    if (!_cached_decoder_for_WrappedFirmwareKey) { _cached_decoder_for_WrappedFirmwareKey = _decode_EnvelopedData; }
    return _cached_decoder_for_WrappedFirmwareKey(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_WrappedFirmwareKey */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_WrappedFirmwareKey */
let _cached_encoder_for_WrappedFirmwareKey: $.ASN1Encoder<WrappedFirmwareKey> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_WrappedFirmwareKey */

/* START_OF_SYMBOL_DEFINITION _encode_WrappedFirmwareKey */
/**
 * @summary Encodes a(n) WrappedFirmwareKey into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The WrappedFirmwareKey, encoded as an ASN.1 Element.
 */
export
function _encode_WrappedFirmwareKey (value: WrappedFirmwareKey, elGetter: $.ASN1Encoder<WrappedFirmwareKey>) {
    if (!_cached_encoder_for_WrappedFirmwareKey) { _cached_encoder_for_WrappedFirmwareKey = _encode_EnvelopedData; }
    return _cached_encoder_for_WrappedFirmwareKey(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_WrappedFirmwareKey */

/* eslint-enable */
