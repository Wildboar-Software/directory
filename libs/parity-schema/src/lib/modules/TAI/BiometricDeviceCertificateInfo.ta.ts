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
    TBSAttributeCertificate,
    _encode_TBSAttributeCertificate,
    _decode_TBSAttributeCertificate,
} from "@wildboar/x500/src/lib/modules/AttributeCertificateDefinitions/TBSAttributeCertificate.ta";


/* START_OF_SYMBOL_DEFINITION BiometricDeviceCertificateInfo */
/**
 * @summary BiometricDeviceCertificateInfo
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * BiometricDeviceCertificateInfo  ::= 
 *   AttributeCertificateInfo(WITH COMPONENTS {
 *                              ...,
 *                              attributes  (SIZE (1..MAX))
 *                            })
 * ```
 */
export
type BiometricDeviceCertificateInfo = TBSAttributeCertificate; // DefinedType
/* END_OF_SYMBOL_DEFINITION BiometricDeviceCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricDeviceCertificateInfo */
let _cached_decoder_for_BiometricDeviceCertificateInfo: $.ASN1Decoder<BiometricDeviceCertificateInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricDeviceCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricDeviceCertificateInfo */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricDeviceCertificateInfo
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricDeviceCertificateInfo} The decoded data structure.
 */
export
function _decode_BiometricDeviceCertificateInfo (el: _Element) {
    if (!_cached_decoder_for_BiometricDeviceCertificateInfo) { _cached_decoder_for_BiometricDeviceCertificateInfo = _decode_TBSAttributeCertificate; }
    return _cached_decoder_for_BiometricDeviceCertificateInfo(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricDeviceCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricDeviceCertificateInfo */
let _cached_encoder_for_BiometricDeviceCertificateInfo: $.ASN1Encoder<BiometricDeviceCertificateInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricDeviceCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricDeviceCertificateInfo */
/**
 * @summary Encodes a(n) BiometricDeviceCertificateInfo into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricDeviceCertificateInfo, encoded as an ASN.1 Element.
 */
export
function _encode_BiometricDeviceCertificateInfo (value: BiometricDeviceCertificateInfo, elGetter: $.ASN1Encoder<BiometricDeviceCertificateInfo>) {
    if (!_cached_encoder_for_BiometricDeviceCertificateInfo) { _cached_encoder_for_BiometricDeviceCertificateInfo = _encode_TBSAttributeCertificate; }
    return _cached_encoder_for_BiometricDeviceCertificateInfo(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricDeviceCertificateInfo */

/* eslint-enable */
