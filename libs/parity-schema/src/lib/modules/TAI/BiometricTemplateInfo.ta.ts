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
import { BiometricInformationTemplate, _decode_BiometricInformationTemplate, _encode_BiometricInformationTemplate } from "../CBEFF-SMARTCARD-BIDO/BiometricInformationTemplate.ta";
export { BiometricInformationTemplate, _decode_BiometricInformationTemplate, _encode_BiometricInformationTemplate } from "../CBEFF-SMARTCARD-BIDO/BiometricInformationTemplate.ta";


/* START_OF_SYMBOL_DEFINITION BiometricTemplateInfo */
/**
 * @summary BiometricTemplateInfo
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * BiometricTemplateInfo  ::=  CHOICE {
 *   biometricTemplateInfo19785  BiometricInformationTemplate,
 *   ...
 * }
 * ```
 */
export
type BiometricTemplateInfo =
    { biometricTemplateInfo19785: BiometricInformationTemplate } /* CHOICE_ALT_ROOT */
    | _Element /* CHOICE_ALT_UNRECOGNIZED_EXT */;
/* END_OF_SYMBOL_DEFINITION BiometricTemplateInfo */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricTemplateInfo */
let _cached_decoder_for_BiometricTemplateInfo: $.ASN1Decoder<BiometricTemplateInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricTemplateInfo */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricTemplateInfo */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricTemplateInfo
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricTemplateInfo} The decoded data structure.
 */
export
function _decode_BiometricTemplateInfo (el: _Element) {
    if (!_cached_decoder_for_BiometricTemplateInfo) { _cached_decoder_for_BiometricTemplateInfo = $._decode_extensible_choice<BiometricTemplateInfo>({
    "CONTEXT 0": [ "biometricTemplateInfo19785", _decode_BiometricInformationTemplate ]
}); }
    return _cached_decoder_for_BiometricTemplateInfo(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricTemplateInfo */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricTemplateInfo */
let _cached_encoder_for_BiometricTemplateInfo: $.ASN1Encoder<BiometricTemplateInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricTemplateInfo */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricTemplateInfo */
/**
 * @summary Encodes a(n) BiometricTemplateInfo into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricTemplateInfo, encoded as an ASN.1 Element.
 */
export
function _encode_BiometricTemplateInfo (value: BiometricTemplateInfo, elGetter: $.ASN1Encoder<BiometricTemplateInfo>) {
    if (!_cached_encoder_for_BiometricTemplateInfo) { _cached_encoder_for_BiometricTemplateInfo = $._encode_choice<BiometricTemplateInfo>({
    "biometricTemplateInfo19785": _encode_BiometricInformationTemplate,
}, $.BER); }
    return _cached_encoder_for_BiometricTemplateInfo(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricTemplateInfo */

/* eslint-enable */
