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
import { Sidechain, _decode_Sidechain, _encode_Sidechain } from "../OtherAutomaticallyTaggedTypes/Sidechain.ta";
export { Sidechain, _decode_Sidechain, _encode_Sidechain } from "../OtherAutomaticallyTaggedTypes/Sidechain.ta";


/* START_OF_SYMBOL_DEFINITION Sidechains */
/**
 * @summary Sidechains
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * Sidechains     ::=  SEQUENCE (SIZE(0..MAX)) OF linked Sidechain
 * ```
 */
export
type Sidechains = Sidechain[]; // SequenceOfType
/* END_OF_SYMBOL_DEFINITION Sidechains */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Sidechains */
let _cached_decoder_for_Sidechains: $.ASN1Decoder<Sidechains> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Sidechains */

/* START_OF_SYMBOL_DEFINITION _decode_Sidechains */
/**
 * @summary Decodes an ASN.1 element into a(n) Sidechains
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Sidechains} The decoded data structure.
 */
export
function _decode_Sidechains (el: _Element) {
    if (!_cached_decoder_for_Sidechains) { _cached_decoder_for_Sidechains = $._decodeSequenceOf<Sidechain>(() => _decode_Sidechain); }
    return _cached_decoder_for_Sidechains(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Sidechains */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Sidechains */
let _cached_encoder_for_Sidechains: $.ASN1Encoder<Sidechains> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Sidechains */

/* START_OF_SYMBOL_DEFINITION _encode_Sidechains */
/**
 * @summary Encodes a(n) Sidechains into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Sidechains, encoded as an ASN.1 Element.
 */
export
function _encode_Sidechains (value: Sidechains, elGetter: $.ASN1Encoder<Sidechains>) {
    if (!_cached_encoder_for_Sidechains) { _cached_encoder_for_Sidechains = $._encodeSequenceOf<Sidechain>(() => _encode_Sidechain, $.BER); }
    return _cached_encoder_for_Sidechains(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Sidechains */

/* eslint-enable */
