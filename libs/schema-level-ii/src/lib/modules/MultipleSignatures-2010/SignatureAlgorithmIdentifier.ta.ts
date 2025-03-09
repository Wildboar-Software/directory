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
import { AlgorithmIdentifier, _decode_AlgorithmIdentifier, _encode_AlgorithmIdentifier } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";
export { AlgorithmIdentifier, _decode_AlgorithmIdentifier, _encode_AlgorithmIdentifier } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";


/* START_OF_SYMBOL_DEFINITION SignatureAlgorithmIdentifier */
/**
 * @summary SignatureAlgorithmIdentifier
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * SignatureAlgorithmIdentifier  ::=  AlgorithmIdentifier{{SupportedAlgorithms}}
 * ```
 */
export
type SignatureAlgorithmIdentifier = AlgorithmIdentifier; // DefinedType
/* END_OF_SYMBOL_DEFINITION SignatureAlgorithmIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SignatureAlgorithmIdentifier */
let _cached_decoder_for_SignatureAlgorithmIdentifier: $.ASN1Decoder<SignatureAlgorithmIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SignatureAlgorithmIdentifier */

/* START_OF_SYMBOL_DEFINITION _decode_SignatureAlgorithmIdentifier */
/**
 * @summary Decodes an ASN.1 element into a(n) SignatureAlgorithmIdentifier
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SignatureAlgorithmIdentifier} The decoded data structure.
 */
export
function _decode_SignatureAlgorithmIdentifier (el: _Element) {
    if (!_cached_decoder_for_SignatureAlgorithmIdentifier) { _cached_decoder_for_SignatureAlgorithmIdentifier = _decode_AlgorithmIdentifier; }
    return _cached_decoder_for_SignatureAlgorithmIdentifier(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SignatureAlgorithmIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SignatureAlgorithmIdentifier */
let _cached_encoder_for_SignatureAlgorithmIdentifier: $.ASN1Encoder<SignatureAlgorithmIdentifier> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SignatureAlgorithmIdentifier */

/* START_OF_SYMBOL_DEFINITION _encode_SignatureAlgorithmIdentifier */
/**
 * @summary Encodes a(n) SignatureAlgorithmIdentifier into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SignatureAlgorithmIdentifier, encoded as an ASN.1 Element.
 */
export
function _encode_SignatureAlgorithmIdentifier (value: SignatureAlgorithmIdentifier, elGetter: $.ASN1Encoder<SignatureAlgorithmIdentifier>) {
    if (!_cached_encoder_for_SignatureAlgorithmIdentifier) { _cached_encoder_for_SignatureAlgorithmIdentifier = _encode_AlgorithmIdentifier; }
    return _cached_encoder_for_SignatureAlgorithmIdentifier(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SignatureAlgorithmIdentifier */

/* eslint-enable */
