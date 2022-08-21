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


/* START_OF_SYMBOL_DEFINITION GroupBIT */
/**
 * @summary GroupBIT
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * GroupBIT  ::=  [APPLICATION 97]  SET OF BiometricInformationTemplate
 * ```
 */
export
type GroupBIT = BiometricInformationTemplate[]; // SetOfType
/* END_OF_SYMBOL_DEFINITION GroupBIT */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_GroupBIT */
let _cached_decoder_for_GroupBIT: $.ASN1Decoder<GroupBIT> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_GroupBIT */

/* START_OF_SYMBOL_DEFINITION _decode_GroupBIT */
/**
 * @summary Decodes an ASN.1 element into a(n) GroupBIT
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {GroupBIT} The decoded data structure.
 */
export
function _decode_GroupBIT (el: _Element) {
    if (!_cached_decoder_for_GroupBIT) { _cached_decoder_for_GroupBIT = $._decode_implicit<GroupBIT>(() => $._decodeSetOf<BiometricInformationTemplate>(() => _decode_BiometricInformationTemplate)); }
    return _cached_decoder_for_GroupBIT(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_GroupBIT */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_GroupBIT */
let _cached_encoder_for_GroupBIT: $.ASN1Encoder<GroupBIT> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_GroupBIT */

/* START_OF_SYMBOL_DEFINITION _encode_GroupBIT */
/**
 * @summary Encodes a(n) GroupBIT into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The GroupBIT, encoded as an ASN.1 Element.
 */
export
function _encode_GroupBIT (value: GroupBIT, elGetter: $.ASN1Encoder<GroupBIT>) {
    if (!_cached_encoder_for_GroupBIT) { _cached_encoder_for_GroupBIT = $._encode_implicit(_TagClass.application, 97, () => $._encodeSetOf<BiometricInformationTemplate>(() => _encode_BiometricInformationTemplate, $.BER), $.BER); }
    return _cached_encoder_for_GroupBIT(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_GroupBIT */

/* eslint-enable */
