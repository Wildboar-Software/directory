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


/* START_OF_SYMBOL_DEFINITION BiometricPolicyCertificateInfo */
/**
 * @summary BiometricPolicyCertificateInfo
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * BiometricPolicyCertificateInfo  ::= 
 *   AttributeCertificateInfo(WITH COMPONENTS {
 *                              ...,
 *                              attributes  (SIZE (1..MAX))
 *                            })
 * ```
 */
export
type BiometricPolicyCertificateInfo = TBSAttributeCertificate; // DefinedType
/* END_OF_SYMBOL_DEFINITION BiometricPolicyCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricPolicyCertificateInfo */
let _cached_decoder_for_BiometricPolicyCertificateInfo: $.ASN1Decoder<BiometricPolicyCertificateInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricPolicyCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricPolicyCertificateInfo */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricPolicyCertificateInfo
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricPolicyCertificateInfo} The decoded data structure.
 */
export
function _decode_BiometricPolicyCertificateInfo (el: _Element) {
    if (!_cached_decoder_for_BiometricPolicyCertificateInfo) { _cached_decoder_for_BiometricPolicyCertificateInfo = _decode_TBSAttributeCertificate; }
    return _cached_decoder_for_BiometricPolicyCertificateInfo(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricPolicyCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricPolicyCertificateInfo */
let _cached_encoder_for_BiometricPolicyCertificateInfo: $.ASN1Encoder<BiometricPolicyCertificateInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricPolicyCertificateInfo */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricPolicyCertificateInfo */
/**
 * @summary Encodes a(n) BiometricPolicyCertificateInfo into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricPolicyCertificateInfo, encoded as an ASN.1 Element.
 */
export
function _encode_BiometricPolicyCertificateInfo (value: BiometricPolicyCertificateInfo, elGetter: $.ASN1Encoder<BiometricPolicyCertificateInfo>) {
    if (!_cached_encoder_for_BiometricPolicyCertificateInfo) { _cached_encoder_for_BiometricPolicyCertificateInfo = _encode_TBSAttributeCertificate; }
    return _cached_encoder_for_BiometricPolicyCertificateInfo(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricPolicyCertificateInfo */

/* eslint-enable */
