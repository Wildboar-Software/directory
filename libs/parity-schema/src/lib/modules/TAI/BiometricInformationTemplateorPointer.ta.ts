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
import { BCBiometricInformationTemplate, _decode_BCBiometricInformationTemplate, _encode_BCBiometricInformationTemplate } from "../TAI/BCBiometricInformationTemplate.ta";
export { BCBiometricInformationTemplate, _decode_BCBiometricInformationTemplate, _encode_BCBiometricInformationTemplate } from "../TAI/BCBiometricInformationTemplate.ta";
import { URI, _decode_URI, _encode_URI } from "../TAI/URI.ta";
export { URI, _decode_URI, _encode_URI } from "../TAI/URI.ta";


/* START_OF_SYMBOL_DEFINITION BiometricInformationTemplateorPointer */
/**
 * @summary BiometricInformationTemplateorPointer
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * BiometricInformationTemplateorPointer  ::=  CHOICE {
 *   bcBiometricInformationTemplate             BCBiometricInformationTemplate,
 *   referenceToBCBiometricInformationTemplate  URI,
 *   ...
 * }
 * ```
 */
export
type BiometricInformationTemplateorPointer =
    { bcBiometricInformationTemplate: BCBiometricInformationTemplate } /* CHOICE_ALT_ROOT */
    | { referenceToBCBiometricInformationTemplate: URI } /* CHOICE_ALT_ROOT */
    | _Element /* CHOICE_ALT_UNRECOGNIZED_EXT */;
/* END_OF_SYMBOL_DEFINITION BiometricInformationTemplateorPointer */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricInformationTemplateorPointer */
let _cached_decoder_for_BiometricInformationTemplateorPointer: $.ASN1Decoder<BiometricInformationTemplateorPointer> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricInformationTemplateorPointer */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricInformationTemplateorPointer */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricInformationTemplateorPointer
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricInformationTemplateorPointer} The decoded data structure.
 */
export
function _decode_BiometricInformationTemplateorPointer (el: _Element) {
    if (!_cached_decoder_for_BiometricInformationTemplateorPointer) { _cached_decoder_for_BiometricInformationTemplateorPointer = $._decode_extensible_choice<BiometricInformationTemplateorPointer>({
    "CONTEXT 0": [ "bcBiometricInformationTemplate", _decode_BCBiometricInformationTemplate ],
    "CONTEXT 1": [ "referenceToBCBiometricInformationTemplate", _decode_URI ]
}); }
    return _cached_decoder_for_BiometricInformationTemplateorPointer(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricInformationTemplateorPointer */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricInformationTemplateorPointer */
let _cached_encoder_for_BiometricInformationTemplateorPointer: $.ASN1Encoder<BiometricInformationTemplateorPointer> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricInformationTemplateorPointer */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricInformationTemplateorPointer */
/**
 * @summary Encodes a(n) BiometricInformationTemplateorPointer into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricInformationTemplateorPointer, encoded as an ASN.1 Element.
 */
export
function _encode_BiometricInformationTemplateorPointer (value: BiometricInformationTemplateorPointer, elGetter: $.ASN1Encoder<BiometricInformationTemplateorPointer>) {
    if (!_cached_encoder_for_BiometricInformationTemplateorPointer) { _cached_encoder_for_BiometricInformationTemplateorPointer = $._encode_choice<BiometricInformationTemplateorPointer>({
    "bcBiometricInformationTemplate": _encode_BCBiometricInformationTemplate,
    "referenceToBCBiometricInformationTemplate": _encode_URI,
}, $.BER); }
    return _cached_encoder_for_BiometricInformationTemplateorPointer(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricInformationTemplateorPointer */

/* eslint-enable */
