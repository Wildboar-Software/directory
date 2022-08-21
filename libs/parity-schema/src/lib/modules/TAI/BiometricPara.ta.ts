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
import { BiometricPara_Item, _decode_BiometricPara_Item, _encode_BiometricPara_Item } from "../TAI/BiometricPara-Item.ta";
export { BiometricPara_Item, _decode_BiometricPara_Item, _encode_BiometricPara_Item } from "../TAI/BiometricPara-Item.ta";


/* START_OF_SYMBOL_DEFINITION BiometricPara */
/**
 * @summary BiometricPara
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * BiometricPara  ::= 
 *   SEQUENCE OF
 *     SEQUENCE {biometricType   BIT STRING,
 *               --CBEFF defined type
 *               fMR-Value       INTEGER(-2147483648..2147483647),
 *               trialNumber     INTEGER OPTIONAL,
 *               requestQuality  INTEGER OPTIONAL,
 *               ...}
 * ```
 */
export
type BiometricPara = BiometricPara_Item[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION BiometricPara */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricPara */
let _cached_decoder_for_BiometricPara: $.ASN1Decoder<BiometricPara> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricPara */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricPara */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricPara
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricPara} The decoded data structure.
 */
export
function _decode_BiometricPara (el: _Element) {
    if (!_cached_decoder_for_BiometricPara) { _cached_decoder_for_BiometricPara = $._decodeSequenceOf<BiometricPara_Item>(() => _decode_BiometricPara_Item); }
    return _cached_decoder_for_BiometricPara(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricPara */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricPara */
let _cached_encoder_for_BiometricPara: $.ASN1Encoder<BiometricPara> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricPara */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricPara */
/**
 * @summary Encodes a(n) BiometricPara into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricPara, encoded as an ASN.1 Element.
 */
export
function _encode_BiometricPara (value: BiometricPara, elGetter: $.ASN1Encoder<BiometricPara>) {
    if (!_cached_encoder_for_BiometricPara) { _cached_encoder_for_BiometricPara = $._encodeSequenceOf<BiometricPara_Item>(() => _encode_BiometricPara_Item, $.BER); }
    return _cached_encoder_for_BiometricPara(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricPara */

/* eslint-enable */
