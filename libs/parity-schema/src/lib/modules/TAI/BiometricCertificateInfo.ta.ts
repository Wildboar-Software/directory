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


/* START_OF_SYMBOL_DEFINITION BiometricCertificateInfo */
/**
 * @summary BiometricCertificateInfo
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * BiometricCertificateInfo  ::= 
 *   AttributeCertificateInfo(WITH COMPONENTS {
 *                              ...,
 *                              attributes  (SIZE (1..MAX))
 *                            })
 * ```
 */
export
type BiometricCertificateInfo = TBSAttributeCertificate; // DefinedType
/* END_OF_SYMBOL_DEFINITION BiometricCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricCertificateInfo */
let _cached_decoder_for_BiometricCertificateInfo: $.ASN1Decoder<BiometricCertificateInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricCertificateInfo */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricCertificateInfo
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricCertificateInfo} The decoded data structure.
 */
export
function _decode_BiometricCertificateInfo (el: _Element) {
    if (!_cached_decoder_for_BiometricCertificateInfo) { _cached_decoder_for_BiometricCertificateInfo = _decode_TBSAttributeCertificate; }
    return _cached_decoder_for_BiometricCertificateInfo(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricCertificateInfo */
let _cached_encoder_for_BiometricCertificateInfo: $.ASN1Encoder<BiometricCertificateInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricCertificateInfo */
/**
 * @summary Encodes a(n) BiometricCertificateInfo into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricCertificateInfo, encoded as an ASN.1 Element.
 */
export
function _encode_BiometricCertificateInfo (value: BiometricCertificateInfo, elGetter: $.ASN1Encoder<BiometricCertificateInfo>) {
    if (!_cached_encoder_for_BiometricCertificateInfo) { _cached_encoder_for_BiometricCertificateInfo = _encode_TBSAttributeCertificate; }
    return _cached_encoder_for_BiometricCertificateInfo(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricCertificateInfo */

/* eslint-enable */
