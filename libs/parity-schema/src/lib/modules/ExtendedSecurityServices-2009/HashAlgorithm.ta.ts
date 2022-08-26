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


/* START_OF_SYMBOL_DEFINITION HashAlgorithm */
/**
 * @summary HashAlgorithm
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * HashAlgorithm  ::=  AlgorithmIdentifier{{SupportedAlgorithms}}
 * ```
 */
export
type HashAlgorithm = AlgorithmIdentifier; // DefinedType
/* END_OF_SYMBOL_DEFINITION HashAlgorithm */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_HashAlgorithm */
let _cached_decoder_for_HashAlgorithm: $.ASN1Decoder<HashAlgorithm> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_HashAlgorithm */

/* START_OF_SYMBOL_DEFINITION _decode_HashAlgorithm */
/**
 * @summary Decodes an ASN.1 element into a(n) HashAlgorithm
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {HashAlgorithm} The decoded data structure.
 */
export
function _decode_HashAlgorithm (el: _Element) {
    if (!_cached_decoder_for_HashAlgorithm) { _cached_decoder_for_HashAlgorithm = _decode_AlgorithmIdentifier; }
    return _cached_decoder_for_HashAlgorithm(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_HashAlgorithm */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_HashAlgorithm */
let _cached_encoder_for_HashAlgorithm: $.ASN1Encoder<HashAlgorithm> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_HashAlgorithm */

/* START_OF_SYMBOL_DEFINITION _encode_HashAlgorithm */
/**
 * @summary Encodes a(n) HashAlgorithm into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The HashAlgorithm, encoded as an ASN.1 Element.
 */
export
function _encode_HashAlgorithm (value: HashAlgorithm, elGetter: $.ASN1Encoder<HashAlgorithm>) {
    if (!_cached_encoder_for_HashAlgorithm) { _cached_encoder_for_HashAlgorithm = _encode_AlgorithmIdentifier; }
    return _cached_encoder_for_HashAlgorithm(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_HashAlgorithm */

/* eslint-enable */
