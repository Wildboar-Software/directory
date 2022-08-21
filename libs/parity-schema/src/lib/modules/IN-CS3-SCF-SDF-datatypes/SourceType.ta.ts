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
import { DistinguishedName, _decode_DistinguishedName, _encode_DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
export { DistinguishedName, _decode_DistinguishedName, _encode_DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";


/* START_OF_SYMBOL_DEFINITION SourceType */
/**
 * @summary SourceType
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * SourceType  ::=  DistinguishedName
 * ```
 */
export
type SourceType = DistinguishedName; // DefinedType
/* END_OF_SYMBOL_DEFINITION SourceType */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SourceType */
let _cached_decoder_for_SourceType: $.ASN1Decoder<SourceType> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SourceType */

/* START_OF_SYMBOL_DEFINITION _decode_SourceType */
/**
 * @summary Decodes an ASN.1 element into a(n) SourceType
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SourceType} The decoded data structure.
 */
export
function _decode_SourceType (el: _Element) {
    if (!_cached_decoder_for_SourceType) { _cached_decoder_for_SourceType = _decode_DistinguishedName; }
    return _cached_decoder_for_SourceType(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SourceType */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SourceType */
let _cached_encoder_for_SourceType: $.ASN1Encoder<SourceType> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SourceType */

/* START_OF_SYMBOL_DEFINITION _encode_SourceType */
/**
 * @summary Encodes a(n) SourceType into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SourceType, encoded as an ASN.1 Element.
 */
export
function _encode_SourceType (value: SourceType, elGetter: $.ASN1Encoder<SourceType>) {
    if (!_cached_encoder_for_SourceType) { _cached_encoder_for_SourceType = _encode_DistinguishedName; }
    return _cached_encoder_for_SourceType(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SourceType */

/* eslint-enable */
